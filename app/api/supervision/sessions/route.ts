import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where: any = {
    OR: [
      { superviseeId: session.user.id },
      { supervisorId: session.user.id },
    ],
  };

  if (status) {
    where.status = status;
  }

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (from || to) {
    where.scheduledAt = {};
    if (from) where.scheduledAt.gte = new Date(from);
    if (to) where.scheduledAt.lte = new Date(to);
  }

  const sessions = await prisma.supervisionSession.findMany({
    where,
    include: {
      supervisor: {
        include: { profile: { select: { displayName: true, slug: true, avatarUrl: true } } },
      },
      supervisee: {
        include: { profile: { select: { displayName: true, slug: true, avatarUrl: true } } },
      },
      review: true,
    },
    orderBy: { scheduledAt: "desc" },
  });

  return NextResponse.json(sessions);
}
