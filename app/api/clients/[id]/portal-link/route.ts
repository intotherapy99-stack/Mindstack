import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";
import crypto from "crypto";

const TOKEN_EXPIRY_DAYS = 30; // Portal tokens expire after 30 days

function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// POST — generate a portal link for a client
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await prisma.client.findFirst({
    where: { id: params.id, practitionerId: session.user.id },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  // Check if an active, non-expired token already exists
  const existing = await prisma.clientPortalToken.findFirst({
    where: {
      clientId: client.id,
      isActive: true,
      OR: [
        { expiresAt: null }, // Legacy tokens without expiry — will be replaced
        { expiresAt: { gt: new Date() } },
      ],
    },
  });

  if (existing && existing.expiresAt) {
    return NextResponse.json({
      token: existing.token,
      url: `/portal/${existing.token}`,
      expiresAt: existing.expiresAt,
    });
  }

  // Deactivate any old tokens
  await prisma.clientPortalToken.updateMany({
    where: { clientId: client.id, isActive: true },
    data: { isActive: false },
  });

  // Create a new token with secure random value and expiry
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + TOKEN_EXPIRY_DAYS);

  const portalToken = await prisma.clientPortalToken.create({
    data: {
      token: generateSecureToken(),
      clientId: client.id,
      practitionerId: session.user.id,
      expiresAt,
    },
  });

  await auditLog({
    userId: session.user.id,
    action: "CREATE_PORTAL_TOKEN",
    resourceType: "Client",
    resourceId: client.id,
    details: `Portal token created for ${client.firstName}, expires ${expiresAt.toISOString()}`,
  });

  return NextResponse.json({
    token: portalToken.token,
    url: `/portal/${portalToken.token}`,
    expiresAt: portalToken.expiresAt,
  });
}

// DELETE — revoke portal access
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.clientPortalToken.updateMany({
    where: {
      clientId: params.id,
      practitionerId: session.user.id,
      isActive: true,
    },
    data: { isActive: false },
  });

  await auditLog({
    userId: session.user.id,
    action: "CREATE_PORTAL_TOKEN",
    resourceType: "Client",
    resourceId: params.id,
    details: "Portal access revoked",
  });

  return NextResponse.json({ success: true });
}
