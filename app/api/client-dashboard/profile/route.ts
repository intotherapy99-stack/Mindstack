import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any).userType !== "CLIENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!clientProfile) {
      return NextResponse.json(
        { error: "Client profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      profile: {
        displayName: clientProfile.displayName,
        dateOfBirth: clientProfile.dateOfBirth,
        gender: clientProfile.gender,
        occupation: clientProfile.occupation,
        city: clientProfile.city,
        state: clientProfile.state,
        emergencyContact: clientProfile.emergencyContact,
        emergencyPhone: clientProfile.emergencyPhone,
        preferredLanguage: clientProfile.preferredLanguage,
        createdAt: clientProfile.createdAt,
        updatedAt: clientProfile.updatedAt,
      },
    });
  } catch (error) {
    console.error("Client profile GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const ALLOWED_FIELDS = [
  "displayName",
  "dateOfBirth",
  "gender",
  "occupation",
  "city",
  "state",
  "emergencyContact",
  "emergencyPhone",
  "preferredLanguage",
] as const;

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any).userType !== "CLIENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Only allow updating permitted fields
    const data: Record<string, unknown> = {};
    for (const field of ALLOWED_FIELDS) {
      if (field in body) {
        if (field === "dateOfBirth" && body[field] !== null) {
          data[field] = new Date(body[field]);
        } else {
          data[field] = body[field];
        }
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedProfile = await prisma.clientProfile.update({
      where: { userId: session.user.id },
      data,
    });

    return NextResponse.json({
      profile: {
        displayName: updatedProfile.displayName,
        dateOfBirth: updatedProfile.dateOfBirth,
        gender: updatedProfile.gender,
        occupation: updatedProfile.occupation,
        city: updatedProfile.city,
        state: updatedProfile.state,
        emergencyContact: updatedProfile.emergencyContact,
        emergencyPhone: updatedProfile.emergencyPhone,
        preferredLanguage: updatedProfile.preferredLanguage,
        createdAt: updatedProfile.createdAt,
        updatedAt: updatedProfile.updatedAt,
      },
    });
  } catch (error) {
    console.error("Client profile PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
