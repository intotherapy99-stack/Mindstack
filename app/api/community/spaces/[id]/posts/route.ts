import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mutationRateLimit } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.spacePost.findMany({
    where: { spaceId: params.id },
    include: {
      author: {
        include: {
          profile: {
            select: {
              displayName: true,
              slug: true,
              role: true,
              avatarUrl: true,
            },
          },
        },
      },
      _count: { select: { comments: true } },
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ posts });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if ((session.user as any).userType !== "PROFESSIONAL") {
    return NextResponse.json({ error: "Only professionals can post" }, { status: 403 });
  }

  // Check membership for non-OPEN spaces
  const space = await prisma.space.findUnique({ where: { id: params.id } });
  if (!space) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 });
  }

  if (space.type !== "OPEN") {
    const membership = await prisma.spaceMembership.findUnique({
      where: {
        spaceId_userId: { spaceId: params.id, userId: session.user.id },
      },
    });
    if (!membership) {
      return NextResponse.json({ error: "Join this space to post" }, { status: 403 });
    }
  }

  const rateLimitResponse = mutationRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const body = await req.json();
  const { title, content } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const safeTitle = sanitizeString(title, 200);
  const safeContent = sanitizeString(content, 10000);

  const post = await prisma.spacePost.create({
    data: {
      spaceId: params.id,
      authorId: session.user.id,
      title: safeTitle,
      content: safeContent,
    },
    include: {
      author: {
        include: {
          profile: {
            select: { displayName: true, slug: true, role: true },
          },
        },
      },
    },
  });

  // Auto-join space if not already a member
  await prisma.spaceMembership.upsert({
    where: {
      spaceId_userId: { spaceId: params.id, userId: session.user.id },
    },
    create: { spaceId: params.id, userId: session.user.id },
    update: {},
  });

  return NextResponse.json({ post }, { status: 201 });
}
