import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { sanitizeRichText, sanitizeInt, isValidUuid, FIELD_LIMITS } from '@/lib/sanitize';
import { logApiError } from '@/lib/sentry';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;
  const agentId = searchParams.get('agentId');
  const limit = sanitizeInt(searchParams.get('limit'), 20, 1, 50);
  const offset = sanitizeInt(searchParams.get('offset'), 0, 0, 10000);

  if (!agentId || !isValidUuid(agentId)) {
    return NextResponse.json({ error: 'Valid agentId query parameter is required' }, { status: 400 });
  }

  let query = supabase
    .from('reviews')
    .select(`
      id,
      agent_id,
      user_id,
      rating,
      comment,
      created_at,
      profiles ( full_name, avatar_url )
    `)
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false });

  query = query.range(offset, offset + limit - 1);

  const { data: reviews, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }

  return NextResponse.json({
    reviews: reviews ?? [],
    total: count ?? 0,
    limit,
    offset,
  });
}

export async function POST(request: NextRequest) {
  // Rate limit review submissions
  const rl = rateLimit(request, RATE_LIMITS.write);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: rl.headers });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { agent_id, rating, comment } = body as { agent_id?: string; rating?: number; comment?: string };

  // ─── Input Validation ────────────────────────────────────────
  if (!agent_id || !isValidUuid(agent_id)) {
    return NextResponse.json({ error: 'Valid agent_id is required' }, { status: 400 });
  }
  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'rating must be an integer between 1 and 5' }, { status: 400 });
  }

  // Sanitize comment
  const sanitizedComment = comment
    ? sanitizeRichText(String(comment), FIELD_LIMITS.reviewComment)
    : null;

  // Verify agent exists
  const { data: agentExists } = await supabase
    .from('agents')
    .select('id')
    .eq('id', agent_id)
    .single();

  if (!agentExists) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  const { data: existing } = await supabase
    .from('reviews')
    .select('id, rating, comment')
    .eq('agent_id', agent_id)
    .eq('user_id', user.id)
    .single();

  if (existing) {
    // Update existing review
    const { data: updated, error } = await supabase
      .from('reviews')
      .update({ rating, comment: sanitizedComment })
      .eq('id', existing.id)
      .select(`
        id,
        agent_id,
        user_id,
        rating,
        comment,
        created_at,
        profiles ( full_name, avatar_url )
      `)
      .single();

    if (error) {
      logApiError(request, error, { action: 'update', review_id: existing.id });
      return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
    return NextResponse.json({ review: updated });
  } else {
    // Insert new review
    const { data: inserted, error } = await supabase
      .from('reviews')
      .insert({ agent_id, user_id: user.id, rating, comment: sanitizedComment })
      .select(`
        id,
        agent_id,
        user_id,
        rating,
        comment,
        created_at,
        profiles ( full_name, avatar_url )
      `)
      .single();

    if (error) {
      logApiError(request, error, { action: 'insert', agent_id });
      return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
    return NextResponse.json({ review: inserted }, { status: 201 });
  }
}
