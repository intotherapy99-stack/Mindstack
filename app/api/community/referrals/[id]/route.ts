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

  const referral = await prisma.referralPost.findUnique({
    where: { id: params.id },
    include: {
      author: {
        include: {
          profile: {
            select: {
              displayName: true,
              slug: true,
              city: true,
              role: true,
              avatarUrl: true,
            },
          },
        },
      },
      responses: {
        include: {
          responder: {
            include: {
              profile: {
                select: {
                  displayName: true,
                  slug: true,
                  city: true,
                  role: true,
                  specializations: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!referral) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ referral });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const referral = await prisma.referralPost.findUnique({
    where: { id: params.id },
  });

  if (!referral || referral.authorId !== session.user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const { status } = body;

  const updated = await prisma.referralPost.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json({ referral: updated });
}
