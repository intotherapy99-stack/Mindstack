import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCronRequest } from "@/lib/cron-auth";
import { addHours } from "date-fns";

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
    await prisma.appointment.update({
      where: { id: apt.id },
      data: { reminderSent2h: true },
    });

    await prisma.notification.create({
      data: {
        userId: apt.practitionerId,
        type: "SESSION_REMINDER",
        title: "Session in 2 hours",
        body: `Your session with ${apt.client?.firstName || "client"} starts at ${new Date(apt.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`,
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
