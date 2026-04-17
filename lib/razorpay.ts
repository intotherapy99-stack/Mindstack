import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export { razorpay };

/**
 * Create a Razorpay order.
 * @param amount - Amount in paise (e.g. 50000 = ₹500)
 * @param currency - Currency code (default: INR)
 * @param receipt - Unique receipt identifier
 * @param notes - Optional key-value notes
 */
export async function createOrder(
  amount: number,
  currency: string = "INR",
  receipt: string,
  notes?: Record<string, string>
) {
  const order = await razorpay.orders.create({
    amount,
    currency,
    receipt,
    notes: notes ?? {},
  });
  return order;
}

/**
 * Verify Razorpay payment signature using HMAC SHA256.
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
}

/**
 * Capture an authorized payment.
 * @param paymentId - Razorpay payment ID
 * @param amount - Amount in paise to capture
 */
export async function capturePayment(paymentId: string, amount: number) {
  const payment = await razorpay.payments.capture(paymentId, amount, "INR");
  return payment;
}

/**
 * Create a payout to a fund account (for supervisor payouts via Razorpay Route).
 * Uses the Razorpay Payouts API directly since the SDK may not expose it.
 * @param fundAccountId - Fund account ID to pay out to
 * @param amount - Amount in paise
 * @param purpose - Purpose of the payout (e.g. "payout", "refund")
 */
export async function createPayout(
  fundAccountId: string,
  amount: number,
  purpose: string
) {
  const credentials = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/payouts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
      fund_account_id: fundAccountId,
      amount,
      currency: "INR",
      mode: "NEFT",
      purpose,
      queue_if_low_balance: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Razorpay payout failed: ${error.error?.description ?? JSON.stringify(error)}`
    );
  }

  return response.json();
}

/**
 * Verify Razorpay webhook signature.
 */
export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET ?? process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
}
