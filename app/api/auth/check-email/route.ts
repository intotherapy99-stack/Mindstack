import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// HEAD/POST — returns whether an email is registered.
// Used by the login form to decide "wrong password" vs "no account → sign up".
export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ exists: false });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { id: true },
  });

  return NextResponse.json({ exists: Boolean(user) });
}
