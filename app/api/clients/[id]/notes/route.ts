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

  const notes = await prisma.note.findMany({
    where: { clientId: params.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      template: true,
      content: true,
      tags: true,
      createdAt: true,
      appointment: {
        select: {
          scheduledAt: true,
        },
      },
    },
  });

  return NextResponse.json(notes);
}
