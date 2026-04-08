import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";
import bcrypt from "bcryptjs";

/**
 * DPDP Act Section 8(2)(a) — Right to Erasure
 * Delete user account and anonymize associated data.
 * Requires password confirmation for security.
 */
export async function POST(req: NextRequest) {
  const { sensitiveRateLimit } = await import("@/lib/rate-limit");
  const rateLimitResponse = sensitiveRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const body = await req.json();
  const { password, confirmDeletion } = body;

  if (!password || confirmDeletion !== "DELETE_MY_ACCOUNT") {
    return NextResponse.json(
      {
        error:
          'Password required and confirmDeletion must be "DELETE_MY_ACCOUNT"',
      },
      { status: 400 }
    );
  }

  // Verify password
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return NextResponse.json(
      { error: "Incorrect password" },
      { status: 403 }
    );
  }

  await auditLog({
    userId,
    action: "DELETE_ACCOUNT",
    resourceType: "Account",
    resourceId: userId,
    details: `Account deletion initiated for ${user.email}`,
  });

  // Anonymize data instead of hard delete to preserve referential integrity
  // and comply with legal retention requirements for financial records

  // 1. Anonymize client portal tokens
  await prisma.clientPortalToken.updateMany({
    where: { practitionerId: userId },
    data: { isActive: false },
  });

  // 2. Anonymize user profile
  if (user.userType === "PROFESSIONAL") {
    await prisma.profile.deleteMany({ where: { userId } });
  } else {
    await prisma.clientProfile.deleteMany({ where: { userId } });
  }

  // 3. Delete notifications
  await prisma.notification.deleteMany({ where: { userId } });

  // 4. Delete availability
  await prisma.availability.deleteMany({ where: { userId } });

  // 5. Anonymize the user record
  const anonymizedEmail = `deleted_${userId}@anonymized.local`;
  await prisma.user.update({
    where: { id: userId },
    data: {
      email: anonymizedEmail,
      phone: null,
      passwordHash: "DELETED",
      emailVerified: null,
      phoneVerified: null,
    },
  });

  return NextResponse.json({
    success: true,
    message:
      "Your account has been deleted. Personal data has been anonymized. Financial records are retained as required by law.",
  });
}
