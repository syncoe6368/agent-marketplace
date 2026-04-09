import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const headers = { apikey: key, Authorization: `Bearer ${key}` };

  try {
    const [agentsRes, reviewsRes, categoriesRes] = await Promise.all([
      fetch(`${url}/rest/v1/agents?select=id&status=eq.active`, { headers }).then((r) => r.json()),
      fetch(`${url}/rest/v1/reviews?select=rating`, { headers }).then((r) => r.json()),
      fetch(`${url}/rest/v1/categories?select=id`, { headers }).then((r) => r.json()),
    ]);

    const totalAgents = Array.isArray(agentsRes) ? agentsRes.length : 0;
    const reviews = Array.isArray(reviewsRes) ? reviewsRes : [];
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews
      : 0;
    const totalCategories = Array.isArray(categoriesRes) ? categoriesRes.length : 0;

    return NextResponse.json({
      totalAgents,
      totalReviews,
      avgRating: Math.round(avgRating * 10) / 10,
      totalCategories,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
