import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCronRequest } from "@/lib/cron-auth";
import { addHours, format } from "date-fns";
import { sendAppointmentReminder } from "@/lib/email";
import { sendAppointmentReminderSMS, MSG91_TEMPLATES } from "@/lib/msg91";

export const dynamic = "force-dynamic";

// Runs every 30 minutes — sends 2h reminders
export async function GET(req: NextRequest) {
  const authError = validateCronRequest(req);
  if (authError) return authError;
  const now = new Date();
  const twoHoursFromNow = addHours(now, 2);

  const appointments = await prisma.appointment.findMany({
    where: {
      scheduledAt: {
        gte: now,
        lte: twoHoursFromNow,
      },
      status: { not: "CANCELLED" },
      reminderSent2h: false,
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
        hoursUntil: 2,
        meetingLink: apt.meetingLink || undefined,
      }).catch((err) => console.error("[cron:2h] email failed:", err));
    }

    // Send SMS reminder to client (use 2h template)
    if (apt.client?.phone) {
      await sendAppointmentReminderSMS(
        apt.client.phone,
        { practitionerName, date: dateStr, time: timeStr },
        MSG91_TEMPLATES.REMINDER_2H,
      ).catch((err) => console.error("[cron:2h] sms failed:", err));
    }

    await prisma.appointment.update({
      where: { id: apt.id },
      data: { reminderSent2h: true },
    });

    await prisma.notification.create({
      data: {
        userId: apt.practitionerId,
        type: "SESSION_REMINDER",
        title: "Session in 2 hours",
        body: `Your session with ${clientName} starts at ${timeStr}`,
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
