import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiRateLimit } from "@/lib/rate-limit";
import { startOfWeek, endOfWeek, subWeeks, startOfMonth, subMonths, subDays, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const IST = "Asia/Kolkata";

export async function GET(request: NextRequest) {
  const limited = apiRateLimit(request);
  if (limited) return limited;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use IST for date-boundary calculations so week/month boundaries
  // match the practitioner's local day, not the UTC server clock.
  const now = toZonedTime(new Date(), IST);
  const userId = session.user.id;

  // Read optional from/to query params
  const { searchParams } = new URL(request.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const hasCustomRange = fromParam && toParam;
  const rangeFrom = hasCustomRange ? parseISO(fromParam) : undefined;
  const rangeTo = hasCustomRange ? parseISO(toParam) : undefined;
  // Ensure rangeTo covers the full day
  if (rangeTo) {
    rangeTo.setHours(23, 59, 59, 999);
  }

  // Sessions this week vs last week (use custom range if provided)
  const thisWeekStart = rangeFrom ?? startOfWeek(now, { weekStartsOn: 1 });
  const thisWeekEnd = rangeTo ?? endOfWeek(now, { weekStartsOn: 1 });

  // For comparison period, shift back by the same duration
  const rangeDurationMs = thisWeekEnd.getTime() - thisWeekStart.getTime();
  const lastWeekStart = hasCustomRange
    ? new Date(thisWeekStart.getTime() - rangeDurationMs)
    : startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
  const lastWeekEnd = hasCustomRange
    ? new Date(thisWeekStart.getTime() - 1)
    : endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

  const [sessionsThisWeek, sessionsLastWeek] = await Promise.all([
    prisma.appointment.count({
      where: {
        practitionerId: userId,
        scheduledAt: { gte: thisWeekStart, lte: thisWeekEnd },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.appointment.count({
      where: {
        practitionerId: userId,
        scheduledAt: { gte: lastWeekStart, lte: lastWeekEnd },
        status: { not: "CANCELLED" },
      },
    }),
  ]);

  // Revenue this month vs last month (use custom range if provided)
  const revenueStart = rangeFrom ?? startOfMonth(now);
  const revenueEnd = rangeTo ?? now;
  const revenueDurationMs = revenueEnd.getTime() - revenueStart.getTime();
  const prevRevenueStart = hasCustomRange
    ? new Date(revenueStart.getTime() - revenueDurationMs)
    : startOfMonth(subMonths(now, 1));
  const prevRevenueEnd = hasCustomRange
    ? new Date(revenueStart.getTime() - 1)
    : new Date(startOfMonth(now).getTime() - 1);

  const [revenueThisMonthAgg, revenueLastMonthAgg] = await Promise.all([
    prisma.payment.aggregate({
      where: {
        practitionerId: userId,
        status: "RECEIVED",
        createdAt: { gte: revenueStart, lte: revenueEnd },
      },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: {
        practitionerId: userId,
        status: "RECEIVED",
        createdAt: { gte: prevRevenueStart, lte: prevRevenueEnd },
      },
      _sum: { amount: true },
    }),
  ]);

  // No-show rate (use custom range or last 30 days)
  const noShowFrom = rangeFrom ?? subDays(now, 30);
  const noShowTo = rangeTo ?? now;
  const [totalAppointments, noShows] = await Promise.all([
    prisma.appointment.count({
      where: {
        practitionerId: userId,
        scheduledAt: { gte: noShowFrom, lte: noShowTo },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.appointment.count({
      where: {
        practitionerId: userId,
        scheduledAt: { gte: noShowFrom, lte: noShowTo },
        noShow: true,
      },
    }),
  ]);

  // Client retention (active clients with appointment in range)
  const retentionFrom = rangeFrom ?? subDays(now, 30);
  const totalActive = await prisma.client.count({
    where: { practitionerId: userId, status: "ACTIVE" },
  });

  const returningClients = await prisma.client.count({
    where: {
      practitionerId: userId,
      status: "ACTIVE",
      appointments: {
        some: { scheduledAt: { gte: retentionFrom, ...(rangeTo ? { lte: rangeTo } : {}) } },
      },
    },
  });

  // Supervision hours (use custom range if provided)
  const supervisionFrom = rangeFrom ?? startOfMonth(now);
  const supervisionTo = rangeTo ?? now;
  const supervisionAgg = await prisma.supervisionSession.aggregate({
    where: {
      superviseeId: userId,
      status: "COMPLETED",
      scheduledAt: { gte: supervisionFrom, lte: supervisionTo },
    },
    _sum: { duration: true },
  });

  const supervisionHoursThisMonth = (supervisionAgg._sum.duration ?? 0) / 60;

  // Top presenting concerns
  const clientsWithConcerns = await prisma.client.findMany({
    where: {
      practitionerId: userId,
      presentingConcern: { not: null },
    },
    select: { presentingConcern: true },
  });

  const concernCounts: Record<string, number> = {};
  clientsWithConcerns.forEach((c: any) => {
    if (c.presentingConcern) {
      const concern = c.presentingConcern.toLowerCase().trim();
      concernCounts[concern] = (concernCounts[concern] || 0) + 1;
    }
  });

  const topConcerns = Object.entries(concernCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([concern, count]) => ({ concern, count }));

  return NextResponse.json({
    sessionsThisWeek,
    sessionsLastWeek,
    revenueThisMonth: revenueThisMonthAgg._sum.amount || 0,
    revenueLastMonth: revenueLastMonthAgg._sum.amount || 0,
    noShowRate: totalAppointments > 0 ? (noShows / totalAppointments) * 100 : 0,
    clientRetentionRate:
      totalActive > 0 ? (returningClients / totalActive) * 100 : 0,
    supervisionHoursThisMonth,
    topConcerns,
  });
}
