import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Current month received payments
  const currentMonthPayments = await prisma.payment.findMany({
    where: {
      practitionerId: session.user.id,
      status: "RECEIVED",
      createdAt: { gte: monthStart, lte: monthEnd },
    },
  });

  const totalThisMonth = currentMonthPayments.reduce(
    (sum: number, p: any) => sum + p.amount,
    0
  );

  // Outstanding: PENDING + OVERDUE payments
  const outstanding = await prisma.payment.aggregate({
    where: {
      practitionerId: session.user.id,
      status: { in: ["PENDING", "OVERDUE"] },
    },
    _sum: { amount: true },
    _count: true,
  });

  // Overdue payments (PENDING past due date)
  const overduePayments = await prisma.payment.findMany({
    where: {
      practitionerId: session.user.id,
      status: "PENDING",
      dueDate: { lt: now },
    },
    select: { id: true },
  });

  // Auto-mark overdue
  if (overduePayments.length > 0) {
    await prisma.payment.updateMany({
      where: { id: { in: overduePayments.map((p) => p.id) } },
      data: { status: "OVERDUE" },
    });
  }

  // Per-client outstanding balances (top 10)
  const clientBalances = await prisma.payment.groupBy({
    by: ["clientId"],
    where: {
      practitionerId: session.user.id,
      status: { in: ["PENDING", "OVERDUE"] },
      clientId: { not: null },
    },
    _sum: { amount: true },
    _count: true,
    orderBy: { _sum: { amount: "desc" } },
    take: 10,
  });

  // Fetch client names for the balances
  const clientIds = clientBalances
    .map((b) => b.clientId)
    .filter(Boolean) as string[];

  const clients = await prisma.client.findMany({
    where: { id: { in: clientIds } },
    select: { id: true, firstName: true, lastName: true },
  });

  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c]));

  const topOutstanding = clientBalances.map((b) => ({
    clientId: b.clientId,
    clientName: b.clientId
      ? `${clientMap[b.clientId]?.firstName || ""} ${clientMap[b.clientId]?.lastName || ""}`.trim()
      : "Unknown",
    amount: b._sum.amount || 0,
    count: b._count,
  }));

  // Last 6 months for chart
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

    const payments = await prisma.payment.findMany({
      where: {
        practitionerId: session.user.id,
        status: "RECEIVED",
        createdAt: { gte: start, lte: end },
      },
    });

    monthlyData.push({
      month: start.toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      }),
      revenue: payments.reduce((sum: number, p: any) => sum + p.amount, 0),
      sessions: payments.length,
    });
  }

  return NextResponse.json({
    totalThisMonth,
    sessionsThisMonth: currentMonthPayments.length,
    outstandingTotal: outstanding._sum.amount || 0,
    outstandingCount: outstanding._count || 0,
    overdueCount: overduePayments.length,
    topOutstanding,
    monthlyData,
  });
}
