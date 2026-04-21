import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyPaymentSignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentId,
      supervisionSessionId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required Razorpay fields" },
        { status: 400 }
      );
    }

    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Update supervision session if provided — verify the caller is the supervisee
    if (supervisionSessionId) {
      const owned = await prisma.supervisionSession.findFirst({
        where: { id: supervisionSessionId, superviseeId: session.user.id },
        select: { id: true },
      });
      if (!owned) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
      await prisma.supervisionSession.update({
        where: { id: supervisionSessionId },
        data: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          paidAt: new Date(),
        },
      });
    }

    // Update appointment payment — scope to this practitioner to prevent cross-tenant writes
    if (appointmentId) {
      await prisma.payment.updateMany({
        where: { appointmentId, practitionerId: session.user.id },
        data: {
          status: "RECEIVED",
          paidAt: new Date(),
        },
      });
    }

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error("[RAZORPAY_VERIFY]", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
