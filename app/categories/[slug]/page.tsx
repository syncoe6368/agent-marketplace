import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { AgentCard } from '@/components/agents/agent-card';

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
  category?: { id: string; name: string; slug: string } | null;
  reviews?: { rating: number }[];
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
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
  const { data } = await supabase.from('categories').select('name, description').eq('slug', slug).single();
  if (!data) return { title: 'Category Not Found' };
  return { title: (data as { name: string }).name, description: (data as { description: string | null }).description || undefined };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
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

  const { data: categoryData } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  const category = categoryData as { id: string; name: string; description: string | null } | null;
  if (!category) notFound();

  const { data: agentsData } = await supabase
    .from('agents')
    .select('*, category:categories(*), reviews(rating)')
    .eq('status', 'active')
    .eq('category_id', category.id)
    .order('views_count', { ascending: false });

  const agents = ((agentsData || []) as AgentRow[]).map((agent) => {
    const reviews = (agent.reviews || []) as { rating: number }[];
    const ratings = reviews.map((r) => r.rating);
    const average_rating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    const { reviews: _reviews, ...agentData } = agent;
    return { ...agentData, average_rating, review_count: ratings.length };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground">{category.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          {agents.length} agent{agents.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground mb-2">No agents in this category yet</p>
          <p className="text-sm text-muted-foreground">
            Be the first to <a href="/submit" className="text-indigo-600 hover:underline">list an agent</a> in {category.name}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}
