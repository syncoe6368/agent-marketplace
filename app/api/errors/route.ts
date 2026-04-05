import { NextRequest, NextResponse } from 'next/server';

const errorBuffer: Array<{
  id: string;
  message: string;
  stack?: string;
  url: string;
  userAgent?: string;
  timestamp: string;
  digest?: string;
  type: 'caught' | 'uncaught';
}> = [];

const MAX_BUFFER = 100;
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 5 * 60 * 1000;

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function getRateLimitKey(digest: string | undefined, url: string): string {
  return `${digest || 'none'}:${url}`;
}

async function sendDiscordAlert(error: typeof errorBuffer[0]) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const color = error.type === 'caught' ? 0xffcc00 : 0xff4444;
  const emoji = error.type === 'caught' ? '🟡' : '🔴';
  
  const embed = {
    embeds: [{
      title: `${emoji} ${error.type === 'caught' ? 'Caught Error' : 'Uncaught Error'} on AgentHub`,
      color,
      fields: [
        { name: 'URL', value: error.url.slice(0, 500), inline: false },
        { name: 'Message', value: error.message.slice(0, 1000), inline: false },
        ...(error.digest ? [{ name: 'Digest', value: error.digest, inline: true }] : []),
        { name: 'Time', value: error.timestamp, inline: true },
      ],
      ...(error.stack ? { 
        description: `\`\`\`\n${error.stack.slice(0, 1500)}\n\`\`\`` 
      } : {}),
      footer: { text: `User Agent: ${error.userAgent?.slice(0, 200) || 'unknown'}` },
    }]
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed),
    });
  } catch (e) {
    console.error('Failed to send Discord alert:', e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, stack, url, userAgent, digest, type } = body;
    
    const errorType: 'caught' | 'uncaught' = type === 'caught' ? 'caught' : 'uncaught';
    
    const errorEntry = {
      id: generateId(),
      message: message || 'Unknown error',
      stack,
      url: url || '/',
      userAgent,
      timestamp: new Date().toISOString(),
      digest,
      type: errorType,
    };

    errorBuffer.unshift(errorEntry);
    if (errorBuffer.length > MAX_BUFFER) errorBuffer.pop();

    const rateKey = getRateLimitKey(digest, url);
    const lastAlert = rateLimitMap.get(rateKey);
    const now = Date.now();
    
    if (!lastAlert || (now - lastAlert) > RATE_LIMIT_MS) {
      rateLimitMap.set(rateKey, now);
      sendDiscordAlert(errorEntry).catch(console.error);
    }

    return NextResponse.json({ success: true, id: errorEntry.id });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ errors: errorBuffer.slice(0, 50) });
}
