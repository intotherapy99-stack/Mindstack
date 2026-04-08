import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mutationRateLimit } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/validation";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prescription = await prisma.prescription.findUnique({
    where: { id: params.id },
    include: { client: { select: { firstName: true, lastName: true } } },
  });

  if (!prescription) {
    return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
  }

  // Allow access if user is the practitioner owner
  if (prescription.practitionerId === session.user.id) {
    return NextResponse.json(prescription);
  }

  // Allow access if user is the client and prescription is visible to them
  // Check if the authenticated user has a ClientProfile linked to this client
  const clientProfile = await prisma.clientProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (
    clientProfile?.linkedClientId === prescription.clientId &&
    prescription.isVisibleToClient
  ) {
    return NextResponse.json(prescription);
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rateLimitResponse = mutationRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only practitioner owner can update
  const existing = await prisma.prescription.findFirst({
    where: { id: params.id, practitionerId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
  }

  const body = await req.json();
  const updateData: Record<string, any> = {};

  if (body.title !== undefined) updateData.title = sanitizeString(body.title, 200);
  if (body.description !== undefined)
    updateData.description = body.description ? sanitizeString(body.description, 2000) : null;
  if (body.fileUrl !== undefined) updateData.fileUrl = body.fileUrl;
  if (body.fileName !== undefined) updateData.fileName = sanitizeString(body.fileName, 200);
  if (body.fileType !== undefined) updateData.fileType = body.fileType;
  if (body.fileSize !== undefined) updateData.fileSize = body.fileSize;
  if (body.isVisibleToClient !== undefined) updateData.isVisibleToClient = body.isVisibleToClient;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const updated = await prisma.prescription.update({
    where: { id: params.id },
    data: updateData,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rateLimitResponse = mutationRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only practitioner owner can delete
  const existing = await prisma.prescription.findFirst({
    where: { id: params.id, practitionerId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
  }

  await prisma.prescription.delete({ where: { id: params.id } });

  return NextResponse.json({ message: "Prescription deleted" });
}
