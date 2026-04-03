/**
 * Simple in-memory rate limiter for API routes.
 * Uses sliding window counters per IP + path.
 * 
 * Usage in API routes:
 *   import { rateLimit } from '@/lib/rate-limit';
 *   const result = rateLimit(request);
 *   if (!result.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: result.headers });
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /** Time window in seconds (default: 60) */
  windowSeconds?: number;
  /** Max requests per window (default: 30) */
  maxRequests?: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
  reset: number;
  headers: Headers;
}

export function rateLimit(
  request: Request,
  config: RateLimitConfig = {}
): RateLimitResult {
  const windowSeconds = config.windowSeconds ?? 60;
  const maxRequests = config.maxRequests ?? 30;

  // Get client IP from headers or fallback
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  const path = new URL(request.url).pathname;

  const key = `${ip}:${path}`;
  const now = Date.now();
  const resetTime = now + windowSeconds * 1000;

  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    // New window
    store.set(key, { count: 1, resetTime });
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', String(maxRequests));
    headers.set('X-RateLimit-Remaining', String(maxRequests - 1));
    headers.set('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000)));
    return {
      success: true,
      remaining: maxRequests - 1,
      limit: maxRequests,
      reset: Math.ceil(resetTime / 1000),
      headers,
    };
  }

  if (entry.count >= maxRequests) {
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', String(maxRequests));
    headers.set('X-RateLimit-Remaining', '0');
    headers.set('X-RateLimit-Reset', String(Math.ceil(entry.resetTime / 1000)));
    headers.set('Retry-After', String(Math.ceil((entry.resetTime - now) / 1000)));
    return {
      success: false,
      remaining: 0,
      limit: maxRequests,
      reset: Math.ceil(entry.resetTime / 1000),
      headers,
    };
  }

  entry.count++;
  const remaining = maxRequests - entry.count;
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', String(maxRequests));
  headers.set('X-RateLimit-Remaining', String(remaining));
  headers.set('X-RateLimit-Reset', String(Math.ceil(entry.resetTime / 1000)));

  return {
    success: true,
    remaining,
    limit: maxRequests,
    reset: Math.ceil(entry.resetTime / 1000),
    headers,
  };
}

// Preset configurations for different route types
export const RATE_LIMITS = {
  /** Public read endpoints — generous */
  read: { windowSeconds: 60, maxRequests: 60 },
  /** Write endpoints — moderate */
  write: { windowSeconds: 60, maxRequests: 20 },
  /** Auth endpoints — strict */
  auth: { windowSeconds: 60, maxRequests: 5 },
  /** Search — moderate */
  search: { windowSeconds: 60, maxRequests: 30 },
} as const;
