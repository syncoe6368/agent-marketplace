import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sanitizeSearchQuery } from '@/lib/utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// In-memory cache for suggestions
const cache = new Map<string, { data: unknown[]; ts: number }>();
const CACHE_TTL = 30_000; // 30s

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';
  const limit = Math.min(parseInt(searchParams.get('limit') || '8', 10), 20);

  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const sanitized = sanitizeSearchQuery(q);
  if (!sanitized) {
    return NextResponse.json({ suggestions: [] });
  }

  // Check cache
  const cacheKey = `${sanitized}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json({ suggestions: cached.data });
  }

  // Search agents
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name, slug, description, pricing_model, category:categories(name, slug)')
    .eq('status', 'active')
    .or(`name.ilike.%${sanitized}%,description.ilike.%${sanitized}%`)
    .order('views_count', { ascending: false })
    .limit(limit);

  // Search categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .or(`name.ilike.%${sanitized}%,description.ilike.%${sanitized}%`)
    .limit(3);

  const suggestions: Array<{
    type: 'agent' | 'category';
    id: string;
    name: string;
    slug: string;
    description: string | null;
    meta?: string;
  }> = [];

  if (agents) {
    for (const agent of agents) {
      const cat = (agent as Record<string, unknown>).category as { name: string } | null;
      suggestions.push({
        type: 'agent',
        id: agent.id,
        name: agent.name,
        slug: agent.slug,
        description: agent.description?.slice(0, 120) || null,
        meta: cat?.name || agent.pricing_model,
      });
    }
  }

  if (categories) {
    for (const cat of categories) {
      suggestions.push({
        type: 'category',
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      });
    }
  }

  // Store in cache
  cache.set(cacheKey, { data: suggestions, ts: Date.now() });

  // Prune cache periodically
  if (cache.size > 200) {
    const now = Date.now();
    for (const [key, val] of cache.entries()) {
      if (now - val.ts > CACHE_TTL * 2) cache.delete(key);
    }
  }

  return NextResponse.json({
    suggestions,
    query: q,
    count: suggestions.length,
  });
}
