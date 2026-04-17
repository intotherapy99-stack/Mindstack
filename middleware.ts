import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// ─── Global API Rate Limiter (Edge-compatible) ────────────────────────
// In-memory sliding window. For multi-instance production, use Upstash Redis.
const apiHits = new Map<string, { count: number; resetAt: number }>();

function globalApiRateLimit(req: NextRequest): NextResponse | null {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const windowMs = 60_000; // 1 minute
  const isMutation = ["POST", "PATCH", "PUT", "DELETE"].includes(req.method);
  const maxRequests = isMutation ? 30 : 100; // stricter for mutations

  const key = `${ip}:${isMutation ? "mut" : "read"}`;
  const entry = apiHits.get(key);

  if (!entry || entry.resetAt < now) {
    apiHits.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  entry.count++;
  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(maxRequests),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }
  return null;
}

// Cleanup stale entries every 5 min
if (typeof globalThis !== "undefined") {
  const CLEANUP_KEY = "__rateLimit_cleanup";
  if (!(globalThis as any)[CLEANUP_KEY]) {
    (globalThis as any)[CLEANUP_KEY] = true;
    setInterval(() => {
      const now = Date.now();
      apiHits.forEach((v, k) => { if (v.resetAt < now) apiHits.delete(k); });
    }, 5 * 60_000);
  }
}

// ─── Route Configuration ──────────────────────────────────────────────
const protectedPrefixes = [
  "/dashboard",
  "/clients",
  "/calendar",
  "/notes",
  "/payments",
  "/profile",
  "/settings",
  "/supervision",
  "/community",
  "/analytics",
];

const clientPrefixes = [
  "/my-sessions",
  "/my-payments",
  "/my-care",
  "/my-prescriptions",
  "/my-profile",
];

const publicPaths = [
  "/login",
  "/signup",
  "/onboarding",
  "/privacy",
  "/terms",
  "/find-therapist",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ─── Global API rate limiting ───────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    // Skip rate limiting for webhooks (they have their own signature verification)
    if (pathname.startsWith("/api/webhooks/")) {
      return NextResponse.next();
    }
    const rateLimited = globalApiRateLimit(req);
    if (rateLimited) return rateLimited;
    return NextResponse.next();
  }

  // Skip static files and public paths
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/portal/") ||
    pathname.startsWith("/dr/") ||
    publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const isProtected =
    protectedPrefixes.some((p) => pathname.startsWith(p)) ||
    clientPrefixes.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check user type for client-specific routes
    if (clientPrefixes.some((p) => pathname.startsWith(p))) {
      if (token.userType !== "CLIENT") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Check user type for professional routes
    if (protectedPrefixes.some((p) => pathname.startsWith(p))) {
      if (token.userType === "CLIENT") {
        return NextResponse.redirect(new URL("/my-sessions", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
