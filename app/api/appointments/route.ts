import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  const appointment = await prisma.appointment.create({
    data: {
      practitionerId: session.user.id,
      clientId,
      scheduledAt: new Date(scheduledAt),
      duration: duration || 50,
      sessionType: sessionType || "FOLLOW_UP",
      modality: modality || "IN_PERSON",
      fee: fee || null,
    },
  });

  return NextResponse.json(appointment, { status: 201 });
}
