import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCronRequest } from "@/lib/cron-auth";
import { addDays, startOfDay, endOfDay } from "date-fns";

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
    // In production: send WhatsApp via MSG91 and email via Resend
    // For now, just mark as sent and create notification
    await prisma.appointment.update({
      where: { id: apt.id },
      data: { reminderSent24h: true },
    });

    await prisma.notification.create({
      data: {
        userId: apt.practitionerId,
        type: "SESSION_REMINDER",
        title: "Tomorrow's session",
        body: `Reminder: Session with ${apt.client?.firstName || "client"} tomorrow at ${new Date(apt.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`,
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
