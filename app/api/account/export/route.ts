import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";
import { sensitiveRateLimit } from "@/lib/rate-limit";

/**
 * DPDP Act Section 8(2)(b) — Data Portability
 * Export all personal data associated with the user.
 */
export async function GET(req: NextRequest) {
  const rateLimitResponse = sensitiveRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      phone: true,
      userType: true,
      role: true,
      createdAt: true,
      profile: {
        select: {
          displayName: true,
          city: true,
          state: true,
          bio: true,
          role: true,
          specializations: true,
          modalities: true,
          languages: true,
          yearsExperience: true,
        },
      },
      clientProfile: {
        select: {
          displayName: true,
          dateOfBirth: true,
          gender: true,
          city: true,
          state: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // For professionals, include client data, notes, payments
  let practiceData = null;
  if (user.userType === "PROFESSIONAL") {
    const [clients, notes, payments, appointments] = await Promise.all([
      prisma.client.findMany({
        where: { practitionerId: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.note.findMany({
        where: { practitionerId: userId },
        select: {
          id: true,
          template: true,
          tags: true,
          createdAt: true,
          // Content excluded for security — clinical notes not included in bulk export
        },
      }),
      prisma.payment.findMany({
        where: { practitionerId: userId },
        select: {
          id: true,
          amount: true,
          method: true,
          status: true,
          sessionDate: true,
          createdAt: true,
        },
      }),
      prisma.appointment.findMany({
        where: { practitionerId: userId },
        select: {
          id: true,
          scheduledAt: true,
          duration: true,
          sessionType: true,
          status: true,
        },
      }),
    ]);

    practiceData = { clients, notes, payments, appointments };
  }

  await auditLog({
    userId,
    action: "EXPORT_DATA",
    resourceType: "Account",
    resourceId: userId,
    details: "Full data export requested (DPDP compliance)",
  });

  return NextResponse.json({
    exportDate: new Date().toISOString(),
    user,
    practiceData,
    _notice:
      "This export contains your personal data as required under the Digital Personal Data Protection Act, 2023. Clinical note content is excluded from bulk export for security.",
  });
}
