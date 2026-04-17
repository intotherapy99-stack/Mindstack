import { formatPhoneForMSG91 } from "./utils";

const MSG91_API_BASE = "https://control.msg91.com/api/v5";
const AUTH_KEY = process.env.MSG91_AUTH_KEY || "";
const SENDER_ID = process.env.MSG91_SENDER_ID || "";

// ── Template IDs from env ────────────────────────────────────────
const TEMPLATE_REMINDER_24H =
  process.env.MSG91_TEMPLATE_ID_REMINDER_24H || "";
const TEMPLATE_REMINDER_2H =
  process.env.MSG91_TEMPLATE_ID_REMINDER_2H || "";
const TEMPLATE_BOOKING_CONFIRMED =
  process.env.MSG91_TEMPLATE_ID_BOOKING_CONFIRMED || "";

// ── Types ────────────────────────────────────────────────────────
interface MSG91Response {
  type: string;
  message: string;
  request_id?: string;
}

interface SendResult {
  success: boolean;
  requestId?: string;
  error?: string;
}

// ── SMS ──────────────────────────────────────────────────────────
/**
 * Send a transactional SMS via MSG91 Flow API.
 *
 * @param phone      - Phone number (10-digit or with +91 prefix)
 * @param templateId - MSG91 approved DLT template / flow ID
 * @param variables  - Dynamic template variable map (keys must match
 *                     the variable names configured in your MSG91 flow)
 */
export async function sendSMS(
  phone: string,
  templateId: string,
  variables: Record<string, string>,
): Promise<SendResult> {
  const formattedPhone = formatPhoneForMSG91(phone);

  try {
    const response = await fetch(`${MSG91_API_BASE}/flow/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authkey: AUTH_KEY,
      },
      body: JSON.stringify({
        template_id: templateId,
        sender: SENDER_ID,
        short_url: "0",
        recipients: [
          {
            mobiles: `91${formattedPhone}`,
            ...variables,
          },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[msg91:sms] HTTP error:", response.status, text);
      return { success: false, error: `HTTP ${response.status}: ${text}` };
    }

    const data = (await response.json()) as MSG91Response;

    if (data.type === "error") {
      console.error("[msg91:sms] API error:", data.message);
      return { success: false, error: data.message };
    }

    return { success: true, requestId: data.request_id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[msg91:sms] unexpected error:", message);
    return { success: false, error: message };
  }
}

// ── WhatsApp ─────────────────────────────────────────────────────
/**
 * Send a WhatsApp message via MSG91.
 *
 * @param phone      - Phone number (10-digit or with +91 prefix)
 * @param templateId - MSG91 approved WhatsApp template name
 * @param variables  - Dynamic template variable map
 */
export async function sendWhatsApp(
  phone: string,
  templateId: string,
  variables: Record<string, string>,
): Promise<SendResult> {
  const formattedPhone = formatPhoneForMSG91(phone);

  try {
    const response = await fetch(
      "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authkey: AUTH_KEY,
        },
        body: JSON.stringify({
          template_name: templateId,
          integrated_number: SENDER_ID,
          recipients: [
            {
              phone: `91${formattedPhone}`,
              ...variables,
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("[msg91:whatsapp] HTTP error:", response.status, text);
      return { success: false, error: `HTTP ${response.status}: ${text}` };
    }

    const data = (await response.json()) as MSG91Response;

    if (data.type === "error") {
      console.error("[msg91:whatsapp] API error:", data.message);
      return { success: false, error: data.message };
    }

    return { success: true, requestId: data.request_id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[msg91:whatsapp] unexpected error:", message);
    return { success: false, error: message };
  }
}

// ── Convenience: Appointment reminder SMS ────────────────────────
interface ReminderSMSDetails {
  practitionerName: string;
  date: string;
  time: string;
}

/**
 * Send an appointment reminder SMS. Defaults to the 24-hour template;
 * pass a templateOverride for the 2-hour reminder.
 */
export async function sendAppointmentReminderSMS(
  phone: string,
  details: ReminderSMSDetails,
  templateOverride?: string,
): Promise<SendResult> {
  const templateId = templateOverride || TEMPLATE_REMINDER_24H;

  if (!templateId) {
    console.error("[msg91:sms] No reminder template ID configured");
    return { success: false, error: "Missing MSG91 reminder template ID" };
  }

  return sendSMS(phone, templateId, {
    practitioner_name: details.practitionerName,
    date: details.date,
    time: details.time,
  });
}

// ── Convenience: Booking confirmation WhatsApp ───────────────────
interface BookingConfirmationDetails {
  practitionerName: string;
  date: string;
  time: string;
}

export async function sendBookingConfirmationWhatsApp(
  phone: string,
  details: BookingConfirmationDetails,
): Promise<SendResult> {
  if (!TEMPLATE_BOOKING_CONFIRMED) {
    console.error(
      "[msg91:whatsapp] No booking confirmation template ID configured",
    );
    return {
      success: false,
      error: "Missing MSG91 booking confirmation template ID",
    };
  }

  return sendWhatsApp(phone, TEMPLATE_BOOKING_CONFIRMED, {
    practitioner_name: details.practitionerName,
    date: details.date,
    time: details.time,
  });
}

// Re-export template constants for external use (e.g. cron jobs)
export const MSG91_TEMPLATES = {
  REMINDER_24H: TEMPLATE_REMINDER_24H,
  REMINDER_2H: TEMPLATE_REMINDER_2H,
  BOOKING_CONFIRMED: TEMPLATE_BOOKING_CONFIRMED,
} as const;
