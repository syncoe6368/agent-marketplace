import type { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturedAgents } from '@/components/landing/featured-agents';
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

  const agents = (agentsData || []) as AgentRow[];
  const categories = ((categoriesData || []) as CategoryRow[]).map((cat) => ({
    ...cat,
    agent_count: (cat.agents as unknown as { count: number }[])?.[0]?.count || 0,
  }));

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
      <FeaturedAgents agents={agents} />
      <CategoriesGrid categories={categories} />
      <HowItWorks />
    </>
  );
}
