import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/supabase/database.types';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Parse query params
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q')?.trim();
  const category = searchParams.get('category');
  const pricingModel = searchParams.get('pricingModel');
  const isFeatured = searchParams.get('featured') === 'true';
  const sortBy = searchParams.get('sort') || 'newest'; // newest, top_rated, popular
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
  const offset = parseInt(searchParams.get('offset') || '0');

  // Build query for agents
  let query = supabase
    .from('agents')
    .select(`
      id,
      name,
      slug,
      description,
      pricing_model,
      price_amount,
      currency,
      website_url,
      github_url,
      api_docs_url,
      logo_url,
      tags,
      is_featured,
      is_verified,
      status,
      views_count,
      created_at,
      updated_at,
      category_id,
      categories ( id, name, slug, icon, description ),
      profiles ( id, full_name, avatar_url, bio )
    `)
    .eq('status', 'active');

  // Filter by category
  if (category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', category).single();
    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }

  // Filter by pricing model
  if (pricingModel) {
    query = query.eq('pricing_model', pricingModel);
  }

  // Featured filter
  if (isFeatured) {
    query = query.eq('is_featured', true);
  }

  // Full-text search
  if (q) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,tags.cs.{${q}}`);
  }

  // Sorting
  switch (sortBy) {
    case 'top_rated':
      // Complex: need to join reviews and compute avg. For now, fallback to created_at
      query = query.order('created_at', { ascending: false });
      break;
    case 'popular':
      query = query.order('views_count', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  // Pagination
  query = query.range(offset, offset + limit - 1);

  const { data: agents, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    agents: agents ?? [],
    total: count ?? 0,
    limit,
    offset,
  });
}

import { writeFile } from 'fs/promises';
import { join } from 'path';

// Internal helper used by memory-capture cron to log agent count
export async function POST() {
  // This endpoint is also used to capture metrics for cron logs
  const supabase = await createClient();
  const { count } = await supabase.from('agents').select('*', { count: 'exact', head: true });
  const metrics = { timestamp: new Date().toISOString(), agent_count: count ?? 0 };

  // Append to agent_marketplace/memory/agents_log.jsonl
  try {
    const logPath = join(process.cwd(), 'memory', 'agents_log.jsonl');
    await writeFile(logPath, JSON.stringify(metrics) + '\n', { flag: 'a' });
  } catch {
    // ignore fs errors
  }

  return NextResponse.json(metrics);
}
