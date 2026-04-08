import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any).userType !== "CLIENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const specialization = searchParams.get("specialization");
    const search = searchParams.get("search");

    // Build where clause
    const where: Record<string, unknown> = {
      isPublic: true,
      bookingPageEnabled: true,
    };

    if (city) {
      where.city = { equals: city, mode: "insensitive" };
    }

    if (specialization) {
      where.specializations = { has: specialization };
    }

    if (search) {
      where.displayName = { contains: search, mode: "insensitive" };
    }

    const profiles = await prisma.profile.findMany({
      where,
      select: {
        displayName: true,
        slug: true,
        avatarUrl: true,
        city: true,
        specializations: true,
        sessionFee: true,
        yearsExperience: true,
        verificationStatus: true,
      },
      orderBy: [
        // VERIFIED first: Prisma sorts enums alphabetically by default,
        // so we use raw ordering via a workaround — sort by verificationStatus asc
        // where VERIFIED comes after UNVERIFIED/PENDING alphabetically.
        // Instead, we fetch all and sort in JS for correct ordering.
      ],
    });

    // Sort: VERIFIED first, then by yearsExperience desc
    const verificationOrder: Record<string, number> = {
      VERIFIED: 0,
      PENDING: 1,
      UNVERIFIED: 2,
      REJECTED: 3,
    };

    const sorted = profiles.sort((a, b) => {
      const vDiff =
        (verificationOrder[a.verificationStatus] ?? 4) -
        (verificationOrder[b.verificationStatus] ?? 4);
      if (vDiff !== 0) return vDiff;
      return (b.yearsExperience ?? 0) - (a.yearsExperience ?? 0);
    });

    return NextResponse.json({ therapists: sorted });
  } catch (error) {
    console.error("Client therapists error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
