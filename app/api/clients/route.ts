import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const practitionerProfile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { sessionFee: true },
  });

  const defaultFee = practitionerProfile?.sessionFee ?? 0;

  const clients = await prisma.client.findMany({
    where: { practitionerId: session.user.id },
    include: {
      appointments: {
        orderBy: { scheduledAt: "desc" },
        select: { scheduledAt: true, status: true },
      },
      payments: {
        select: { amount: true, status: true },
      },
      _count: { select: { appointments: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const enriched = clients.map((client: any) => {
    const fee = client.sessionFee ?? defaultFee;
    const completedSessions = client.appointments.filter(
      (a: any) => a.status === "COMPLETED"
    ).length;
    const totalOwed = completedSessions * fee;
    const totalPaid = client.payments
      .filter((p: any) => p.status === "RECEIVED")
      .reduce((sum: number, p: any) => sum + p.amount, 0);
    const balanceDue = totalOwed - totalPaid;

    return {
      ...client,
      lastSession: client.appointments[0]?.scheduledAt || null,
      totalSessions: client._count.appointments,
      completedSessions,
      totalPaid,
      totalOwed,
      balanceDue,
      outstandingBalance: balanceDue > 0 ? balanceDue : 0,
      sessionFee: fee,
    };
  });

  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    gender,
    occupation,
    presentingConcern,
    referralSource,
  } = body;

  if (!firstName) {
    return NextResponse.json(
      { error: "First name is required" },
      { status: 400 }
    );
  }

  // Check subscription limits
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (subscription?.plan === "FREE") {
    const clientCount = await prisma.client.count({
      where: { practitionerId: session.user.id, status: "ACTIVE" },
    });
    if (clientCount >= 5) {
      return NextResponse.json(
        { error: "Free plan is limited to 5 active clients. Upgrade to add more." },
        { status: 403 }
      );
    }
  }

  const client = await prisma.client.create({
    data: {
      practitionerId: session.user.id,
      firstName,
      lastName: lastName || null,
      email: email || null,
      phone: phone || null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender: gender || null,
      occupation: occupation || null,
      presentingConcern: presentingConcern || null,
      referralSource: referralSource || null,
    },
  });

  return NextResponse.json(client, { status: 201 });
}
