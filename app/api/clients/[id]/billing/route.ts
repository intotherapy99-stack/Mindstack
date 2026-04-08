import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — get billing summary for a client
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await prisma.client.findFirst({
    where: { id: params.id, practitionerId: session.user.id },
    include: {
      appointments: {
        where: { status: { in: ["COMPLETED", "CONFIRMED"] } },
        orderBy: { scheduledAt: "desc" },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
      practitioner: {
        include: { profile: { select: { sessionFee: true } } },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  // Determine per-session fee: client override > practitioner default
  const sessionFee = client.sessionFee ?? client.practitioner.profile?.sessionFee ?? 0;

  // Count completed sessions
  const completedSessions = client.appointments.filter((a) => a.status === "COMPLETED").length;
  const confirmedUpcoming = client.appointments.filter(
    (a) => a.status === "CONFIRMED" && new Date(a.scheduledAt) > new Date()
  ).length;

  // Calculate amounts
  const totalOwed = completedSessions * sessionFee;
  const totalPaid = client.payments
    .filter((p) => p.status === "RECEIVED")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = client.payments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);
  const balanceDue = totalOwed - totalPaid;

  // Monthly breakdown (current month)
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const thisMonthSessions = client.appointments.filter(
    (a) =>
      a.status === "COMPLETED" &&
      new Date(a.scheduledAt) >= monthStart &&
      new Date(a.scheduledAt) <= monthEnd
  ).length;

  const thisMonthPayments = client.payments
    .filter(
      (p) =>
        p.status === "RECEIVED" &&
        new Date(p.createdAt) >= monthStart &&
        new Date(p.createdAt) <= monthEnd
    )
    .reduce((sum, p) => sum + p.amount, 0);

  const thisMonthOwed = thisMonthSessions * sessionFee;
  const thisMonthBalance = thisMonthOwed - thisMonthPayments;

  return NextResponse.json({
    sessionFee,
    sessionsPerMonth: client.sessionsPerMonth,
    completedSessions,
    confirmedUpcoming,
    totalOwed,
    totalPaid,
    totalPending,
    balanceDue,
    thisMonth: {
      sessions: thisMonthSessions,
      expected: client.sessionsPerMonth || null,
      owed: thisMonthOwed,
      paid: thisMonthPayments,
      balance: thisMonthBalance,
    },
    recentPayments: client.payments.slice(0, 5).map((p) => ({
      id: p.id,
      amount: p.amount,
      method: p.method,
      status: p.status,
      date: p.sessionDate || p.createdAt,
      description: p.description,
    })),
  });
}

// PATCH — update billing settings for a client
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { sessionFee, sessionsPerMonth } = body;

  const client = await prisma.client.findFirst({
    where: { id: params.id, practitionerId: session.user.id },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const updated = await prisma.client.update({
    where: { id: params.id },
    data: {
      sessionFee: sessionFee !== undefined ? sessionFee : undefined,
      sessionsPerMonth: sessionsPerMonth !== undefined ? sessionsPerMonth : undefined,
    },
  });

  return NextResponse.json({
    sessionFee: updated.sessionFee,
    sessionsPerMonth: updated.sessionsPerMonth,
  });
}
