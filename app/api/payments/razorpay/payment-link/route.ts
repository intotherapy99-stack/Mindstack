import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/payments/razorpay/payment-link
// Creates a Razorpay Payment Link and returns it so the practitioner
// can share it with the client via WhatsApp / email.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file." },
      { status: 503 }
    );
  }

  const body = await req.json();
  const { amount, clientId, description } = body;

  if (!amount || Number(amount) <= 0) {
    return NextResponse.json({ error: "Valid amount is required" }, { status: 400 });
  }

  // Optional: fetch client details for pre-filling
  let clientName: string | undefined;
  let clientEmail: string | undefined;
  let clientPhone: string | undefined;

  if (clientId) {
    const client = await prisma.client.findFirst({
      where: { id: clientId, practitionerId: session.user.id },
      select: { firstName: true, lastName: true, email: true, phone: true },
    });
    if (client) {
      clientName = `${client.firstName}${client.lastName ? ` ${client.lastName}` : ""}`;
      clientEmail = client.email ?? undefined;
      clientPhone = client.phone
        ? client.phone.replace(/\D/g, "").slice(-10)
        : undefined;
    }
  }

  // Call Razorpay Payment Links API
  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const payload: any = {
    amount: Math.round(Number(amount) * 100), // paise
    currency: "INR",
    description: description || "Session payment",
    reminder_enable: true,
    callback_url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    callback_method: "get",
  };

  if (clientName || clientEmail || clientPhone) {
    payload.customer = {};
    if (clientName) payload.customer.name = clientName;
    if (clientEmail) payload.customer.email = clientEmail;
    if (clientPhone) payload.customer.contact = `+91${clientPhone}`;
  }

  try {
    const response = await fetch("https://api.razorpay.com/v1/payment_links", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[payment-link] Razorpay error:", data);
      return NextResponse.json(
        { error: data.error?.description || "Failed to create payment link" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      id: data.id,
      shortUrl: data.short_url,
      amount: data.amount / 100,
      status: data.status,
    });
  } catch (error) {
    console.error("[payment-link] Error:", error);
    return NextResponse.json({ error: "Failed to create payment link" }, { status: 500 });
  }
}
