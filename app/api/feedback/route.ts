import { NextRequest, NextResponse } from 'next/server';
import { sanitizePlainText, sanitizeRichText } from '@/lib/sanitize';

// Rate limit: simple in-memory store (per-process)
const rateLimiter = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // 5 feedback submissions per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimiter.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimiter.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;

  entry.count++;
  return false;
}

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many feedback submissions. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { type, message, page, timestamp } = body;

    // Validate required fields
    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'Feedback message must be at least 5 characters.' },
        { status: 400 }
      );
    }

    if (!type || !['bug', 'feature', 'general', 'praise'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid feedback type.' },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedType = sanitizePlainText(type, 20);
    const sanitizedMessage = sanitizeRichText(message.trim(), 500);
    const sanitizedPage = sanitizePlainText(page || 'unknown', 200);
    const sanitizedTimestamp = sanitizePlainText(timestamp || new Date().toISOString(), 30);

    // Log feedback to console (in production, Vercel captures this)
    // Future: send to database, email, or external service
    console.log('[Feedback]', {
      type: sanitizedType,
      page: sanitizedPage,
      timestamp: sanitizedTimestamp,
      message: sanitizedMessage.slice(0, 500),
      ip,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    );
  }
}
