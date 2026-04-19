import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Always return success to avoid leaking whether email exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      // Delete any existing reset tokens for this email
      await prisma.passwordResetToken.deleteMany({
        where: { email: normalizedEmail },
      });

      // Create a new token with 1-hour expiry
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.passwordResetToken.create({
        data: {
          email: normalizedEmail,
          token,
          expiresAt,
        },
      });

      await sendPasswordResetEmail(normalizedEmail, token);
    }

    return NextResponse.json({
      message: "If an account exists, a reset email has been sent",
    });
  } catch (error) {
    console.error("[forgot-password] error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
