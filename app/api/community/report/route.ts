import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mutationRateLimit } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimitResponse = mutationRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const body = await req.json();
  const { contentType, contentId, reason } = body;

  if (!contentType || !["POST", "COMMENT"].includes(contentType)) {
    return NextResponse.json(
      { error: "contentType must be POST or COMMENT" },
      { status: 400 }
    );
  }

  if (!contentId) {
    return NextResponse.json(
      { error: "contentId is required" },
      { status: 400 }
    );
  }

  if (!reason || !reason.trim()) {
    return NextResponse.json(
      { error: "reason is required" },
      { status: 400 }
    );
  }

  const safeReason = sanitizeString(reason, 1000);

  // Prevent duplicate reports from same user on same content
  const existing = await prisma.report.findFirst({
    where: {
      reporterId: session.user.id,
      contentType,
      contentId,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "You have already reported this content" },
      { status: 409 }
    );
  }

  const report = await prisma.report.create({
    data: {
      reporterId: session.user.id,
      contentType,
      contentId,
      reason: safeReason,
    },
  });

  return NextResponse.json({ report }, { status: 201 });
}
