import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DPDP-compliant data export — returns all user data as JSON
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        clientProfile: true,
        subscription: true,
        availability: true,
        clients: {
          include: {
            appointments: { select: { id: true, scheduledAt: true, duration: true, status: true, modality: true } },
          },
        },
        appointments: {
          select: { id: true, scheduledAt: true, duration: true, status: true, modality: true, fee: true },
        },
        payments: {
          select: { id: true, amount: true, method: true, status: true, createdAt: true },
        },
        invoices: {
          select: { id: true, invoiceNumber: true, total: true, status: true, createdAt: true },
        },
        notes: {
          select: { id: true, template: true, tags: true, createdAt: true },
          // Exclude note content for privacy — they can request separately
        },
        notifications: {
          select: { id: true, type: true, title: true, body: true, read: true, createdAt: true },
        },
        sessionsAsSupervisee: {
          select: { id: true, scheduledAt: true, duration: true, status: true, amountCharged: true },
        },
        sessionsAsSupervisor: {
          select: { id: true, scheduledAt: true, duration: true, status: true, amountCharged: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Strip sensitive fields
    const { passwordHash: _, ...safeUser } = user;

    const exportData = {
      exportedAt: new Date().toISOString(),
      format: "MindStack Data Export v1",
      user: safeUser,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="mindstack-data-${session.user.id.slice(0, 8)}-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("[export] Error:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
