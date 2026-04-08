import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if ((session.user as any).userType !== "PROFESSIONAL") {
    return NextResponse.json({ error: "Only professionals can respond" }, { status: 403 });
  }

  const post = await prisma.referralPost.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.authorId === session.user.id) {
    return NextResponse.json({ error: "Cannot respond to your own referral" }, { status: 400 });
  }

  // Check if already responded
  const existing = await prisma.referralResponse.findFirst({
    where: { postId: params.id, responderId: session.user.id },
  });

  if (existing) {
    return NextResponse.json({ error: "You have already responded to this referral" }, { status: 400 });
  }

  const body = await req.json();
  const { message } = body;

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const response = await prisma.referralResponse.create({
    data: {
      postId: params.id,
      responderId: session.user.id,
      message,
    },
    include: {
      responder: {
        include: {
          profile: {
            select: { displayName: true, slug: true, city: true, role: true, specializations: true },
          },
        },
      },
    },
  });

  return NextResponse.json({ response }, { status: 201 });
}
