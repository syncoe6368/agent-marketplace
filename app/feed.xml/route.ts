import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const revalidate = 300; // 5 minutes

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  // Fetch latest 20 active agents
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name, slug, description, pricing_model, is_featured, is_verified, views_count, created_at, category:categories(name)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(20);

  const baseUrl = 'https://agenthub.syncoe.com';
  const feedItems = (agents || [])
    .map((agent) => {
      const categoryName = (agent.category as { name: string }[] | null)?.[0]?.name || '';
      const badges: string[] = [];
      if (agent.is_verified) badges.push('✓ Verified');
      if (agent.is_featured) badges.push('★ Featured');
      const badgeStr = badges.length > 0 ? ` [${badges.join(', ')}]` : '';

      return `
    <item>
      <title><![CDATA[${agent.name}${badgeStr}]]></title>
      <link>${baseUrl}/agents/${agent.slug}</link>
      <guid isPermaLink="true">${baseUrl}/agents/${agent.slug}</guid>
      <description><![CDATA[${agent.description}

Category: ${categoryName}
Pricing: ${agent.pricing_model}
Views: ${agent.views_count}]]></description>
      <pubDate>${new Date(agent.created_at).toUTCString()}</pubDate>
      <category>${categoryName}</category>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AgentHub — AI Agent Marketplace</title>
    <link>${baseUrl}</link>
    <description>The #1 marketplace for AI agents. Browse, compare, and deploy verified AI agents for automation, research, customer support, and more.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>AgentHub</generator>
    <ttl>60</ttl>${feedItems}
  </channel>
</rss>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
