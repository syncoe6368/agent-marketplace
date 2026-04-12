import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidUuid, sanitizePlainText, sanitizeUrl, sanitizeTags, sanitizePricingModel, sanitizeRichText, FIELD_LIMITS } from '@/lib/sanitize';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Validate UUID
  if (!id || !isValidUuid(id)) {
    return NextResponse.json({ error: 'Valid agent ID is required' }, { status: 400 });
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
    return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 });
  }

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  // Increment views (fire-and-forget)
  const currentViews = agent.views_count ?? 0;
  void supabase
    .from('agents')
    .update({ views_count: currentViews + 1 })
    .eq('id', id)
    .then(() => {});

  return NextResponse.json({ agent });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  // Validate UUID
  if (!id || !isValidUuid(id)) {
    return NextResponse.json({ error: 'Valid agent ID is required' }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // ─── Sanitize updatable fields ───────────────────────────────
  const b = body as Record<string, unknown>;
  const updatePayload: Record<string, unknown> = {};

  if (b.name !== undefined) {
    updatePayload.name = sanitizePlainText(b.name as string, FIELD_LIMITS.agentName);
  }
  if (b.description !== undefined) {
    updatePayload.description = sanitizePlainText(b.description as string, FIELD_LIMITS.agentDescription);
  }
  if (b.long_description !== undefined) {
    updatePayload.long_description = sanitizeRichText(b.long_description as string, FIELD_LIMITS.agentLongDescription);
  }
  if (b.pricing_model !== undefined) {
    updatePayload.pricing_model = sanitizePricingModel(b.pricing_model);
  }
  if (b.tags !== undefined) {
    updatePayload.tags = sanitizeTags(b.tags);
  }
  if (b.website_url !== undefined) {
    updatePayload.website_url = sanitizeUrl(b.website_url as string | null);
  }
  if (b.github_url !== undefined) {
    updatePayload.github_url = sanitizeUrl(b.github_url as string | null);
  }
  if (b.api_docs_url !== undefined) {
    updatePayload.api_docs_url = sanitizeUrl(b.api_docs_url as string | null);
  }
  if (b.logo_url !== undefined) {
    updatePayload.logo_url = sanitizeUrl(b.logo_url as string | null);
  }
  // Block direct updates to protected fields
  delete updatePayload.creator_id;
  delete updatePayload.id;
  delete updatePayload.status;
  delete updatePayload.is_featured;
  delete updatePayload.is_verified;
  delete updatePayload.views_count;
  delete updatePayload.created_at;
  delete updatePayload.updated_at;

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const { data: updated, error } = await supabase
    .from('agents')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Agent update error:', error);
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
  }

  return NextResponse.json({ agent: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  // Validate UUID
  if (!id || !isValidUuid(id)) {
    return NextResponse.json({ error: 'Valid agent ID is required' }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase.from('agents').delete().eq('creator_id', user.id).eq('id', id);

  if (error) {
    console.error('Agent delete error:', error);
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
