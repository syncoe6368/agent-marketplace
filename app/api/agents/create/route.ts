import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Authenticate
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse body
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, slug, description, pricing_model, category_id,
    price_amount, currency, website_url, github_url, api_docs_url,
    logo_url, tags, long_description } = body;

  // Validate required fields
  if (!name || !description) {
    return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
  }

  // Generate slug
  let targetSlug = slug || name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from('agents')
    .select('id')
    .eq('slug', targetSlug)
    .single();

  if (existing) {
    return NextResponse.json({
      error: 'Slug already in use',
      suggestion: `${targetSlug}-${Math.floor(Math.random() * 9000)}`
    }, { status: 409 });
  }

  const { data: agent, error } = await supabase
    .from('agents')
    .insert({
      name,
      slug: targetSlug,
      description: description.trim(),
      long_description: long_description?.trim() || null,
      pricing_model: pricing_model || 'free',
      price_amount: price_amount || null,
      currency: currency || 'USD',
      category_id: category_id || null,
      website_url: website_url || null,
      github_url: github_url || null,
      api_docs_url: api_docs_url || null,
      logo_url: logo_url || null,
      tags: Array.isArray(tags) ? tags : [],
      creator_id: user.id,
      status: 'pending' // All new submissions start as pending
    })
    .select(`
      id, name, slug, description, pricing_model, status,
      created_at, category_id,
      categories ( name, slug )
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ agent }, { status: 201 });
}
