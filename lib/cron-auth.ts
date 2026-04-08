import { NextRequest, NextResponse } from "next/server";

/**
 * Validate cron endpoint requests using CRON_SECRET.
 * Expects Authorization: Bearer <CRON_SECRET> header.
 * Returns null if valid, or an error response if invalid.
 */
export function validateCronRequest(req: NextRequest): NextResponse | null {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET not configured — cron endpoint blocked");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // Valid request
}
