import type { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturedAgents } from '@/components/landing/featured-agents';
import { TrendingAgents } from '@/components/landing/trending-agents';
import { CategoriesGrid } from '@/components/landing/categories-grid';
import { HowItWorks } from '@/components/landing/how-it-works';
import { CallToAction } from '@/components/landing/call-to-action';
import { TestimonialsSection } from '@/components/landing/testimonials';
import { SkillPackagesPreview } from '@/components/landing/skill-packages-preview';
import { RecentlyAdded } from '@/components/landing/recently-added';

// Revalidate every 60 seconds — serves cached page, regenerates in background
export const revalidate = 60;

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

  // Fetch all active agents in one query (covers featured + trending + stats)
  const { data: allAgentsData, count: totalAgents } = await supabase
    .from('agents')
    .select('*, category:categories(*), creator:profiles(full_name, avatar_url), reviews(rating)', { count: 'exact' })
    .eq('status', 'active')
    .order('views_count', { ascending: false });

  const allAgents = (allAgentsData || []) as AgentRow[];

  // Derived: featured (max 6)
  const agents = allAgents.filter(a => a.is_featured).slice(0, 6);

  // Derived: trending (top 5 by views)
  const trendingAgents = allAgents.slice(0, 5);

  // Derived: recently added (newest 4)
  const recentAgents = [...allAgents].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 4);

  // Compute stats from already-fetched data (no extra DB round-trip)
  const totalReviews = allAgents.reduce((sum, a) => sum + (a.reviews?.length || 0), 0);
  const allRatings = allAgents.flatMap(a => (a.reviews || []).map((r: { rating: number }) => r.rating));
  const avgRating = allRatings.length > 0
    ? allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
    : 0;

  // Top reviews for testimonials (rated 5, limit 6)
  const { data: topReviewsData } = await supabase
    .from('reviews')
    .select('rating, comment, user:profiles(full_name), agent:agents(name, slug)')
    .eq('rating', 5)
    .not('comment', 'is', null)
    .limit(6);

  const testimonials = (topReviewsData || []).map((r: { rating: number; comment: string | null; user: { full_name: string | null }[]; agent: { name: string | null; slug: string | null }[] }) => ({
    user_name: r.user?.[0]?.full_name || 'Anonymous',
    rating: r.rating,
    comment: r.comment || '',
    agent_name: r.agent?.[0]?.name || 'Unknown',
    agent_slug: r.agent?.[0]?.slug || '',
  }));

  // Categories (separate query — different table)
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*, agents(count)')
    .order('name');

  const categories = ((categoriesData || []) as CategoryRow[]).map((cat) => ({
    ...cat,
    agent_count: (cat.agents as unknown as { count: number }[])?.[0]?.count || 0,
  }));

  return (
    <>
      <HeroSection totalAgents={totalAgents || 0} totalReviews={totalReviews} avgRating={avgRating} />
      <TrendingAgents agents={trendingAgents} />
      <FeaturedAgents agents={agents} />
      <CategoriesGrid categories={categories} />
      <RecentlyAdded agents={recentAgents} />
      <TestimonialsSection testimonials={testimonials} />
      <SkillPackagesPreview />
      <HowItWorks />
      <CallToAction />
    </>
  );
}
