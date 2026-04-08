import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const space = await prisma.space.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { posts: true, members: true } },
      members: {
        where: { userId: session.user.id },
        select: { id: true, role: true },
      },
    },
  });

  if (!space) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    space: {
      ...space,
      isMember: space.members.length > 0,
      myRole: space.members[0]?.role || null,
      members: undefined,
    },
  });
}

// Join / Leave space
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body; // "join" or "leave"

  if (action === "join") {
    await prisma.spaceMembership.upsert({
      where: {
        spaceId_userId: { spaceId: params.id, userId: session.user.id },
      },
      create: { spaceId: params.id, userId: session.user.id },
      update: {},
    });
    return NextResponse.json({ joined: true });
  }

  if (action === "leave") {
    await prisma.spaceMembership.deleteMany({
      where: { spaceId: params.id, userId: session.user.id },
    });
    return NextResponse.json({ joined: false });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
