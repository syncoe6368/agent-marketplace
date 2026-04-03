import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { MyReviewsContent } from './reviews-content';

export const metadata: Metadata = {
  title: 'My Agent Reviews — AgentHub',
  description: 'View reviews on your listed agents.',
};

export const dynamic = 'force-dynamic';

interface ReviewRow {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  agent_id: string;
  agent_name: string;
  agent_slug: string;
  reviewer_name: string | null;
  reviewer_avatar: string | null;
}

export default async function MyReviewsPage() {
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
  if (!user) redirect('/auth/login?redirect=/dashboard/reviews');

  // Get all reviews on this creator's agents
  const { data: myAgents } = await supabase
    .from('agents')
    .select('id, name, slug')
    .eq('creator_id', user.id);

  const agentIds = (myAgents || []).map((a) => a.id);

  if (agentIds.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">My Agent Reviews</h1>
        <p className="text-muted-foreground">No agents listed yet. List an agent to start receiving reviews.</p>
      </div>
    );
  }

  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, agent_id, profiles(full_name, avatar_url)')
    .in('agent_id', agentIds)
    .order('created_at', { ascending: false });

  // Map agent names
  const agentMap = new Map((myAgents || []).map((a) => [a.id, a]));
  const enrichedReviews: ReviewRow[] = (reviews || []).map((r) => {
    const agent = agentMap.get(r.agent_id);
    return {
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
      agent_id: r.agent_id,
      agent_name: agent?.name || 'Unknown',
      agent_slug: agent?.slug || '',
      reviewer_name: (Array.isArray(r.profiles) ? r.profiles[0]?.full_name : (r.profiles as Record<string, unknown>)?.full_name) as string | null || 'Anonymous',
      reviewer_avatar: (Array.isArray(r.profiles) ? r.profiles[0]?.avatar_url : (r.profiles as Record<string, unknown>)?.avatar_url) as string | null || null,
    };
  });

  // Compute per-agent stats
  const agentStats = new Map<string, { name: string; slug: string; count: number; avg: number }>();
  for (const rev of enrichedReviews) {
    const stat = agentStats.get(rev.agent_id) || { name: rev.agent_name, slug: rev.agent_slug, count: 0, avg: 0 };
    stat.count++;
    stat.avg = stat.avg + (rev.rating - stat.avg) / stat.count; // running avg
    agentStats.set(rev.agent_id, stat);
  }

  return (
    <MyReviewsContent
      reviews={enrichedReviews}
      agentStats={Array.from(agentStats.values())}
    />
  );
}
