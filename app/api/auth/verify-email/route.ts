import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

// POST: Generate a verification token and send email
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Delete any existing tokens for this email
    await prisma.emailVerificationToken.deleteMany({
      where: { email },
    });

    // Create a new token with 24-hour expiry
    const token = crypto.randomUUID();
    await prisma.emailVerificationToken.create({
      data: {
        email,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Send the verification email
    await sendVerificationEmail(email, token);

    return NextResponse.json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Error generating verification token:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}

// GET: Verify a token from the URL
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Look up the token
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Check if the token has expired
    if (verificationToken.expiresAt < new Date()) {
      // Clean up the expired token
      await prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });
      return NextResponse.json(
        { error: "Token has expired" },
        { status: 400 }
      );
    }

    // Mark the user's email as verified
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: new Date() },
    });

    // Delete the used token
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
