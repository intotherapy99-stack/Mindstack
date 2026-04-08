import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCronRequest } from "@/lib/cron-auth";
import { subDays } from "date-fns";

export const dynamic = "force-dynamic";

// Daily — process supervisor payouts for sessions completed 3+ days ago
export async function GET(req: NextRequest) {
  const authError = validateCronRequest(req);
  if (authError) return authError;
  const threeDaysAgo = subDays(new Date(), 3);

  const sessionsToPayOut = await prisma.supervisionSession.findMany({
    where: {
      status: "COMPLETED",
      supervisorPaidOut: false,
      paidAt: { not: null },
      scheduledAt: { lte: threeDaysAgo },
    },
    include: {
      supervisor: { include: { profile: true } },
    },
  });

  let processedCount = 0;

  for (const session of sessionsToPayOut) {
    // In production: trigger Razorpay Route payout to supervisor
    // Payout amount = amountCharged - platformFee
    const payoutAmount = session.amountCharged - session.platformFee;

    await prisma.supervisionSession.update({
      where: { id: session.id },
      data: {
        supervisorPaidOut: true,
        payoutAt: new Date(),
      },
    });

    await prisma.notification.create({
      data: {
        userId: session.supervisorId,
        type: "PAYOUT_PROCESSED",
        title: "Payout processed",
        body: `₹${payoutAmount} has been transferred to your account for the supervision session.`,
        link: `/supervision/sessions`,
      },
    });

    processedCount++;
  }

  return NextResponse.json({
    success: true,
    payouts_processed: processedCount,
  });
}
