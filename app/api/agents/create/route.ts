import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  sanitizePlainText,
  sanitizeRichText,
  sanitizeUrl,
  sanitizeTags,
  sanitizeSlug,
  sanitizePricingModel,
  sanitizeSearchQuery,
  sanitizeInt,
  FIELD_LIMITS,
} from '@/lib/sanitize';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limit agent creation
  const rl = rateLimit(request, RATE_LIMITS.write);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: rl.headers });
  }

  const supabase = await createClient();

  // Authenticate
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    name: rawName,
    slug: rawSlug,
    description: rawDescription,
    long_description: rawLongDescription,
    pricing_model: rawPricingModel,
    category_id: rawCategoryId,
    price_amount: rawPriceAmount,
    currency: rawCurrency,
    website_url: rawWebsiteUrl,
    github_url: rawGithubUrl,
    api_docs_url: rawApiDocsUrl,
    logo_url: rawLogoUrl,
    tags: rawTags,
  } = body;

  // ─── Input Sanitization ──────────────────────────────────────
  const name = sanitizePlainText(rawName, FIELD_LIMITS.agentName);
  const description = sanitizePlainText(rawDescription, FIELD_LIMITS.agentDescription);

  if (!name || !description) {
    return NextResponse.json(
      { error: 'Name and description are required' },
      { status: 400 }
    );
  }

  const longDescription = rawLongDescription
    ? sanitizeRichText(rawLongDescription, FIELD_LIMITS.agentLongDescription)
    : null;
  const pricingModel = sanitizePricingModel(rawPricingModel);
  const tags = sanitizeTags(rawTags);

  // Validate slug
  let targetSlug: string;
  if (rawSlug) {
    const cleaned = sanitizeSlug(rawSlug);
    if (!cleaned) {
      return NextResponse.json(
        { error: 'Invalid slug format. Use lowercase letters, numbers, and hyphens.' },
        { status: 400 }
      );
    }
    targetSlug = cleaned;
  } else {
    const autoSlug = sanitizeSlug(name);
    if (!autoSlug) {
      return NextResponse.json(
        { error: 'Could not generate slug from name.' },
        { status: 400 }
      );
    }
    targetSlug = autoSlug;
  }

  // Validate URLs
  const websiteUrl = sanitizeUrl(rawWebsiteUrl);
  const githubUrl = sanitizeUrl(rawGithubUrl);
  const apiDocsUrl = sanitizeUrl(rawApiDocsUrl);
  const logoUrl = sanitizeUrl(rawLogoUrl);

  // Validate price
  const priceAmount =
    rawPriceAmount != null ? parseFloat(rawPriceAmount) : null;
  if (priceAmount !== null && (Number.isNaN(priceAmount) || priceAmount < 0 || priceAmount > 999999)) {
    return NextResponse.json(
      { error: 'Invalid price_amount' },
      { status: 400 }
    );
  }

  // Validate currency
  const currency = typeof rawCurrency === 'string' && rawCurrency.length === 3
    ? rawCurrency.toUpperCase().replace(/[^A-Z]/g, '')
    : 'USD';

  // Validate category_id as UUID
  const categoryId = rawCategoryId || null;

  // ─── Check slug uniqueness ──────────────────────────────────
  const { data: existing } = await supabase
    .from('agents')
    .select('id')
    .eq('slug', targetSlug)
    .single();

  if (existing) {
    return NextResponse.json(
      {
        error: 'Slug already in use',
        suggestion: `${targetSlug}-${Math.floor(Math.random() * 9000)}`,
      },
      { status: 409 }
    );
  }

  // ─── Insert ──────────────────────────────────────────────────
  const { data: agent, error } = await supabase
    .from('agents')
    .insert({
      name,
      slug: targetSlug,
      description,
      long_description: longDescription,
      pricing_model: pricingModel,
      price_amount: priceAmount,
      currency,
      category_id: categoryId,
      website_url: websiteUrl,
      github_url: githubUrl,
      api_docs_url: apiDocsUrl,
      logo_url: logoUrl,
      tags,
      creator_id: user.id,
      status: 'pending', // All new submissions start as pending
    })
    .select(
      `
      id, name, slug, description, pricing_model, status,
      created_at, category_id,
      categories ( name, slug )
    `
    )
    .single();

  if (error) {
    console.error('Agent create error:', error);
    return NextResponse.json({ error: 'Failed to create agent listing' }, { status: 500 });
  }

  return NextResponse.json({ agent }, { status: 201 });
}
