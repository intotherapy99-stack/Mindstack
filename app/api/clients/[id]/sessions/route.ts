import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify client belongs to this practitioner
  const client = await prisma.client.findFirst({
    where: {
      id: params.id,
      practitionerId: session.user.id,
    },
    select: { id: true },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const appointments = await prisma.appointment.findMany({
    where: { clientId: params.id },
    orderBy: { scheduledAt: "desc" },
    select: {
      id: true,
      scheduledAt: true,
      duration: true,
      sessionType: true,
      modality: true,
      status: true,
      fee: true,
      noShow: true,
    },
  });

  return NextResponse.json(appointments);
}
