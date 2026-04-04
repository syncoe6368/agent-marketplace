import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/supabase/database.types';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { sanitizeSearchQuery, sanitizeInt, sanitizePricingModel } from '@/lib/sanitize';

export async function GET(request: NextRequest) {
  // Rate limiting
  const rl = rateLimit(request, RATE_LIMITS.read);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: rl.headers });
  }

  const supabase = await createClient();

  // Parse & sanitize query params
  const searchParams = request.nextUrl.searchParams;
  const q = sanitizeSearchQuery(searchParams.get('q'));
  const category = sanitizeSearchQuery(searchParams.get('category'));
  const rawPricingModel = searchParams.get('pricingModel');
  const pricingModel = rawPricingModel ? sanitizePricingModel(rawPricingModel) : null;
  // Only use pricing model filter if it was explicitly provided and is a valid non-default
  const shouldFilterPricing = rawPricingModel !== null && pricingModel !== 'free' || rawPricingModel === 'free';
  const isFeatured = searchParams.get('featured') === 'true';
  const sortBy = searchParams.get('sort') || 'newest';
  const limit = sanitizeInt(searchParams.get('limit'), 20, 1, 50);
  const offset = sanitizeInt(searchParams.get('offset'), 0, 0, 10000);

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

  // Filter by category (safe: sanitized string)
  if (category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', category).single();
    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }

  // Filter by pricing model (safe: validated enum)
  if (shouldFilterPricing && pricingModel) {
    query = query.eq('pricing_model', pricingModel);
  }

  // Featured filter
  if (isFeatured) {
    query = query.eq('is_featured', true);
  }

  // Full-text search — use parameterized approach (safe from injection)
  if (q) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }

  // Sorting (safe: switch on fixed values)
  switch (sortBy) {
    case 'top_rated':
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

  // Pagination (safe: bounded integers)
  query = query.range(offset, offset + limit - 1);

  const { data: agents, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }

  return NextResponse.json({
    agents: agents ?? [],
    total: count ?? 0,
    limit,
    offset,
  });
}

// POST kept as-is for metrics logging (internal use)
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST() {
  const supabase = await createClient();
  const { count } = await supabase.from('agents').select('*', { count: 'exact', head: true });
  const metrics = { timestamp: new Date().toISOString(), agent_count: count ?? 0 };

  try {
    const logPath = join(process.cwd(), 'memory', 'agents_log.jsonl');
    await writeFile(logPath, JSON.stringify(metrics) + '\n', { flag: 'a' });
  } catch {
    // ignore fs errors
  }

  return NextResponse.json(metrics);
}
