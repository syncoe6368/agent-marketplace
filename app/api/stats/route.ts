import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cache for 60 seconds
let cached: { data: Record<string, string | number>; ts: number } | null = null;
const TTL = 60_000;

export async function GET() {
  if (cached && Date.now() - cached.ts < TTL) {
    return NextResponse.json({ status: 'ok', ...cached.data, cached: true });
  }

  const [agentsRes, categoriesRes, reviewsRes, featuredRes, freeRes] = await Promise.all([
    supabase.from('agents').select('id, status, pricing_model', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase.from('reviews').select('id', { count: 'exact', head: true }),
    supabase.from('agents').select('id', { count: 'exact', head: true }).eq('is_featured', true).eq('status', 'active'),
    supabase.from('agents').select('id', { count: 'exact', head: true }).eq('pricing_model', 'free').eq('status', 'active'),
  ]);

  // Active agents breakdown by pricing model
  const [freeRes2, paidRes, freemiumRes, subRes] = await Promise.all([
    supabase.from('agents').select('id', { count: 'exact', head: true }).eq('pricing_model', 'free').eq('status', 'active'),
    supabase.from('agents').select('id', { count: 'exact', head: true }).eq('pricing_model', 'paid').eq('status', 'active'),
    supabase.from('agents').select('id', { count: 'exact', head: true }).eq('pricing_model', 'freemium').eq('status', 'active'),
    supabase.from('agents').select('id', { count: 'exact', head: true }).eq('pricing_model', 'subscription').eq('status', 'active'),
  ]);

  const data = {
    total_agents: agentsRes.count || 0,
    active_agents: agentsRes.count || 0, // all are active after filter
    total_categories: categoriesRes.count || 0,
    total_reviews: reviewsRes.count || 0,
    featured_agents: featuredRes.count || 0,
    free_agents: freeRes2.count || 0,
    paid_agents: paidRes.count || 0,
    freemium_agents: freemiumRes.count || 0,
    subscription_agents: subRes.count || 0,
    updated_at: new Date().toISOString(),
  };

  cached = { data, ts: Date.now() };

  return NextResponse.json({ status: 'ok', ...data, cached: false });
}
