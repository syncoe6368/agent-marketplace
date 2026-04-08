import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const ipMap = new Map<string, { count: number; windowStart: number }>();

function sanitizeInput(str: string): string {
  return str
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/[<>{}()\[\]\\]/g, '') // strip brackets
    .trim()
    .slice(0, 2000);
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  // Rate limit check
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (entry && now - entry.windowStart < RATE_LIMIT_WINDOW_MS) {
    if (entry.count >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      );
    }
    entry.count++;
  } else {
    ipMap.set(ip, { count: 1, windowStart: now });
  }

  try {
    const body = await request.json();
    const { type = 'general', message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const sanitized = sanitizeInput(message);
    if (sanitized.length === 0) {
      return NextResponse.json({ error: 'Message too short' }, { status: 400 });
    }

    const validTypes = ['bug', 'feature', 'general', 'praise'];
    const feedbackType = validTypes.includes(type) ? type : 'general';

    // In production, this would store to Supabase or send to a webhook.
    // For now, log and acknowledge.
    console.log(`[Feedback] type=${feedbackType} ip=${ip.slice(0, 12)}... message="${sanitized.slice(0, 100)}..."`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
