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

    const payments = await prisma.payment.findMany({
      where: { clientId: { in: clientIds } },
      include: {
        practitioner: {
          select: {
            profile: {
              select: { displayName: true },
            },
          },
        },
        appointment: {
          select: { scheduledAt: true, sessionType: true, duration: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();

    const formatted = payments.map((p) => ({
      id: p.id,
      amount: p.amount,
      method: p.method,
      status: p.status,
      description: p.description,
      sessionDate: p.sessionDate,
      dueDate: p.dueDate,
      paidAt: p.paidAt,
      isOverdue: p.status === "PENDING" && p.dueDate && new Date(p.dueDate) < now,
      createdAt: p.createdAt,
      practitionerName: p.practitioner.profile?.displayName ?? null,
      sessionType: p.appointment?.sessionType ?? null,
      invoiceUrl: p.invoiceUrl ?? null,
    }));

    const totalPaid = payments
      .filter((p) => p.status === "RECEIVED")
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = payments
      .filter((p) => p.status === "PENDING" || p.status === "OVERDUE")
      .reduce((sum, p) => sum + p.amount, 0);

    const totalOverdue = payments
      .filter(
        (p) =>
          p.status === "OVERDUE" ||
          (p.status === "PENDING" && p.dueDate && new Date(p.dueDate) < now)
      )
      .reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      payments: formatted,
      summary: {
        totalPaid,
        totalPending,
        totalOverdue,
        pendingCount: payments.filter(
          (p) => p.status === "PENDING" || p.status === "OVERDUE"
        ).length,
      },
    });
  } catch (error) {
    console.error("Client payments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
