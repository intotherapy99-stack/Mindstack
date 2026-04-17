import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createOrder } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, currency, receipt, notes } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Amount is required and must be a positive number (in paise)" },
        { status: 400 }
      );
    }

    const order = await createOrder(
      amount,
      currency ?? "INR",
      receipt ?? `rcpt_${session.user.id}_${Date.now()}`,
      notes
    );

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("[RAZORPAY_CREATE_ORDER]", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
