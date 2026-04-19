import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCronRequest } from "@/lib/cron-auth";
import { addDays, startOfDay, endOfDay, format } from "date-fns";
import { sendAppointmentReminder } from "@/lib/email";
import { sendAppointmentReminderSMS } from "@/lib/msg91";

export const dynamic = "force-dynamic";

// Runs daily at 8am IST (2:30 UTC) — sends 24h reminders
export async function GET(req: NextRequest) {
  const authError = validateCronRequest(req);
  if (authError) return authError;
  const tomorrow = addDays(new Date(), 1);
  const tomorrowStart = startOfDay(tomorrow);
  const tomorrowEnd = endOfDay(tomorrow);

  const appointments = await prisma.appointment.findMany({
    where: {
      scheduledAt: { gte: tomorrowStart, lte: tomorrowEnd },
      status: { not: "CANCELLED" },
      reminderSent24h: false,
    },
    include: {
      client: true,
      practitioner: { include: { profile: true } },
    },
  });

  let sentCount = 0;

  for (const apt of appointments) {
    const practitionerName = apt.practitioner?.profile?.displayName || "Your practitioner";
    const clientName = apt.client?.firstName || "client";
    const dateStr = format(new Date(apt.scheduledAt), "dd MMM yyyy");
    const timeStr = format(new Date(apt.scheduledAt), "hh:mm a");

    // Send email reminder to client
    if (apt.client?.email) {
      await sendAppointmentReminder(apt.client.email, {
        practitionerName,
        clientName,
        date: dateStr,
        time: timeStr,
        hoursUntil: 24,
        meetingLink: apt.meetingLink || undefined,
      }).catch((err) => console.error("[cron:24h] email failed:", err));
    }

    // Send SMS reminder to client
    if (apt.client?.phone) {
      await sendAppointmentReminderSMS(apt.client.phone, {
        practitionerName,
        date: dateStr,
        time: timeStr,
      }).catch((err) => console.error("[cron:24h] sms failed:", err));
    }

    await prisma.appointment.update({
      where: { id: apt.id },
      data: { reminderSent24h: true },
    });

    await prisma.notification.create({
      data: {
        userId: apt.practitionerId,
        type: "SESSION_REMINDER",
        title: "Tomorrow's session",
        body: `Reminder: Session with ${clientName} tomorrow at ${timeStr}`,
        link: `/calendar`,
      },
    });

    sentCount++;
  }

  return NextResponse.json({
    success: true,
    reminders_sent: sentCount,
  });
}
