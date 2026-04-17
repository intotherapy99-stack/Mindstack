import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.error("[RAZORPAY_WEBHOOK] Invalid signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventType: string = event.event;
    const payload = event.payload?.payment?.entity;

    switch (eventType) {
      case "payment.captured": {
        if (!payload) break;

        const orderId: string | undefined = payload.order_id;
        const paymentId: string = payload.id;

        console.info("[RAZORPAY_WEBHOOK] payment.captured", {
          paymentId,
          orderId,
          amount: payload.amount,
        });

        // Update supervision session if the order ID matches
        if (orderId) {
          await prisma.supervisionSession.updateMany({
            where: { razorpayOrderId: orderId },
            data: {
              razorpayPaymentId: paymentId,
              paidAt: new Date(),
            },
          });
        }

        // Update any pending payments linked to this order
        if (orderId) {
          const notes = payload.notes ?? {};
          const appointmentId = notes.appointmentId;

          if (appointmentId) {
            await prisma.payment.updateMany({
              where: { appointmentId, status: "PENDING" },
              data: {
                status: "RECEIVED",
                paidAt: new Date(),
              },
            });
          }
        }

        break;
      }

      case "payment.failed": {
        if (!payload) break;

        console.error("[RAZORPAY_WEBHOOK] payment.failed", {
          paymentId: payload.id,
          orderId: payload.order_id,
          reason: payload.error_description,
          code: payload.error_code,
        });

        break;
      }

      default: {
        console.info("[RAZORPAY_WEBHOOK] Unhandled event:", eventType);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[RAZORPAY_WEBHOOK] Error processing webhook:", error);
    return NextResponse.json({ status: "ok" });
  }
}
