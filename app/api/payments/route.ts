import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidAmount, isValidMonth } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // format: 2024-01
  const status = searchParams.get("status"); // PENDING, RECEIVED, OVERDUE
  const clientId = searchParams.get("clientId");

  const where: any = { practitionerId: session.user.id };

  if (month) {
    const parsed = isValidMonth(month);
    if (!parsed) {
      return NextResponse.json({ error: "Invalid month format. Use YYYY-MM" }, { status: 400 });
    }
    where.createdAt = {
      gte: new Date(parsed.year, parsed.month - 1, 1),
      lt: new Date(parsed.year, parsed.month, 1),
    };
  }

  if (status) {
    where.status = status;
  }

  if (clientId) {
    where.clientId = clientId;
  }

  const payments = await prisma.payment.findMany({
    where,
    include: {
      client: { select: { firstName: true, lastName: true } },
      appointment: {
        select: { scheduledAt: true, sessionType: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(payments);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check subscription for payment tracking
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (subscription?.plan === "FREE") {
    return NextResponse.json(
      { error: "Payment tracking requires a Solo plan. Upgrade to track payments." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { clientId, amount, method, sessionDate, description } = body;

  if (!amount || !method) {
    return NextResponse.json(
      { error: "Amount and payment method are required" },
      { status: 400 }
    );
  }

  if (!isValidAmount(amount)) {
    return NextResponse.json(
      { error: "Amount must be a positive number" },
      { status: 400 }
    );
  }

  const validMethods = ["UPI", "CASH", "BANK_TRANSFER", "CARD", "OTHER"];
  if (!validMethods.includes(method)) {
    return NextResponse.json(
      { error: "Invalid payment method" },
      { status: 400 }
    );
  }

  const payment = await prisma.payment.create({
    data: {
      practitionerId: session.user.id,
      clientId: clientId || null,
      amount: Number(amount),
      method,
      sessionDate: sessionDate ? new Date(sessionDate) : null,
      description: description || null,
      status: "RECEIVED",
      paidAt: new Date(),
    },
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId: session.user.id,
      type: "PAYMENT_RECEIVED",
      title: "Payment logged",
      body: `₹${amount} received${clientId ? "" : " (unlinked)"}`,
      link: "/payments",
    },
  });

  return NextResponse.json(payment, { status: 201 });
}
