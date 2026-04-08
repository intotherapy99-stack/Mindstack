import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCronRequest } from "@/lib/cron-auth";

export const dynamic = "force-dynamic";

// Every 6 hours — reveal reviews that are past their 48h embargo
export async function GET(req: NextRequest) {
  const authError = validateCronRequest(req);
  if (authError) return authError;
  const now = new Date();

  const revealed = await prisma.review.updateMany({
    where: {
      isVisible: false,
      visibleAt: { lte: now },
    },
    data: { isVisible: true },
  });

  return NextResponse.json({
    success: true,
    reviews_revealed: revealed.count,
  });
}
