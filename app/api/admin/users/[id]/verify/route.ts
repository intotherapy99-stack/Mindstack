import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiRateLimit } from "@/lib/rate-limit";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rateLimitResponse = apiRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!adminUser || adminUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { status } = body;

  if (!["VERIFIED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const profile = await prisma.profile.update({
    where: { userId: params.id },
    data: {
      verificationStatus: status,
      verifiedAt: status === "VERIFIED" ? new Date() : null,
    },
  });

  // Notify user
  await prisma.notification.create({
    data: {
      userId: params.id,
      type: "VERIFICATION_UPDATE",
      title:
        status === "VERIFIED"
          ? "Your profile has been verified!"
          : "Verification update",
      body:
        status === "VERIFIED"
          ? "Congratulations! Your credentials have been verified. You now have a verified badge on your profile."
          : "Your credential verification was not approved. Please re-upload your documents or contact support.",
      link: "/profile",
    },
  });

  return NextResponse.json(profile);
}
