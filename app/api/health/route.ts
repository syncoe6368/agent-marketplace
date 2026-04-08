import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const startTime = Date.now();

  // Check Supabase connectivity
  let dbStatus = 'ok';
  let dbLatencyMs = 0;
  try {
    const dbStart = Date.now();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      dbStatus = 'misconfigured';
    } else {
      const res = await fetch(`${url}/rest/v1/agents?select=id&limit=1`, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        signal: AbortSignal.timeout(5000),
      });
      dbLatencyMs = Date.now() - dbStart;
      if (!res.ok) dbStatus = `error_${res.status}`;
    }
  } catch (e) {
    dbStatus = 'unreachable';
    dbLatencyMs = -1;
  }

  return NextResponse.json({
    status: 'healthy',
    version: process.env.npm_package_version || 'unknown',
    timestamp: new Date().toISOString(),
    responseTimeMs: Date.now() - startTime,
    checks: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
    },
  });
}
