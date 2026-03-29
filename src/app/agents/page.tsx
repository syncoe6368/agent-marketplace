import type { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { AgentSearch } from '@/components/agents/agent-search';
import { AgentCard } from '@/components/agents/agent-card';

export const metadata: Metadata = {
  title: 'Browse Agents',
  description: 'Browse and discover AI agents across all categories. Filter by type, pricing, and ratings.',
};

interface AgentRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricing_model: string;
  price_amount: number | null;
  currency: string;
  logo_url: string | null;
  tags: string[] | null;
  is_featured: boolean;
  is_verified: boolean;
  status: string;
  views_count: number;
  created_at: string;
  category?: { id: string; name: string; slug: string } | null;
  creator?: { full_name: string | null; avatar_url: string | null } | null;
  reviews?: { rating: number }[];
}

export default async function AgentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; pricing?: string; sort?: string; page?: string }>;
}) {
  const params = await searchParams;
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

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  const categories = categoriesData || [];

  let query = supabase
    .from('agents')
    .select('*, category:categories(*), creator:profiles(full_name, avatar_url), reviews(rating)')
    .eq('status', 'active');

  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,description.ilike.%${params.q}%`);
  }
  if (params.category && params.category !== 'all') {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.category)
      .single();
    if (cat) query = query.eq('category_id', cat.id);
  }
  if (params.pricing && params.pricing !== 'all') {
    query = query.eq('pricing_model', params.pricing);
  }

  switch (params.sort) {
    case 'top_rated':
      query = query.order('created_at', { ascending: false });
      break;
    case 'most_viewed':
      query = query.order('views_count', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const page = parseInt(params.page || '1');
  const perPage = 12;
  query = query.range((page - 1) * perPage, page * perPage - 1);

  const { data: rawAgents } = await query;
  const agents = ((rawAgents || []) as AgentRow[]).map((agent) => {
    const reviews = (agent.reviews || []) as { rating: number }[];
    const ratings = reviews.map((r) => r.rating);
    const average_rating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    const { reviews: _reviews, ...agentData } = agent;
    return { ...agentData, average_rating, review_count: ratings.length };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Agents</h1>
        <p className="text-muted-foreground">
          Discover AI agents for every use case
        </p>
      </div>

      <div className="mb-6">
        <AgentSearch
          categories={categories}
          initialSearch={params.q}
          initialCategory={params.category}
          initialPricing={params.pricing}
          initialSort={params.sort}
        />
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground mb-2">No agents found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
          {agents.length === perPage && (
            <div className="text-center mt-8">
              <a
                href={`/agents?q=${params.q || ''}&category=${params.category || 'all'}&pricing=${params.pricing || 'all'}&sort=${params.sort || 'newest'}&page=${page + 1}`}
                className="text-indigo-600 hover:underline"
              >
                Load more agents →
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
