import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publicRateLimit } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/validation";

interface Props {
  params: { slug: string };
}

export async function POST(req: NextRequest, { params }: Props) {
  const rateLimitResponse = publicRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { slug } = params;

    // Find practitioner by slug
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
      return NextResponse.json(
        { error: "Practitioner not found or booking disabled" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, email, phone, date, time, sessionType, concern } = body;

    // Validate required fields
    if (!name || !phone || !date || !time) {
      return NextResponse.json(
        { error: "Name, phone, date, and time are required" },
        { status: 400 }
      );
    }

    // Strict format validation
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Invalid date format (YYYY-MM-DD)" }, { status: 400 });
    }
    if (!/^\d{2}:\d{2}$/.test(time)) {
      return NextResponse.json({ error: "Invalid time format (HH:MM)" }, { status: 400 });
    }

    // Sanitize text inputs
    const safeName = sanitizeString(name, 100);
    const safeConcern = concern ? sanitizeString(concern, 2000) : null;

    // Parse the requested datetime
    const scheduledAt = new Date(`${date}T${time}:00`);
    if (isNaN(scheduledAt.getTime())) {
      return NextResponse.json(
        { error: "Invalid date or time" },
        { status: 400 }
      );
    }

    // Must be in the future
    if (scheduledAt <= new Date()) {
      return NextResponse.json(
        { error: "Cannot book a session in the past" },
        { status: 400 }
      );
    }

    // Check the requested time falls within availability
    const dayOfWeek = scheduledAt.getDay(); // 0=Sun, 6=Sat
    const requestedTime = time; // HH:MM format
    const daySlots = profile.user.availability.filter(
      (a) => a.dayOfWeek === dayOfWeek
    );

    if (daySlots.length === 0) {
      return NextResponse.json(
        { error: "Practitioner is not available on this day" },
        { status: 400 }
      );
    }

    const isWithinSlot = daySlots.some(
      (slot) => requestedTime >= slot.startTime && requestedTime < slot.endTime
    );

    if (!isWithinSlot) {
      return NextResponse.json(
        { error: "Selected time is outside available hours" },
        { status: 400 }
      );
    }

    // Check for double booking (within session duration + buffer)
    const duration = profile.sessionDuration || 50;
    const buffer = profile.bufferTime || 10;
    const sessionEnd = new Date(
      scheduledAt.getTime() + (duration + buffer) * 60 * 1000
    );
    const sessionStart = new Date(
      scheduledAt.getTime() - (duration + buffer) * 60 * 1000
    );

    const conflicting = await prisma.appointment.findFirst({
      where: {
        practitionerId: profile.userId,
        status: { in: ["PENDING", "CONFIRMED"] },
        scheduledAt: {
          gte: sessionStart,
          lt: sessionEnd,
        },
      },
    });

    if (conflicting) {
      return NextResponse.json(
        { error: "This time slot is already booked. Please choose another time." },
        { status: 409 }
      );
    }

    // Try to match an existing client by email or phone
    let clientId: string | null = null;
    if (email || phone) {
      const existingClient = await prisma.client.findFirst({
        where: {
          practitionerId: profile.userId,
          OR: [
            ...(email ? [{ email }] : []),
            ...(phone ? [{ phone }] : []),
          ],
        },
      });

      if (existingClient) {
        clientId = existingClient.id;
      } else {
        // Create a new client for this practitioner
        const nameParts = safeName.trim().split(" ");
        const newClient = await prisma.client.create({
          data: {
            practitionerId: profile.userId,
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(" ") || null,
            email: email || null,
            phone: phone || null,
            presentingConcern: safeConcern,
            referralSource: "Online Booking",
          },
        });
        clientId = newClient.id;
      }
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        practitionerId: profile.userId,
        clientId,
        scheduledAt,
        duration,
        sessionType: sessionType || "FOLLOW_UP",
        modality: "ONLINE", // Default for online bookings
        fee: profile.sessionFee,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        id: appointment.id,
        scheduledAt: appointment.scheduledAt,
        duration: appointment.duration,
        status: appointment.status,
        message: "Booking request submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
