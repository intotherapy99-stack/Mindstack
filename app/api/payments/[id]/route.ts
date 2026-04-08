import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mutationRateLimit } from "@/lib/rate-limit";
import { isValidAmount } from "@/lib/validation";

const VALID_STATUSES = ["RECEIVED", "PENDING", "OVERDUE", "PARTIALLY_PAID", "WAIVED", "REFUNDED"];
const VALID_METHODS = ["UPI", "CASH", "BANK_TRANSFER", "CARD", "OTHER"];

// GET — single payment detail
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payment = await prisma.payment.findFirst({
    where: { id: params.id, practitionerId: session.user.id },
    include: {
      client: { select: { firstName: true, lastName: true } },
      appointment: {
        select: { scheduledAt: true, sessionType: true, duration: true },
      },
    },
  });

  if (!payment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(payment);
}

// PATCH — update payment (mark received, change method, waive, etc.)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payment = await prisma.payment.findFirst({
    where: { id: params.id, practitionerId: session.user.id },
    include: { client: true },
  });

  if (!payment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const rateLimitResponse = mutationRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const body = await req.json();
  const { status, method, amount } = body;

  const data: any = {};
  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
    }
    data.status = status;
  }
  if (method) {
    if (!VALID_METHODS.includes(method)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }
    data.method = method;
  }
  if (amount !== undefined) {
    if (!isValidAmount(amount)) {
      return NextResponse.json({ error: "Amount must be a positive number (max ₹1 crore)" }, { status: 400 });
    }
    data.amount = amount;
  }

  // If marking as received, set paidAt
  if (status === "RECEIVED") {
    data.paidAt = new Date();
  }

  const updated = await prisma.payment.update({
    where: { id: params.id },
    data,
  });

  // Notification for payment received
  if (status === "RECEIVED") {
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: "PAYMENT_RECEIVED",
        title: "Payment received",
        body: `₹${updated.amount} received from ${payment.client?.firstName || "client"}`,
        link: "/payments",
      },
    });
  }

  return NextResponse.json(updated);
}
