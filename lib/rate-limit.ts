import { NextRequest, NextResponse } from "next/server";

/**
 * In-memory rate limiter for API endpoints.
 * For production, replace with Redis-based solution (e.g., Upstash).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (entry.resetAt < now) store.delete(key);
  });
}, 5 * 60 * 1000);

interface RateLimitOptions {
  maxRequests: number; // Max requests per window
  windowMs: number;    // Window in milliseconds
}

/**
 * Check if a request should be rate limited.
 * Returns null if allowed, or a 429 response if limited.
 */
export function rateLimit(
  req: NextRequest,
  options: RateLimitOptions = { maxRequests: 20, windowMs: 60 * 1000 }
): NextResponse | null {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const key = `${ip}:${req.nextUrl.pathname}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return null;
  }

  entry.count++;

  if (entry.count > options.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(options.maxRequests),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(entry.resetAt),
        },
      }
    );
  }

  return null;
}

// Preset rate limiters
export const authRateLimit = (req: NextRequest) =>
  rateLimit(req, { maxRequests: 5, windowMs: 60 * 1000 }); // 5 req/min for auth

export const apiRateLimit = (req: NextRequest) =>
  rateLimit(req, { maxRequests: 60, windowMs: 60 * 1000 }); // 60 req/min for general API

export const publicRateLimit = (req: NextRequest) =>
  rateLimit(req, { maxRequests: 30, windowMs: 60 * 1000 }); // 30 req/min for public endpoints

export const portalRateLimit = (req: NextRequest) =>
  rateLimit(req, { maxRequests: 10, windowMs: 60 * 1000 }); // 10 req/min for portal

export const mutationRateLimit = (req: NextRequest) =>
  rateLimit(req, { maxRequests: 30, windowMs: 60 * 1000 }); // 30 req/min for mutations

export const sensitiveRateLimit = (req: NextRequest) =>
  rateLimit(req, { maxRequests: 3, windowMs: 60 * 1000 }); // 3 req/min for sensitive ops (delete, export)
