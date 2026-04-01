import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: agent, error } = await supabase
    .from('agents')
    .select(`
      *,
      categories ( id, name, slug, icon, description ),
      profiles ( id, full_name, avatar_url, bio ),
      reviews ( id, rating, comment, user_id, created_at )
    `)
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  // Increment views (non-blocking)
  supabase
    .from('agents')
    .update({ views_count: (agent.views_count ?? 0) + 1 })
    .eq('id', id)
    .throwOnError()
    .then(() => {})
    .catch(() => {});

  return NextResponse.json({ agent });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { id } = params;

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from('agents')
    .select('creator_id, status')
    .eq('id', id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }
  if (existing.creator_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { name, slug, description, pricing_model, price_amount } = body;

  // Update slug if name changes and slug not provided
  const updatePayload: Record<string, any> = { ...body };
  if (name && !slug) {
    const { data: slugData } = await supabase.rpc('generate_unique_slug', { p_name: name });
    if (slugData) updatePayload.slug = slugData;
  }

  const { data: updated, error } = await supabase
    .from('agents')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ agent: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { id } = params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase.from('agents').delete().eq('creator_id', user.id).eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
