import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM =
  process.env.EMAIL_FROM || "MindStack <notifications@mindstack.in>";
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://mindstack.in";

// ── Brand constants ──────────────────────────────────────────────
const BRAND_COLOR = "#0d9488";
const BRAND_NAME = "MindStack";

// ── Shared layout ────────────────────────────────────────────────
function layout(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
  <tr><td style="background-color:${BRAND_COLOR};padding:24px 32px;">
    <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">${BRAND_NAME}</h1>
  </td></tr>
  <tr><td style="padding:32px;">
    ${body}
  </td></tr>
  <tr><td style="padding:16px 32px;background-color:#fafafa;border-top:1px solid #e4e4e7;">
    <p style="margin:0;font-size:12px;color:#a1a1aa;text-align:center;">
      &copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`.trim();
}

function button(text: string, href: string): string {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr><td style="background-color:${BRAND_COLOR};border-radius:6px;padding:12px 28px;">
  <a href="${href}" target="_blank" style="color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;display:inline-block;">${text}</a>
</td></tr>
</table>`;
}

// ── Base send ────────────────────────────────────────────────────
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<{ id?: string; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[email] send failed:", error);
      return { error: error.message };
    }

    return { id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[email] unexpected error:", message);
    return { error: message };
  }
}

// ── Welcome ──────────────────────────────────────────────────────
export async function sendWelcomeEmail(email: string, name: string) {
  const html = layout(
    "Welcome to MindStack",
    `
    <h2 style="margin:0 0 16px;font-size:18px;color:#18181b;">Welcome, ${name}!</h2>
    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#3f3f46;">
      We're glad you're here. MindStack helps mental health practitioners
      manage their practice — appointments, clients, billing, and more — all
      in one place.
    </p>
    <p style="margin:0 0 4px;font-size:14px;line-height:1.6;color:#3f3f46;">
      Get started by setting up your profile and availability.
    </p>
    ${button("Go to Dashboard", `${APP_URL}/dashboard`)}
    <p style="margin:0;font-size:13px;color:#71717a;">
      If you have questions, reply to this email — we'd love to help.
    </p>`,
  );

  return sendEmail(email, "Welcome to MindStack", html);
}

// ── Appointment confirmation ─────────────────────────────────────
interface AppointmentConfirmationDetails {
  practitionerName: string;
  clientName: string;
  date: string;
  time: string;
  modality: string;
  meetingLink?: string;
}

export async function sendAppointmentConfirmation(
  to: string,
  details: AppointmentConfirmationDetails,
) {
  const meetingRow = details.meetingLink
    ? `<tr>
        <td style="padding:8px 12px;font-size:13px;color:#71717a;width:120px;vertical-align:top;">Meeting Link</td>
        <td style="padding:8px 12px;font-size:14px;color:#18181b;">
          <a href="${details.meetingLink}" style="color:${BRAND_COLOR};text-decoration:underline;">Join here</a>
        </td>
       </tr>`
    : "";

  const html = layout(
    "Appointment Confirmed",
    `
    <h2 style="margin:0 0 16px;font-size:18px;color:#18181b;">Appointment Confirmed</h2>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#3f3f46;">
      Hi ${details.clientName}, your session with <strong>${details.practitionerName}</strong> has been confirmed.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e4e4e7;border-radius:6px;overflow:hidden;margin-bottom:20px;">
      <tr>
        <td style="padding:8px 12px;font-size:13px;color:#71717a;width:120px;vertical-align:top;">Date</td>
        <td style="padding:8px 12px;font-size:14px;color:#18181b;">${details.date}</td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:8px 12px;font-size:13px;color:#71717a;vertical-align:top;">Time</td>
        <td style="padding:8px 12px;font-size:14px;color:#18181b;">${details.time}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;font-size:13px;color:#71717a;vertical-align:top;">Modality</td>
        <td style="padding:8px 12px;font-size:14px;color:#18181b;">${details.modality}</td>
      </tr>
      ${meetingRow}
    </table>
    <p style="margin:0;font-size:13px;color:#71717a;">
      Need to reschedule? Please contact your practitioner or visit your
      <a href="${APP_URL}/dashboard" style="color:${BRAND_COLOR};">dashboard</a>.
    </p>`,
  );

  return sendEmail(to, "Your Appointment Is Confirmed", html);
}

// ── Appointment reminder ─────────────────────────────────────────
interface AppointmentReminderDetails {
  practitionerName: string;
  clientName: string;
  date: string;
  time: string;
  hoursUntil: number;
  meetingLink?: string;
}

