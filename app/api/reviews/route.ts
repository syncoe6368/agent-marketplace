import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;
  const agentId = searchParams.get('agentId');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
  const offset = parseInt(searchParams.get('offset') || '0');

  if (!agentId) {
    return NextResponse.json({ error: 'agentId query parameter is required' }, { status: 400 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    reviews: reviews ?? [],
    total: count ?? 0,
    limit,
    offset,
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { agent_id, rating, comment } = body;

  if (!agent_id || !rating) {
    return NextResponse.json({ error: 'agent_id and rating are required' }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'rating must be between 1 and 5' }, { status: 400 });
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
      .update({ rating, comment })
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ review: updated });
  } else {
    // Insert new review
    const { data: inserted, error } = await supabase
      .from('reviews')
      .insert({ agent_id, user_id: user.id, rating, comment })
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ review: inserted }, { status: 201 });
  }
}
