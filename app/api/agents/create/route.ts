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
import { logApiError } from '@/lib/sentry';

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
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const b = body as Partial<Record<string, unknown>>;
  const rawName = b.name;
  const rawSlug = b.slug;
  const rawDescription = b.description;
  const rawLongDescription = b.long_description;
  const rawPricingModel = b.pricing_model;
  const rawCategoryId = b.category_id;
  const rawPriceAmount = b.price_amount;
  const rawCurrency = b.currency;
  const rawWebsiteUrl = b.website_url;
  const rawGithubUrl = b.github_url;
  const rawApiDocsUrl = b.api_docs_url;
  const rawLogoUrl = b.logo_url;
  const rawTags = b.tags;

  // ─── Input Sanitization ──────────────────────────────────────
  const name = sanitizePlainText(rawName as string, FIELD_LIMITS.agentName);
  const description = sanitizePlainText(rawDescription as string, FIELD_LIMITS.agentDescription);

  if (!name || !description) {
    return NextResponse.json(
      { error: 'Name and description are required' },
      { status: 400 }
    );
  }

  const longDescription = rawLongDescription
    ? sanitizeRichText(rawLongDescription as string, FIELD_LIMITS.agentLongDescription)
    : null;
  const pricingModel = sanitizePricingModel(rawPricingModel);
  const tags = sanitizeTags(rawTags);

  // Validate slug
  let targetSlug: string;
  if (rawSlug) {
    const cleaned = sanitizeSlug(rawSlug as string);
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
  const websiteUrl = sanitizeUrl(rawWebsiteUrl as string | null);
  const githubUrl = sanitizeUrl(rawGithubUrl as string | null);
  const apiDocsUrl = sanitizeUrl(rawApiDocsUrl as string | null);
  const logoUrl = sanitizeUrl(rawLogoUrl as string | null);

  // Validate price
  const priceAmount =
    rawPriceAmount != null ? parseFloat(rawPriceAmount as string) : null;
  if (priceAmount !== null && (Number.isNaN(priceAmount) || priceAmount < 0 || priceAmount > 999999)) {
    return NextResponse.json(
      { error: 'Invalid price_amount' },
      { status: 400 }
    );
  }

  // Validate currency
  const currency = typeof rawCurrency === 'string' && (rawCurrency as string).length === 3
    ? rawCurrency.toUpperCase().replace(/[^A-Z]/g, '')
    : 'USD';

  // Validate category_id as UUID
  const categoryId = (rawCategoryId as string | null) || null;

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
    logApiError(request, error, { slug: targetSlug, creator_id: user.id });
    return NextResponse.json({ error: 'Failed to create agent listing' }, { status: 500 });
  }

  return NextResponse.json({ agent }, { status: 201 });
}
