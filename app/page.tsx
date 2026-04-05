import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturedAgents } from '@/components/landing/featured-agents';
import { TrendingAgents } from '@/components/landing/trending-agents';
import { CategoriesGrid } from '@/components/landing/categories-grid';
import { HowItWorks } from '@/components/landing/how-it-works';

export const metadata: Metadata = {
  title: 'AgentHub — Discover & Deploy AI Agents',
  description: 'The #1 marketplace for AI agents. Browse, compare, and deploy verified AI agents for automation, research, customer support, and more.',
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

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  agents?: { count: number }[];
}

export default async function HomePage() {
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

  const { data: agentsData } = await supabase
    .from('agents')
    .select('*, category:categories(*), creator:profiles(full_name, avatar_url), reviews(rating)')
    .eq('status', 'active')
    .eq('is_featured', true)
    .order('views_count', { ascending: false })
    .limit(6);

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*, agents(count)')
    .order('name');

  // Fetch trending agents (top 5 by views_count)
  const { data: trendingData } = await supabase
    .from('agents')
    .select('*, category:categories(id, name, slug)')
    .eq('status', 'active')
    .order('views_count', { ascending: false })
    .limit(5);

  const agents = (agentsData || []) as AgentRow[];
  const categories = ((categoriesData || []) as CategoryRow[]).map((cat) => ({
    ...cat,
    agent_count: (cat.agents as unknown as { count: number }[])?.[0]?.count || 0,
  }));
  const trendingAgents = (trendingData || []) as AgentRow[];

  // Fetch stats for hero section
  const { count: totalAgents } = await supabase
    .from('agents')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  const { data: allReviews } = await supabase
    .from('reviews')
    .select('rating');

  const reviews = (allReviews || []) as { rating: number }[];
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  return (
    <>
      <HeroSection totalAgents={totalAgents || 0} totalReviews={totalReviews} avgRating={avgRating} />
      <TrendingAgents agents={trendingAgents} />
      <FeaturedAgents agents={agents} />
      <CategoriesGrid categories={categories} />
      <HowItWorks />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 md:p-12 text-center text-white max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Built an AI Agent? Share it with the world.</h2>
            <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
              Join our growing community of agent creators. Get discovered, collect reviews, and grow your user base.
            </p>
            <Link href="/submit">
              <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-indigo-50 text-base px-8">
                List Your Agent — It&apos;s Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
