import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any).userType !== "CLIENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, clientProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find all Client records matched by email
    const clientRecords = await prisma.client.findMany({
      where: { email: user.email },
      select: { id: true, firstName: true, lastName: true },
    });

    const clientIds = clientRecords.map((c) => c.id);

    const now = new Date();

    // Fetch upcoming appointments with practitioner profile info
    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        clientId: { in: clientIds },
        scheduledAt: { gte: now },
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      include: {
        practitioner: {
          select: {
            profile: {
              select: {
                displayName: true,
                slug: true,
                avatarUrl: true,
                city: true,
                specializations: true,
              },
            },
          },
        },
      },
      orderBy: { scheduledAt: "asc" },
      take: 5,
    });

    // Recent payments summary
    const payments = await prisma.payment.findMany({
      where: { clientId: { in: clientIds } },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        amount: true,
        method: true,
        status: true,
        description: true,
        sessionDate: true,
        createdAt: true,
      },
    });

    // Total sessions count
    const totalSessions = await prisma.appointment.count({
      where: { clientId: { in: clientIds } },
    });

    const displayName =
      user.clientProfile?.displayName ??
      clientRecords[0]?.firstName ??
      user.email;

    return NextResponse.json({
      displayName,
      upcomingAppointments: upcomingAppointments.map((apt) => ({
        id: apt.id,
        scheduledAt: apt.scheduledAt,
        duration: apt.duration,
        sessionType: apt.sessionType,
        modality: apt.modality,
        status: apt.status,
        meetingLink: apt.meetingLink,
        fee: apt.fee,
        practitioner: apt.practitioner.profile
          ? {
              displayName: apt.practitioner.profile.displayName,
              slug: apt.practitioner.profile.slug,
              avatarUrl: apt.practitioner.profile.avatarUrl,
              city: apt.practitioner.profile.city,
              specializations: apt.practitioner.profile.specializations,
            }
          : null,
      })),
      recentPayments: payments,
      totalSessions,
    });
  } catch (error) {
    console.error("Client dashboard home error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
