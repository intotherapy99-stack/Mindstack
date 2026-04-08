import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculatePlatformFee, rupeesToPaise } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { supervisorId, scheduledAt, duration, modality, caseContext } = body;

  // Rule 1: Cannot book own supervision
  if (supervisorId === session.user.id) {
    return NextResponse.json(
      { error: "You cannot book supervision with yourself" },
      { status: 400 }
    );
  }

  // Rule 2: Supervisor must offer supervision
  const supervisorProfile = await prisma.profile.findUnique({
    where: { userId: supervisorId },
  });

  if (!supervisorProfile?.offersSupervision) {
    return NextResponse.json(
      { error: "This professional is not offering supervision" },
      { status: 400 }
    );
  }

  // Rule 3: Check slot within availability window
  const sessionDate = new Date(scheduledAt);
  const dayOfWeek = sessionDate.getDay();
  const timeStr = `${String(sessionDate.getHours()).padStart(2, "0")}:${String(sessionDate.getMinutes()).padStart(2, "0")}`;

  const availability = await prisma.availability.findFirst({
    where: {
      userId: supervisorId,
      dayOfWeek,
      isActive: true,
      startTime: { lte: timeStr },
      endTime: { gte: timeStr },
    },
  });

  if (!availability) {
    return NextResponse.json(
      { error: "Selected time is not within supervisor's availability" },
      { status: 400 }
    );
  }

  // Rule 4: No double-booking
  const sessionEnd = new Date(sessionDate.getTime() + duration * 60000);
  const overlapping = await prisma.supervisionSession.findFirst({
    where: {
      supervisorId,
      status: { in: ["CONFIRMED", "PENDING"] },
      scheduledAt: { lt: sessionEnd },
      AND: {
        scheduledAt: {
          gte: new Date(sessionDate.getTime() - duration * 60000),
        },
      },
    },
  });

  if (overlapping) {
    return NextResponse.json(
      { error: "This time slot is already booked" },
      { status: 409 }
    );
  }

  // Calculate fees (amounts in INR, stored as INR integers)
  const fee = supervisorProfile.supervisionFee || 1800;
  const platformFee = calculatePlatformFee(fee);

  const supervisionSession = await prisma.supervisionSession.create({
    data: {
      superviseeId: session.user.id,
      supervisorId,
      scheduledAt: sessionDate,
      duration,
      modality,
      sessionType: "INDIVIDUAL",
      status: "PENDING", // Will become CONFIRMED after payment
      amountCharged: fee,
      platformFee,
      casePresented: caseContext || null,
    },
  });

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: supervisorId,
        type: "BOOKING_CONFIRMED",
        title: "New supervision booking",
        body: `You have a new supervision session request for ${sessionDate.toLocaleDateString("en-IN")}`,
        link: `/supervision/sessions/${supervisionSession.id}`,
      },
      {
        userId: session.user.id,
        type: "BOOKING_CONFIRMED",
        title: "Booking submitted",
        body: `Your supervision session is pending confirmation`,
        link: `/supervision/sessions/${supervisionSession.id}`,
      },
    ],
  });

  return NextResponse.json(supervisionSession, { status: 201 });
}
