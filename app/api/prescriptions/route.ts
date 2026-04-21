import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mutationRateLimit } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");

  const where: any = { practitionerId: session.user.id };
  if (clientId) where.clientId = clientId;

  const prescriptions = await prisma.prescription.findMany({
    where,
    include: { client: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(prescriptions);
}

export async function POST(req: NextRequest) {
  const rateLimitResponse = mutationRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { clientId, title, description, fileUrl, fileName, fileType, fileSize, isVisibleToClient } = body;

  if (!clientId || !title || !fileUrl || !fileName || !fileType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Validate fileUrl is from our Supabase Storage bucket — reject any arbitrary URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || !fileUrl.startsWith(`${supabaseUrl}/storage/v1/object/`)) {
    return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
  }

  // Verify client belongs to practitioner
  const client = await prisma.client.findFirst({
    where: { id: clientId, practitionerId: session.user.id },
  });
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const prescription = await prisma.prescription.create({
    data: {
      practitionerId: session.user.id,
      clientId,
      title: sanitizeString(title, 200),
      description: description ? sanitizeString(description, 2000) : null,
      fileUrl,
      fileName: sanitizeString(fileName, 200),
      fileType,
      fileSize: fileSize || 0,
      isVisibleToClient: isVisibleToClient !== false,
    },
  });
  return NextResponse.json(prescription, { status: 201 });
}
