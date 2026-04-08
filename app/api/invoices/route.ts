import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getNextInvoiceNumber } from "@/lib/billing";

// GET — list invoices for practitioner
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");
  const status = searchParams.get("status");

  const where: any = { practitionerId: session.user.id };
  if (clientId) where.clientId = clientId;
  if (status) where.status = status;

  const invoices = await prisma.invoice.findMany({
    where,
    include: {
      client: { select: { firstName: true, lastName: true } },
      payments: {
        select: { id: true, amount: true, status: true, paidAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices);
}

// POST — generate invoice for a client's unpaid sessions
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { clientId, periodStart, periodEnd, discount, tax, notes, dueDays } = body;

  if (!clientId) {
    return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
  }

  // Get client and their completed appointments in the period
  const client = await prisma.client.findFirst({
    where: { id: clientId, practitionerId: session.user.id },
    include: {
      practitioner: {
        include: { profile: { select: { sessionFee: true, displayName: true } } },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const start = periodStart ? new Date(periodStart) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const end = periodEnd ? new Date(periodEnd) : new Date();

  // Find completed appointments without invoiced payments in the period
  const appointments = await prisma.appointment.findMany({
    where: {
      practitionerId: session.user.id,
      clientId,
      status: "COMPLETED",
      scheduledAt: { gte: start, lte: end },
    },
    include: {
      payment: { select: { id: true, invoiceId: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });

  // Filter out appointments that already have invoiced payments
  const uninvoiced = appointments.filter(
    (a) => !a.payment || !a.payment.invoiceId
  );

  if (uninvoiced.length === 0) {
    return NextResponse.json(
      { error: "No uninvoiced sessions found in this period" },
      { status: 400 }
    );
  }

  const sessionFee = client.sessionFee ?? client.practitioner.profile?.sessionFee ?? 0;

  // Build line items
  const items = uninvoiced.map((apt) => ({
    description: `Therapy session — ${apt.scheduledAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`,
    quantity: 1,
    unitPrice: apt.fee ?? sessionFee,
    total: apt.fee ?? sessionFee,
    appointmentId: apt.id,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = discount || 0;
  const taxAmount = tax || 0;
  const total = subtotal - discountAmount + taxAmount;

  const invoiceNumber = await getNextInvoiceNumber(session.user.id);
  const dueDate = new Date(Date.now() + (dueDays || 15) * 24 * 60 * 60 * 1000);

  const invoice = await prisma.invoice.create({
    data: {
      practitionerId: session.user.id,
      clientId,
      invoiceNumber,
      periodStart: start,
      periodEnd: end,
      dueDate,
      items: items as any,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total,
      notes: notes || null,
      status: "DRAFT",
    },
  });

  // Link existing pending payments to this invoice
  const paymentIds = uninvoiced
    .filter((a) => a.payment)
    .map((a) => a.payment!.id);

  if (paymentIds.length > 0) {
    await prisma.payment.updateMany({
      where: { id: { in: paymentIds } },
      data: { invoiceId: invoice.id },
    });
  }

  // Create payments for appointments that don't have one yet
  for (const apt of uninvoiced) {
    if (!apt.payment) {
      await prisma.payment.create({
        data: {
          practitionerId: session.user.id,
          clientId,
          appointmentId: apt.id,
          invoiceId: invoice.id,
          amount: apt.fee ?? sessionFee,
          status: "PENDING",
          sessionDate: apt.scheduledAt,
          description: `Session on ${apt.scheduledAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`,
          dueDate,
        },
      });
    }
  }

  // Notify
  await prisma.notification.create({
    data: {
      userId: session.user.id,
      type: "INVOICE_GENERATED",
      title: "Invoice generated",
      body: `${invoiceNumber} — ₹${total} for ${client.firstName} ${client.lastName || ""}`,
      link: "/payments",
    },
  });

  return NextResponse.json(invoice, { status: 201 });
}
