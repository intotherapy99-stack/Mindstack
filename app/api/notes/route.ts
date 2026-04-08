import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPaymentForCompletedAppointment } from "@/lib/billing";
import { auditLog } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");
  const search = searchParams.get("q");

  const where: any = { practitionerId: session.user.id };
  if (clientId) where.clientId = clientId;

  const notes = await prisma.note.findMany({
    where,
    include: {
      client: { select: { firstName: true, lastName: true } },
      appointment: { select: { scheduledAt: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { clientId, appointmentId, template, content, tags } = body;

  const note = await prisma.note.create({
    data: {
      practitionerId: session.user.id,
      clientId: clientId || null,
      appointmentId: appointmentId || null,
      template: template || "SOAP",
      content: content || {},
      tags: tags || [],
    },
  });

  // If linked to appointment, mark appointment as completed and auto-create pending payment
  if (appointmentId) {
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "COMPLETED" },
    });

    // Auto-create PENDING payment for this session
    await createPaymentForCompletedAppointment(appointmentId);
  }

  await auditLog({
    userId: session.user.id,
    action: "CREATE_NOTE",
    resourceType: "Note",
    resourceId: note.id,
    details: `Clinical note created${clientId ? ` for client ${clientId}` : ""}`,
  });

  return NextResponse.json(note, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { noteId, template, content, tags } = body;
  if (!noteId) return NextResponse.json({ error: "noteId required" }, { status: 400 });

  const existing = await prisma.note.findFirst({
    where: { id: noteId, practitionerId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: any = {};
  if (template) data.template = template;
  if (content) data.content = content;
  if (tags) data.tags = tags;

  const updated = await prisma.note.update({ where: { id: noteId }, data });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const noteId = searchParams.get("noteId");
  if (!noteId) return NextResponse.json({ error: "noteId required" }, { status: 400 });

  const existing = await prisma.note.findFirst({
    where: { id: noteId, practitionerId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.note.delete({ where: { id: noteId } });
  return NextResponse.json({ success: true });
}
