import { NextResponse } from "next/server";
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const clientRecords = await prisma.client.findMany({
      where: { email: user.email },
      select: { id: true },
    });
    const clientIds = clientRecords.map((c) => c.id);

    const prescriptions = await prisma.prescription.findMany({
      where: { clientId: { in: clientIds }, isVisibleToClient: true },
      include: {
        practitioner: {
          select: { profile: { select: { displayName: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      prescriptions.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        fileUrl: p.fileUrl,
        fileName: p.fileName,
        fileType: p.fileType,
        fileSize: p.fileSize,
        createdAt: p.createdAt,
        practitionerName: p.practitioner.profile?.displayName ?? "Doctor",
      }))
    );
  } catch (error) {
    console.error("Client prescriptions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
