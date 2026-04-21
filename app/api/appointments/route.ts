import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { syncAppointmentToGoogle } from "@/lib/google-calendar";
import { sendAppointmentConfirmation } from "@/lib/email";
import { sendBookingConfirmationWhatsApp } from "@/lib/msg91";
import { format } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const where: any = { practitionerId: session.user.id };

  if (start && end) {
    where.scheduledAt = {
      gte: new Date(start),
      lte: new Date(end),
    };
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      client: { select: { firstName: true, lastName: true } },
      note: { select: { id: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });

  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { clientId, scheduledAt, duration, sessionType, modality, fee } = body;

  if (!clientId || !scheduledAt) {
    return NextResponse.json(
      { error: "Client and date/time are required" },
      { status: 400 }
    );
  }

  // Check subscription limits for FREE tier
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (subscription?.plan === "FREE") {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyCount = await prisma.appointment.count({
      where: {
        practitionerId: session.user.id,
        createdAt: { gte: thisMonth },
      },
    });

    if (monthlyCount >= 10) {
      return NextResponse.json(
        { error: "Free plan is limited to 10 appointments/month. Upgrade for unlimited." },
        { status: 403 }
      );
    }
  }

  // Verify the client belongs to this practitioner (prevent cross-tenant access)
  if (clientId) {
    const ownedClient = await prisma.client.findFirst({
      where: { id: clientId, practitionerId: session.user.id },
      select: { id: true },
    });
    if (!ownedClient) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
  }

  // Generate meeting link for online sessions (Jitsi fallback)
  let meetingLink: string | undefined;
  if ((modality || "IN_PERSON") === "ONLINE") {
    meetingLink = `https://meet.jit.si/mindstack-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
  }

  const appointment = await prisma.appointment.create({
    data: {
      practitionerId: session.user.id,
      clientId,
      scheduledAt: new Date(scheduledAt),
      duration: duration || 50,
      sessionType: sessionType || "FOLLOW_UP",
      modality: modality || "IN_PERSON",
      fee: fee || null,
      meetingLink: meetingLink || null,
    },
    include: {
      client: { select: { firstName: true, lastName: true, email: true, phone: true } },
    },
  });

  // Sync to Google Calendar (may upgrade meeting link to Google Meet)
  const calResult = await syncAppointmentToGoogle({
    id: appointment.id,
    practitionerId: session.user.id,
    scheduledAt: appointment.scheduledAt,
    duration: appointment.duration,
    modality: appointment.modality,
    meetingLink: appointment.meetingLink,
    client: appointment.client ? {
      firstName: appointment.client.firstName,
      lastName: appointment.client.lastName || undefined,
    } : undefined,
    googleEventId: undefined,
    googleCalendarId: undefined,
  });

  if (calResult) {
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        googleEventId: calResult.googleEventId,
        googleCalendarId: calResult.googleCalendarId,
        meetingLink: calResult.meetingLink || appointment.meetingLink,
      },
    });
    if (calResult.meetingLink) meetingLink = calResult.meetingLink;
  }

  // Send confirmation email to client
  const practitionerProfile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { displayName: true },
  });

  if (appointment.client?.email) {
    const dateStr = format(new Date(scheduledAt), "dd MMM yyyy");
    const timeStr = format(new Date(scheduledAt), "hh:mm a");
    await sendAppointmentConfirmation(appointment.client.email, {
      practitionerName: practitionerProfile?.displayName || "Your practitioner",
      clientName: appointment.client.firstName,
      date: dateStr,
      time: timeStr,
      modality: modality || "IN_PERSON",
      meetingLink: meetingLink,
    }).catch((err) => console.error("[appointments] email failed:", err));
  }

  // Send WhatsApp confirmation to client
  if (appointment.client?.phone) {
    const dateStr = format(new Date(scheduledAt), "dd MMM yyyy");
    const timeStr = format(new Date(scheduledAt), "hh:mm a");
    await sendBookingConfirmationWhatsApp(appointment.client.phone, {
      practitionerName: practitionerProfile?.displayName || "Your practitioner",
      date: dateStr,
      time: timeStr,
    }).catch((err) => console.error("[appointments] whatsapp failed:", err));
  }

  return NextResponse.json(appointment, { status: 201 });
}
