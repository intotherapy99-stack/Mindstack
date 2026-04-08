import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true, subscription: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Never expose passwordHash
  const { passwordHash: _, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Handle password change
  if (body.currentPassword && body.newPassword) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const match = await bcrypt.compare(body.currentPassword, user.passwordHash);
    if (!match) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 403 });
    }
    const hash = await bcrypt.hash(body.newPassword, 12);
    await prisma.user.update({ where: { id: session.user.id }, data: { passwordHash: hash } });
    return NextResponse.json({ message: "Password updated successfully" });
  }

  const {
    displayName,
    city,
    state,
    yearsExperience,
    role,
    specializations,
    modalities,
    rciNumber,
    nmcNumber,
    offersSupervision,
    supervisionFee,
    supervisionModality,
    supervisionApproach,
    maxSuperviseesCount,
    bio,
    languages,
    sessionDuration,
    sessionFee,
    bookingPageEnabled,
    bufferTime,
  } = body;

  // Generate slug from display name
  let slug: string | undefined;
  if (displayName) {
    const baseSlug = generateSlug(displayName);
    // Check uniqueness
    const existing = await prisma.profile.findUnique({
      where: { slug: baseSlug },
    });
    if (existing && existing.userId !== session.user.id) {
      // Append random suffix
      slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
    } else {
      slug = baseSlug;
    }
  }

  const profileData: any = {};
  if (displayName !== undefined) profileData.displayName = displayName;
  if (slug !== undefined) profileData.slug = slug;
  if (city !== undefined) profileData.city = city;
  if (state !== undefined) profileData.state = state;
  if (yearsExperience !== undefined) profileData.yearsExperience = Number(yearsExperience);
  if (role !== undefined) profileData.role = role;
  if (specializations !== undefined) profileData.specializations = specializations;
  if (modalities !== undefined) profileData.modalities = modalities;
  if (rciNumber !== undefined) profileData.rciNumber = rciNumber;
  if (nmcNumber !== undefined) profileData.nmcNumber = nmcNumber;
  if (offersSupervision !== undefined) profileData.offersSupervision = offersSupervision;
  if (supervisionFee !== undefined) profileData.supervisionFee = Number(supervisionFee);
  if (supervisionModality !== undefined) profileData.supervisionModality = supervisionModality;
  if (supervisionApproach !== undefined) profileData.supervisionApproach = supervisionApproach;
  if (maxSuperviseesCount !== undefined) profileData.maxSuperviseesCount = Number(maxSuperviseesCount);
  if (bio !== undefined) profileData.bio = bio;
  if (languages !== undefined) profileData.languages = languages;
  if (sessionDuration !== undefined) profileData.sessionDuration = Number(sessionDuration);
  if (sessionFee !== undefined) profileData.sessionFee = Number(sessionFee);
  if (bookingPageEnabled !== undefined) profileData.bookingPageEnabled = bookingPageEnabled;
  if (bufferTime !== undefined) profileData.bufferTime = Number(bufferTime);

  // If uploading credentials, set verification to pending
  if (rciNumber || nmcNumber) {
    profileData.verificationStatus = "PENDING";
  }

  const profile = await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: profileData,
    create: {
      userId: session.user.id,
      displayName: displayName || "User",
      slug: slug || `user-${session.user.id.slice(0, 8)}`,
      city: city || "",
      state: state || "",
      role: role || "COUNSELOR",
      ...profileData,
    },
  });

  return NextResponse.json(profile);
}
