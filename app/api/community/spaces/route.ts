import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const spaces = await prisma.space.findMany({
    include: {
      _count: { select: { posts: true, members: true } },
      members: {
        where: { userId: session.user.id },
        select: { id: true, role: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const formatted = spaces.map((s) => ({
    ...s,
    isMember: s.members.length > 0,
    myRole: s.members[0]?.role || null,
    members: undefined,
  }));

  return NextResponse.json({ spaces: formatted });
}
