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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const clientRecords = await prisma.client.findMany({
      where: { email: user.email },
      select: { id: true },
    });

    const clientIds = clientRecords.map((c) => c.id);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? "all";
    const now = new Date();

    // Build date filter based on status param
    let dateFilter: object = {};
    if (status === "upcoming") {
      dateFilter = { scheduledAt: { gte: now } };
    } else if (status === "past") {
      dateFilter = { scheduledAt: { lt: now } };
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        clientId: { in: clientIds },
        ...dateFilter,
      },
      include: {
        practitioner: {
          select: {
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { scheduledAt: "desc" },
    });

    const formatted = appointments.map((apt) => ({
      id: apt.id,
      scheduledAt: apt.scheduledAt,
      duration: apt.duration,
      sessionType: apt.sessionType,
      modality: apt.modality,
      status: apt.status,
      meetingLink: apt.meetingLink,
      fee: apt.fee,
      createdAt: apt.createdAt,
      practitioner: apt.practitioner.profile
        ? {
            displayName: apt.practitioner.profile.displayName,
            avatarUrl: apt.practitioner.profile.avatarUrl,
            slug: apt.practitioner.profile.slug,
          }
        : null,
    }));

    return NextResponse.json({ appointments: formatted });
  } catch (error) {
    console.error("Client sessions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
