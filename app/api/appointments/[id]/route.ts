import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPaymentForCompletedAppointment } from "@/lib/billing";
import { syncAppointmentToGoogle, deleteGoogleCalendarEvent } from "@/lib/google-calendar";

// GET — single appointment with payment info
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appointment = await prisma.appointment.findFirst({
    where: { id: params.id, practitionerId: session.user.id },
    include: {
      client: { select: { id: true, firstName: true, lastName: true, sessionFee: true } },
      note: { select: { id: true } },
      payment: {
        select: {
          id: true,
          amount: true,
          status: true,
          method: true,
          paidAt: true,
        },
      },
    },
  });

  if (!appointment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(appointment);
}

// PATCH — update appointment status, triggers auto-payment on COMPLETED
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appointment = await prisma.appointment.findFirst({
    where: { id: params.id, practitionerId: session.user.id },
  });

  if (!appointment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { status, fee, noShow, cancelReason } = body;

  const data: any = {};
  if (status) data.status = status;
  if (fee !== undefined) data.fee = fee;
  if (noShow !== undefined) data.noShow = noShow;
  if (cancelReason) data.cancelReason = cancelReason;

  const updated = await prisma.appointment.update({
    where: { id: params.id },
    data,
    include: {
      client: { select: { firstName: true, lastName: true } },
    },
  });

  // Sync cancellation to Google Calendar
  if (status === "CANCELLED" && appointment.googleEventId) {
    await deleteGoogleCalendarEvent(
      session.user.id,
      appointment.googleEventId,
      appointment.googleCalendarId || undefined,
    ).catch((err) => console.error("[appointments] gcal delete failed:", err));
  }

  // Sync updates (non-cancel) to Google Calendar
  if (status && status !== "CANCELLED" && appointment.googleEventId) {
    await syncAppointmentToGoogle({
      id: updated.id,
      practitionerId: session.user.id,
      scheduledAt: updated.scheduledAt,
      duration: updated.duration,
      modality: updated.modality,
      meetingLink: updated.meetingLink,
      client: updated.client ? {
        firstName: updated.client.firstName,
        lastName: updated.client.lastName || undefined,
      } : undefined,
      googleEventId: updated.googleEventId || undefined,
      googleCalendarId: updated.googleCalendarId || undefined,
    }).catch((err) => console.error("[appointments] gcal sync failed:", err));
  }

  // Auto-create PENDING payment when marked COMPLETED
  if (status === "COMPLETED") {
    await createPaymentForCompletedAppointment(params.id);
  }

  return NextResponse.json(updated);
}
