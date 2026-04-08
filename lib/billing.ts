import { prisma } from "@/lib/prisma";

/**
 * Auto-create a PENDING payment when an appointment is marked COMPLETED.
 * Uses: client.sessionFee > practitioner profile.sessionFee > appointment.fee
 * Skips if a payment already exists for this appointment.
 */
export async function createPaymentForCompletedAppointment(appointmentId: string) {
  // Check if payment already exists for this appointment
  const existing = await prisma.payment.findUnique({
    where: { appointmentId },
  });
  if (existing) return existing;

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      client: {
        include: {
          practitioner: {
            include: { profile: { select: { sessionFee: true } } },
          },
        },
      },
    },
  });

  if (!appointment || !appointment.clientId) return null;

  // Determine fee: appointment.fee > client.sessionFee > practitioner.profile.sessionFee
  const fee =
    appointment.fee ??
    appointment.client?.sessionFee ??
    appointment.client?.practitioner?.profile?.sessionFee ??
    0;

  if (fee <= 0) return null;

  const payment = await prisma.payment.create({
    data: {
      practitionerId: appointment.practitionerId,
      clientId: appointment.clientId,
      appointmentId: appointment.id,
      amount: fee,
      method: "OTHER", // Will be updated when payment is received
      sessionDate: appointment.scheduledAt,
      description: `Session on ${appointment.scheduledAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`,
      status: "PENDING",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
    },
  });

  // Notify the practitioner
  await prisma.notification.create({
    data: {
      userId: appointment.practitionerId,
      type: "PAYMENT_RECEIVED",
      title: "Payment pending",
      body: `₹${fee} pending from ${appointment.client?.firstName || "client"} for session on ${appointment.scheduledAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
      link: "/payments",
    },
  });

  return payment;
}

/**
 * Mark a pending payment as received.
 */
export async function markPaymentReceived(
  paymentId: string,
  method: string,
  practitionerId: string
) {
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, practitionerId },
    include: { client: true },
  });

  if (!payment) return null;

  const updated = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "RECEIVED",
      method: method as any,
      paidAt: new Date(),
    },
  });

  await prisma.notification.create({
    data: {
      userId: practitionerId,
      type: "PAYMENT_RECEIVED",
      title: "Payment received",
      body: `₹${payment.amount} received from ${payment.client?.firstName || "client"}`,
      link: "/payments",
    },
  });

  return updated;
}

/**
 * Generate next invoice number for a practitioner.
 */
export async function getNextInvoiceNumber(practitionerId: string): Promise<string> {
  const year = new Date().getFullYear();
  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      practitionerId,
      invoiceNumber: { startsWith: `INV-${year}` },
    },
    orderBy: { invoiceNumber: "desc" },
  });

  if (!lastInvoice) return `INV-${year}-0001`;

  const lastNum = parseInt(lastInvoice.invoiceNumber.split("-")[2], 10);
  return `INV-${year}-${String(lastNum + 1).padStart(4, "0")}`;
}

/**
 * Calculate outstanding balance for a client.
 * Outstanding = sum of PENDING/OVERDUE payments
 * Total owed = completed sessions × fee - received payments
 */
export async function getClientBalance(clientId: string, practitionerId: string) {
  const [client, payments] = await Promise.all([
    prisma.client.findFirst({
      where: { id: clientId, practitionerId },
      include: {
        appointments: {
          where: { status: "COMPLETED" },
        },
        practitioner: {
          include: { profile: { select: { sessionFee: true } } },
        },
      },
    }),
    prisma.payment.findMany({
      where: { clientId, practitionerId },
    }),
  ]);

  if (!client) return null;

  const sessionFee = client.sessionFee ?? client.practitioner.profile?.sessionFee ?? 0;
  const completedSessions = client.appointments.length;
  const totalOwed = completedSessions * sessionFee;

  const totalReceived = payments
    .filter((p) => p.status === "RECEIVED")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === "PENDING" || p.status === "OVERDUE")
    .reduce((sum, p) => sum + p.amount, 0);

  const balanceDue = totalOwed - totalReceived;

  return {
    sessionFee,
    completedSessions,
    totalOwed,
    totalReceived,
    totalPending,
    balanceDue,
    isOverdue: payments.some(
      (p) => p.status === "PENDING" && p.dueDate && new Date(p.dueDate) < new Date()
    ),
  };
}
