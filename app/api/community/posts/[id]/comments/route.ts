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

  const post = await prisma.spacePost.findUnique({
    where: { id: params.id },
    include: {
      author: {
        include: {
          profile: {
            select: { displayName: true, slug: true, role: true, avatarUrl: true },
          },
        },
      },
      space: { select: { id: true, name: true, category: true } },
      comments: {
        where: { parentId: null },
        include: {
          author: {
            include: {
              profile: {
                select: { displayName: true, slug: true, role: true, avatarUrl: true },
              },
            },
          },
          replies: {
            include: {
              author: {
                include: {
                  profile: {
                    select: { displayName: true, slug: true, role: true, avatarUrl: true },
                  },
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { comments: true } },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Gather all comment IDs (top-level + replies) to check user reports
  const allCommentIds: string[] = [];
  for (const comment of post.comments) {
    allCommentIds.push(comment.id);
    if (comment.replies) {
      for (const reply of comment.replies) {
        allCommentIds.push(reply.id);
      }
    }
  }

  const userReports = await prisma.report.findMany({
    where: {
      reporterId: session.user.id,
      OR: [
        { contentType: "POST", contentId: post.id },
        { contentType: "COMMENT", contentId: { in: allCommentIds } },
      ],
    },
    select: { contentType: true, contentId: true },
  });

  const reportedIds = new Set(userReports.map((r) => `${r.contentType}:${r.contentId}`));

  return NextResponse.json({ post, reportedIds: Array.from(reportedIds) });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimitResponse = mutationRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const body = await req.json();
  const { content, parentId } = body;

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const safeContent = sanitizeString(content, 5000);

  const comment = await prisma.comment.create({
    data: {
      postId: params.id,
      authorId: session.user.id,
      content: safeContent,
      parentId: parentId || null,
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

  return NextResponse.json({ comment }, { status: 201 });
}
