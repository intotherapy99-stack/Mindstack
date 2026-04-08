import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { formatPhoneForStorage } from "@/lib/utils";
import { authRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rateLimitResponse = authRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();
    const { email, password, name, phone, userType = "PROFESSIONAL" } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Phone is required for professionals, optional for clients
    if (userType === "PROFESSIONAL" && !phone) {
      return NextResponse.json(
        { error: "Phone number is required for professionals" },
        { status: 400 }
      );
    }

    const formattedPhone = phone ? formatPhoneForStorage(phone) : null;

    // Check existing user
    const whereConditions: any[] = [{ email: email.toLowerCase() }];
    if (formattedPhone) {
      whereConditions.push({ phone: formattedPhone });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: whereConditions },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email or phone already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        phone: formattedPhone,
        passwordHash,
        userType: userType === "CLIENT" ? "CLIENT" : "PROFESSIONAL",
      },
    });

    // Create a free subscription for professionals
    if (userType === "PROFESSIONAL") {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: "FREE",
          status: "ACTIVE",
          startDate: new Date(),
        },
      });
    }

    // Create client profile for client users
    if (userType === "CLIENT") {
      await prisma.clientProfile.create({
        data: {
          userId: user.id,
          displayName: name,
        },
      });
    }

    return NextResponse.json(
      { message: "Account created successfully", userId: user.id, userType },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
