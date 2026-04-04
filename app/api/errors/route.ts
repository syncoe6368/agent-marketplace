import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory error log (resets on deploy)
// For production, replace with Sentry/Datadog/etc.
const errorBuffer: Array<Record<string, unknown>> = [];
const MAX_ERRORS = 100;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const errorEntry = {
      ...body,
      receivedAt: new Date().toISOString(),
    };

    errorBuffer.push(errorEntry);
    if (errorBuffer.length > MAX_ERRORS) {
      errorBuffer.shift();
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  // Admin-only: list recent errors
  const authHeader = request.headers.get('authorization');
  // Simple auth check — in production, use proper auth middleware
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    count: errorBuffer.length,
    errors: errorBuffer,
  });
}