export async function sendAppointmentReminder(
  to: string,
  details: AppointmentReminderDetails,
) {
  const timeLabel =
    details.hoursUntil <= 1
      ? "in less than an hour"
      : `in ${details.hoursUntil} hours`;

  const meetingSection = details.meetingLink
    ? `${button("Join Meeting", details.meetingLink)}`
    : "";

  const html = layout(
    "Appointment Reminder",
    `
    <h2 style="margin:0 0 16px;font-size:18px;color:#18181b;">Upcoming Session</h2>
    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#3f3f46;">
      Hi ${details.clientName}, this is a reminder that your session with
      <strong>${details.practitionerName}</strong> starts <strong>${timeLabel}</strong>.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#f4f4f5;border-radius:6px;padding:4px 0;margin-bottom:16px;">
      <tr>
        <td style="padding:8px 16px;font-size:13px;color:#71717a;width:80px;">Date</td>
        <td style="padding:8px 16px;font-size:14px;color:#18181b;">${details.date}</td>
      </tr>
      <tr>
        <td style="padding:8px 16px;font-size:13px;color:#71717a;">Time</td>
        <td style="padding:8px 16px;font-size:14px;color:#18181b;">${details.time}</td>
      </tr>
    </table>
    ${meetingSection}
    <p style="margin:0;font-size:13px;color:#71717a;">
      If you need to cancel, please let your practitioner know as soon as possible.
    </p>`,
  );

  return sendEmail(to, `Reminder: Session ${timeLabel}`, html);
}

// ── Email verification ───────────────────────────────────────────
export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${encodeURIComponent(token)}`;

  const html = layout(
    "Verify Your Email",
    `
    <h2 style="margin:0 0 16px;font-size:18px;color:#18181b;">Verify your email address</h2>
    <p style="margin:0 0 4px;font-size:14px;line-height:1.6;color:#3f3f46;">
      Click the button below to confirm your email address and activate your account.
    </p>
    ${button("Verify Email", verifyUrl)}
    <p style="margin:0 0 8px;font-size:13px;color:#71717a;">
      Or copy and paste this link into your browser:
    </p>
    <p style="margin:0;font-size:12px;color:${BRAND_COLOR};word-break:break-all;">
      ${verifyUrl}
    </p>`,
  );

  return sendEmail(email, "Verify Your Email — MindStack", html);
}

// ── Password reset ───────────────────────────────────────────────
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${encodeURIComponent(token)}`;

  const html = layout(
    "Reset Your Password",
    `
    <h2 style="margin:0 0 16px;font-size:18px;color:#18181b;">Reset your password</h2>
    <p style="margin:0 0 4px;font-size:14px;line-height:1.6;color:#3f3f46;">
      We received a request to reset the password for your MindStack account.
      Click the button below to choose a new password.
    </p>
    ${button("Reset Password", resetUrl)}
    <p style="margin:0 0 8px;font-size:13px;color:#71717a;">
      This link expires in 1 hour. If you didn't request a reset, you can safely ignore this email.
    </p>
    <p style="margin:0;font-size:12px;color:${BRAND_COLOR};word-break:break-all;">
      ${resetUrl}
    </p>`,
  );

  return sendEmail(email, "Reset Your Password — MindStack", html);
}

// ── Invoice ──────────────────────────────────────────────────────
interface InvoiceEmailDetails {
  practitionerName: string;
  clientName: string;
  invoiceNumber: string;
  total: number;
  dueDate: string;
  pdfUrl?: string;
}

export async function sendInvoiceEmail(
  to: string,
  details: InvoiceEmailDetails,
) {
  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(details.total);

  const pdfSection = details.pdfUrl
    ? button("Download Invoice PDF", details.pdfUrl)
    : "";

  const html = layout(
    "Invoice from MindStack",
    `
    <h2 style="margin:0 0 16px;font-size:18px;color:#18181b;">Invoice #${details.invoiceNumber}</h2>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#3f3f46;">
      Hi ${details.clientName}, here's an invoice from <strong>${details.practitionerName}</strong>.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e4e4e7;border-radius:6px;overflow:hidden;margin-bottom:20px;">
      <tr>
        <td style="padding:10px 12px;font-size:13px;color:#71717a;width:130px;">Invoice Number</td>
        <td style="padding:10px 12px;font-size:14px;color:#18181b;font-weight:600;">${details.invoiceNumber}</td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:10px 12px;font-size:13px;color:#71717a;">Total Amount</td>
        <td style="padding:10px 12px;font-size:14px;color:#18181b;font-weight:600;">${formattedTotal}</td>
      </tr>
      <tr>
        <td style="padding:10px 12px;font-size:13px;color:#71717a;">Due Date</td>
        <td style="padding:10px 12px;font-size:14px;color:#18181b;">${details.dueDate}</td>
      </tr>
    </table>
    ${pdfSection}
    <p style="margin:0;font-size:13px;color:#71717a;">
      If you have questions about this invoice, please contact ${details.practitionerName} directly.
    </p>`,
  );

  return sendEmail(
    to,
    `Invoice #${details.invoiceNumber} from ${details.practitionerName}`,
    html,
  );
}
