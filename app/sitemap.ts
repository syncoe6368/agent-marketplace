import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketplace.syncoe.com';

  // Static pages — always use absolute URLs
  const staticPages = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/agents`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/changelog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.5 },
    { url: `${baseUrl}/submit`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/support`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.4 },
    { url: `${baseUrl}/legal/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/legal/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/legal/guidelines`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/legal/dmca`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
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
          url: `${baseUrl}/agents/${agent.slug}`,
          lastModified: new Date(agent.updated_at || agent.created_at),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
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
