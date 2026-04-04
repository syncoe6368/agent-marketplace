import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// POST /api/cron/weekly-views
// Resets weekly_views counter and archives last week's data
// Call this weekly (e.g., Monday 00:00 UTC) via Vercel Cron
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Use service role or anon key with admin rights
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: { getAll: () => [], setAll: () => {} },
      }
    );

    // Archive current weekly_views to last_week_views before reset
    const { error: archiveError } = await supabase.rpc('archive_weekly_views');
    
    if (archiveError) {
      // Fallback: just reset weekly_views to 0 if RPC doesn't exist
      const { error: resetError } = await supabase
        .from('agents')
        .update({ weekly_views: 0 })
        .not('weekly_views', 'is', null);

      if (resetError) {
        return NextResponse.json({ 
          error: 'Failed to reset weekly views',
          details: resetError.message,
        }, { status: 500 });
      }
    }

    // Get count of affected agents
    const { count } = await supabase
      .from('agents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    return NextResponse.json({
      success: true,
      message: 'Weekly views reset complete',
      affected_agents: count || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({
      error: 'Internal server error',
      details: err instanceof Error ? err.message : 'Unknown error',
    }, { status: 500 });
  }
}
