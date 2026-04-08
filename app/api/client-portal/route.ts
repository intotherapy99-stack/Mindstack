import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { portalRateLimit } from "@/lib/rate-limit";

// GET — fetch client portal data using token
export async function GET(req: NextRequest) {
  const rateLimitResponse = portalRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const portalToken = await prisma.clientPortalToken.findUnique({
    where: { token },
    include: {
      client: {
        include: {
          practitioner: {
            include: {
              profile: {
                select: {
                  displayName: true,
                  avatarUrl: true,
                  slug: true,
                  city: true,
                  sessionFee: true,
                  sessionDuration: true,
                  specializations: true,
                },
              },
            },
          },
          appointments: {
            orderBy: { scheduledAt: "desc" },
            take: 20,
          },
          payments: {
            orderBy: { createdAt: "desc" },
            take: 20,
          },
        },
      },
    },
  });

  if (!portalToken || !portalToken.isActive) {
    return NextResponse.json(
      { error: "Invalid or expired link" },
      { status: 403 }
    );
  }

  // Enforce expiry — tokens without expiresAt are treated as expired (legacy)
  if (!portalToken.expiresAt || portalToken.expiresAt < new Date()) {
    // Deactivate expired token
    await prisma.clientPortalToken.update({
      where: { id: portalToken.id },
      data: { isActive: false },
    });
    return NextResponse.json(
      { error: "This link has expired. Please ask your therapist for a new link." },
      { status: 403 }
    );
  }

  // Update last accessed
  await prisma.clientPortalToken.update({
    where: { id: portalToken.id },
    data: { lastAccessedAt: new Date() },
  });

  const client = portalToken.client;
  const practitioner = client.practitioner;

  // Calculate payment summary
  const now = new Date();
  const totalPaid = client.payments
    .filter((p) => p.status === "RECEIVED")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = client.payments
    .filter((p) => p.status === "PENDING" || p.status === "OVERDUE")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = client.payments
    .filter(
      (p) =>
        p.status === "OVERDUE" ||
        (p.status === "PENDING" && p.dueDate && new Date(p.dueDate) < now)
    )
    .reduce((sum, p) => sum + p.amount, 0);

  return NextResponse.json({
    client: {
      firstName: client.firstName,
      lastName: client.lastName,
    },
    practitioner: {
      name: practitioner.profile?.displayName || "Your Therapist",
      avatar: practitioner.profile?.avatarUrl,
      slug: practitioner.profile?.slug,
      city: practitioner.profile?.city,
      fee: practitioner.profile?.sessionFee,
      duration: practitioner.profile?.sessionDuration,
      specializations: practitioner.profile?.specializations || [],
    },
    appointments: client.appointments.map((a) => ({
      id: a.id,
      scheduledAt: a.scheduledAt,
      duration: a.duration,
      type: a.sessionType,
      modality: a.modality,
      status: a.status,
      meetingLink: a.status === "CONFIRMED" ? a.meetingLink : null,
    })),
    payments: client.payments.map((p) => ({
      id: p.id,
      amount: p.amount,
      method: p.method,
      status: p.status,
      description: p.description,
      date: p.sessionDate || p.createdAt,
      dueDate: p.dueDate,
      isOverdue:
        p.status === "OVERDUE" ||
        (p.status === "PENDING" && p.dueDate && new Date(p.dueDate) < now),
    })),
    summary: {
      totalSessions: client.appointments.length,
      upcomingSessions: client.appointments.filter(
        (a) => a.status === "CONFIRMED" && new Date(a.scheduledAt) > new Date()
      ).length,
      totalPaid,
      totalPending,
      totalOverdue,
    },
  });
}
