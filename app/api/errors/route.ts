import { NextRequest, NextResponse } from 'next/server';

// In-memory error buffer (resets on deploy, useful for GET /api/errors)
const errorBuffer: Array<Record<string, unknown>> = [];
const MAX_ERRORS = 100;

// Rate limit: don't spam Discord with the same error
const recentAlerts = new Map<string, number>();
const ALERT_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes between alerts for same digest

function getAlertKey(digest: string | undefined, url: string): string {
  return `${digest || 'unknown'}:${url}`;
}

async function sendDiscordAlert(error: Record<string, unknown>) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const url = (error.url as string) || 'unknown';
  const message = ((error.message as string) || 'Unknown error').slice(0, 500);
  const digest = error.digest as string | undefined;
  const timestamp = error.receivedAt as string;
  const userAgent = ((error.userAgent as string) || 'unknown').slice(0, 100);

  // Rate check
  const key = getAlertKey(digest, url);
  const lastAlert = recentAlerts.get(key) || 0;
  if (Date.now() - lastAlert < ALERT_COOLDOWN_MS) return;
  recentAlerts.set(key, Date.now());

  // Clean up old rate limit entries
  for (const [k, v] of recentAlerts) {
    if (Date.now() - v > ALERT_COOLDOWN_MS * 2) recentAlerts.delete(k);
  }

  const color = digest ? 16776960 : 15158332; // Yellow if has digest (caught), red if uncaught

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '🔴 AgentHub Error',
          description: `**${message}**`,
          color,
          fields: [
            { name: 'URL', value: url.slice(0, 200), inline: true },
            { name: 'Digest', value: digest || 'N/A', inline: true },
            { name: 'User Agent', value: userAgent, inline: false },
          ],
          timestamp,
          footer: { text: 'AgentHub Error Alerting' },
        }],
      }),
    });
  } catch {
    // Never let error alerting itself cause issues
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const errorEntry = {
      ...body,
      receivedAt: new Date().toISOString(),
    };

    // Buffer in memory
    errorBuffer.push(errorEntry);
    if (errorBuffer.length > MAX_ERRORS) errorBuffer.shift();

    // Fire Discord alert (non-blocking, rate-limited)
    // Use waitUntil-like pattern: fire and forget
    sendDiscordAlert(errorEntry);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    count: errorBuffer.length,
    errors: errorBuffer,
  });
}
