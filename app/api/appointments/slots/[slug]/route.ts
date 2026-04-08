import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Props {
  params: { slug: string };
}

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");

    if (!dateStr) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { slug },
      include: {
        user: {
          include: {
            availability: { where: { isActive: true } },
          },
        },
      },
    });

    if (!profile || !profile.bookingPageEnabled) {
      return NextResponse.json({ error: "Practitioner not found" }, { status: 404 });
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const dayOfWeek = date.getDay();
    const daySlots = profile.user.availability.filter((a) => a.dayOfWeek === dayOfWeek);

    if (daySlots.length === 0) {
      return NextResponse.json({ slots: [], message: "Practitioner is not available on this day" });
    }

    const duration = profile.sessionDuration || 50;
    const buffer = profile.bufferTime || 10;
    const slotLength = duration + buffer; // total block per session

    // Generate all possible time slots
    const allSlots: string[] = [];
    for (const slot of daySlots) {
      const [startH, startM] = slot.startTime.split(":").map(Number);
      const [endH, endM] = slot.endTime.split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      for (let t = startMinutes; t + duration <= endMinutes; t += slotLength) {
        const h = Math.floor(t / 60).toString().padStart(2, "0");
        const m = (t % 60).toString().padStart(2, "0");
        allSlots.push(`${h}:${m}`);
      }
    }

    // Get existing appointments for this date
    const dayStart = new Date(dateStr);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dateStr);
    dayEnd.setHours(23, 59, 59, 999);

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        practitionerId: profile.userId,
        status: { in: ["PENDING", "CONFIRMED"] },
        scheduledAt: { gte: dayStart, lte: dayEnd },
      },
      select: { scheduledAt: true, duration: true },
    });

    // Filter out booked slots
    const bookedTimes = existingAppointments.map((apt) => {
      const aptDate = new Date(apt.scheduledAt);
      return `${aptDate.getHours().toString().padStart(2, "0")}:${aptDate.getMinutes().toString().padStart(2, "0")}`;
    });

    // Also filter out past times if the date is today
    const now = new Date();
    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    const currentTime = isToday
      ? `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      : "00:00";

    const availableSlots = allSlots
      .filter((time) => !bookedTimes.includes(time))
      .filter((time) => time > currentTime);

    return NextResponse.json({
      slots: availableSlots,
      duration,
      fee: profile.sessionFee,
    });
  } catch (error) {
    console.error("Slots error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
