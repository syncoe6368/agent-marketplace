import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agenthub.io';

  // Static pages
  const staticPages = [
    { url: '/', lastModified: new Date() },
    { url: '/agents', lastModified: new Date() },
    { url: '/categories', lastModified: new Date() },
    { url: '/pricing', lastModified: new Date() },
    { url: '/legal/terms', lastModified: new Date() },
    { url: '/legal/privacy', lastModified: new Date() },
    { url: '/legal/guidelines', lastModified: new Date() },
    { url: '/legal/dmca', lastModified: new Date() },
  ];

  // Fetch dynamic agent slugs and categories from Supabase (server-side)
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnon) {
      // Use the built-in Next.js server-side approach
      const response = await fetch(`${supabaseUrl}/rest/v1/agents?select=slug,created_at,updated_at&status=eq.active`, {
        headers: {
          'apikey': supabaseAnon,
          'Authorization': `Bearer ${supabaseAnon}`,
        },
        next: { revalidate: 3600 }, // Revalidate every hour
      });

      if (response.ok) {
        const agents = await response.json();
        const agentPages = agents.map((agent: { slug: string; created_at: string; updated_at: string }) => ({
          url: `/agents/${agent.slug}`,
          lastModified: new Date(agent.updated_at || agent.created_at),
        }));
        return [...staticPages, ...agentPages];
      }
    }
  } catch (error) {
    // If Supabase fetch fails, return static pages only (guides SEO to known good URLs)
    console.warn('Sitemap generation: Supabase fetch failed, returning static pages only:', error);
  }

  return staticPages;
}
