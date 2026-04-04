import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/embed?agent=<slug>&style=flat|flat-square|for-the-badge|social
 *
 * Generates an SVG badge for an agent listing.
 * Use in markdown: ![AgentHub](https://agenthub.syncoe.com/api/embed?agent=my-agent)
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('agent');
  if (!slug) {
    return NextResponse.json({ error: 'Missing ?agent=<slug>' }, { status: 400 });
  }

  const style = request.nextUrl.searchParams.get('style') || 'flat';
  const supabase = await createClient();

  const { data: agent } = await supabase
    .from('agents')
    .select('name, slug, is_verified, is_featured, categories(name), reviews(rating)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  // Fetch average rating from reviews
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const agentAny = agent as any;
  const reviews = (agentAny.reviews || []) as Array<{ rating: number }>;
  const rating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;
  const category = agentAny.categories?.name || '';

  // Badge configurations per style
  const configs: Record<string, { height: number; fontSize: number; borderRadius: number; labelPad: number; valuePad: number }> = {
    flat: { height: 20, fontSize: 11, borderRadius: 3, labelPad: 6, valuePad: 8 },
    'flat-square': { height: 20, fontSize: 11, borderRadius: 0, labelPad: 6, valuePad: 8 },
    'for-the-badge': { height: 28, fontSize: 14, borderRadius: 4, labelPad: 8, valuePad: 12 },
    social: { height: 20, fontSize: 12, borderRadius: 3, labelPad: 6, valuePad: 10 },
  };

  const cfg = configs[style] || configs.flat;
  const verified = agent.is_verified ? '✓ ' : '';
  const featured = agent.is_featured ? '★ ' : '';
  const label = `${verified}${featured}AgentHub`;
  const value = `${agent.name}${rating ? ` ★${rating}` : ''}${category ? ` · ${category}` : ''}`;

  // Measure text widths (monospace approximation: ~0.6 * fontSize per char)
  const labelW = Math.ceil(label.length * cfg.fontSize * 0.6) + cfg.labelPad * 2;
  const valueW = Math.ceil(value.length * cfg.fontSize * 0.6) + cfg.valuePad * 2;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${labelW + valueW}" height="${cfg.height}">
  <linearGradient id="a" x2="0" y2="1">
    <stop offset="0" stop-color="#666"/>
    <stop offset="1" stop-color="#555"/>
  </linearGradient>
  <linearGradient id="b" x2="0" y2="1">
    <stop offset="0" stop-color="#6366f1"/>
    <stop offset="1" stop-color="#4f46e5"/>
  </linearGradient>
  <clipPath id="c"><rect width="${labelW + valueW}" height="${cfg.height}" rx="${cfg.borderRadius}"/></clipPath>
  <g clip-path="url(#c)">
    <rect width="${labelW}" height="${cfg.height}" fill="url(#a)"/>
    <rect x="${labelW}" width="${valueW}" height="${cfg.height}" fill="url(#b)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="${cfg.fontSize}">
    <text x="${labelW / 2}" y="${cfg.height / 2 + 1}" dominant-baseline="central" font-weight="bold">${label}</text>
    <text x="${labelW + valueW / 2}" y="${cfg.height / 2 + 1}" dominant-baseline="central">${value}</text>
  </g>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
