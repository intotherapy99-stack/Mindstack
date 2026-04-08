import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await prisma.client.findFirst({
    where: {
      id: params.id,
      practitionerId: session.user.id,
    },
    include: {
      appointments: {
        orderBy: { scheduledAt: "desc" },
        take: 1,
        select: { scheduledAt: true },
      },
      payments: {
        select: { amount: true, status: true },
      },
      _count: {
        select: {
          appointments: true,
          sessionNotes: true,
          payments: true,
        },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const totalPaid = client.payments
    .filter((p) => p.status === "RECEIVED")
    .reduce((sum, p) => sum + p.amount, 0);

  const outstandingBalance = client.payments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);

  const enriched = {
    ...client,
    lastSession: client.appointments[0]?.scheduledAt || null,
    totalSessions: client._count.appointments,
    totalNotes: client._count.sessionNotes,
    totalPayments: client._count.payments,
    totalPaid,
    outstandingBalance,
  };

  return NextResponse.json(enriched);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const existing = await prisma.client.findFirst({
    where: {
      id: params.id,
      practitionerId: session.user.id,
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const body = await req.json();
  const {
    firstName,
    lastName,
    email,
    phone,
    presentingConcern,
    status,
    referralSource,
  } = body;

  // Build update data — only include fields that were sent
  const updateData: Record<string, any> = {};
  if (firstName !== undefined) updateData.firstName = firstName;
  if (lastName !== undefined) updateData.lastName = lastName || null;
  if (email !== undefined) updateData.email = email || null;
  if (phone !== undefined) updateData.phone = phone || null;
  if (presentingConcern !== undefined)
    updateData.presentingConcern = presentingConcern || null;
  if (status !== undefined) updateData.status = status;
  if (referralSource !== undefined)
    updateData.referralSource = referralSource || null;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  const updated = await prisma.client.update({
    where: { id: params.id },
    data: updateData,
  });

  return NextResponse.json(updated);
}
