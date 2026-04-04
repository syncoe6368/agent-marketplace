import { NextResponse } from 'next/server';

// Health check endpoint for uptime monitoring
// GET /api/health — returns system status, DB connectivity, and basic stats

export const dynamic = 'force-dynamic';

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: { status: string; latency_ms: number; agent_count: number; category_count: number };
    api: { status: string };
  };
}

export async function GET() {
  const startTime = performance.now();
  const version = process.env.npm_package_version || '0.1.0';

  let dbStatus = 'healthy';
  let dbLatency = 0;
  let agentCount = 0;
  let categoryCount = 0;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      dbStatus = 'unhealthy';
    } else {
      // Check DB connectivity by querying categories (small table, fast)
      const dbStart = performance.now();

      const [catRes, agentRes] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/categories?select=id&limit=0`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: 'count=exact',
          },
        }),
        fetch(`${supabaseUrl}/rest/v1/agents?select=id&status=eq.active&limit=0`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: 'count=exact',
          },
        }),
      ]);

      dbLatency = Math.round(performance.now() - dbStart);

      if (!catRes.ok || !agentRes.ok) {
        dbStatus = 'degraded';
      } else {
        // Get total category count from Content-Range header
        const catContentRange = catRes.headers.get('content-range');
        if (catContentRange) {
          const catTotal = catContentRange.split('/')[1];
          if (catTotal) categoryCount = parseInt(catTotal, 10);
        } else {
          const catData = await catRes.json();
          categoryCount = Array.isArray(catData) ? catData.length : 0;
        }

        // Get total active agents count
        const agentData = await agentRes.json();
        agentCount = Array.isArray(agentData) ? agentData.length : 0;

        // Also get total count from Content-Range header
        const contentRange = agentRes.headers.get('content-range');
        if (contentRange) {
          const total = contentRange.split('/')[1];
          if (total) agentCount = parseInt(total, 10);
        }
      }
    }
  } catch {
    dbStatus = 'unhealthy';
    dbLatency = Math.round(performance.now() - startTime);
  }

  const totalLatency = Math.round(performance.now() - startTime);
  const overallStatus: HealthCheck['status'] =
    dbStatus === 'unhealthy' ? 'unhealthy' :
    dbStatus === 'degraded' ? 'degraded' : 'healthy';

  const response: HealthCheck = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version,
    uptime: process.uptime ? Math.floor(process.uptime()) : 0,
    checks: {
      database: {
        status: dbStatus,
        latency_ms: dbLatency,
        agent_count: agentCount,
        category_count: categoryCount,
      },
      api: {
        status: 'healthy',
      },
    },
  };

  const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;

  return NextResponse.json(response, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
