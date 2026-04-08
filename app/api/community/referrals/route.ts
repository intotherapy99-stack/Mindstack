import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const specialization = searchParams.get("specialization");
  const status = searchParams.get("status") || "OPEN";
  const mine = searchParams.get("mine") === "true";

  const where: any = {};
  if (status) where.status = status;
  if (city) where.city = city;
  if (specialization) where.specializations = { has: specialization };
  if (mine) where.authorId = session.user.id;

  const referrals = await prisma.referralPost.findMany({
    where,
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
      _count: { select: { responses: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ referrals });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only professionals can post referrals
  if ((session.user as any).userType !== "PROFESSIONAL") {
    return NextResponse.json({ error: "Only professionals can post referrals" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, specializations, city, modality, urgency } = body;

  if (!title || !description) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
  }

  const referral = await prisma.referralPost.create({
    data: {
      authorId: session.user.id,
      title,
      description,
      specializations: specializations || [],
      city: city || null,
      modality: modality || null,
      urgency: urgency || "NORMAL",
    },
    include: {
      author: {
        include: {
          profile: {
            select: { displayName: true, slug: true, city: true, role: true },
          },
        },
      },
    },
  });

  return NextResponse.json({ referral }, { status: 201 });
}
