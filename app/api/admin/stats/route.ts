import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

// GET /api/admin/stats — marketplace statistics for admin dashboard
export async function GET(request: NextRequest) {
  const rl = rateLimit(request, RATE_LIMITS.read);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: rl.headers });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(c) { try { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {} },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
  }

  // Parallel counts
  const [agentsRes, usersRes, reviewsRes, pendingRes, featuredRes, verifiedRes] = await Promise.all([
    supabase.from('agents').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('reviews').select('*', { count: 'exact', head: true }),
    supabase.from('agents').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('agents').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    supabase.from('agents').select('*', { count: 'exact', head: true }).eq('is_verified', true),
  ]);

  // Category breakdown
  const { data: categoryStats } = await supabase
    .from('categories')
    .select('id, name, slug, agents(count)');

  return NextResponse.json({
    totalAgents: agentsRes.count || 0,
    totalUsers: usersRes.count || 0,
    totalReviews: reviewsRes.count || 0,
    pendingAgents: pendingRes.count || 0,
    featuredAgents: featuredRes.count || 0,
    verifiedAgents: verifiedRes.count || 0,
    categories: categoryStats || [],
  });
}
