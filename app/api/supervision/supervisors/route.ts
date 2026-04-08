import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const specialization = searchParams.get("specialization");
  const verified = searchParams.get("verified");
  const query = searchParams.get("q");
  const sortBy = searchParams.get("sort") || "relevance";

  const where: any = {
    offersSupervision: true,
    isPublic: true,
  };

  if (city) where.city = city;
  if (verified === "true") where.verificationStatus = "VERIFIED";
  if (specialization) where.specializations = { has: specialization };
  if (query) {
    where.OR = [
      { displayName: { contains: query, mode: "insensitive" } },
      { supervisionApproach: { contains: query, mode: "insensitive" } },
      { supervisionBio: { contains: query, mode: "insensitive" } },
    ];
  }

  const profiles = await prisma.profile.findMany({
    where,
    include: {
      user: {
        include: {
          reviewsReceived: {
            where: { isVisible: true },
            select: { rating: true },
          },
        },
      },
    },
    orderBy:
      sortBy === "fee_asc"
        ? { supervisionFee: "asc" }
        : sortBy === "experience"
          ? { yearsExperience: "desc" }
          : { verifiedAt: "desc" },
  });

  // Post-filter: also match specializations against the search query
  const filteredProfiles = query
    ? profiles.filter((profile: any) => {
        // Already matched by DB query OR matches specializations
        const queryLower = query.toLowerCase();
        const matchesSpec = profile.specializations.some(
          (s: string) => s.toLowerCase().includes(queryLower)
        );
        const matchesName = profile.displayName?.toLowerCase().includes(queryLower);
        const matchesApproach = profile.supervisionApproach?.toLowerCase().includes(queryLower);
        const matchesBio = profile.supervisionBio?.toLowerCase().includes(queryLower);
        return matchesName || matchesApproach || matchesBio || matchesSpec;
      })
    : profiles;

  const supervisors = filteredProfiles.map((profile: any) => {
    const reviews = profile.user.reviewsReceived;
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : null;

    return {
      id: profile.userId,
      displayName: profile.displayName,
      slug: profile.slug,
      avatarUrl: profile.avatarUrl,
      city: profile.city,
      role: profile.role,
      specializations: profile.specializations,
      supervisionApproach: profile.supervisionApproach,
      supervisionFee: profile.supervisionFee,
      supervisionModality: profile.supervisionModality,
      verificationStatus: profile.verificationStatus,
      yearsExperience: profile.yearsExperience,
      avgRating,
      reviewCount: reviews.length,
    };
  });

  return NextResponse.json(supervisors);
}
