import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agenthub.syncoe.com';

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
    { url: '/skills', lastModified: new Date() },
    { url: '/trending', lastModified: new Date() },
    { url: '/compare', lastModified: new Date() },
    { url: '/bookmarks', lastModified: new Date() },
  ];

  // Fetch dynamic agent slugs and categories from Supabase (server-side)
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnon) {
      const headers = {
        'apikey': supabaseAnon,
        'Authorization': `Bearer ${supabaseAnon}`,
      };

      // Fetch agents
      const agentsRes = await fetch(`${supabaseUrl}/rest/v1/agents?select=slug,created_at,updated_at&status=eq.active`, {
        headers,
        next: { revalidate: 3600 },
      });

      const dynamicPages: MetadataRoute.Sitemap = [];

      if (agentsRes.ok) {
        const agents = await agentsRes.json();
        dynamicPages.push(...agents.map((agent: { slug: string; created_at: string; updated_at: string }) => ({
          url: `${baseUrl}/agents/${agent.slug}`,
          lastModified: new Date(agent.updated_at || agent.created_at),
        })));
      }

      // Fetch categories
      const catsRes = await fetch(`${supabaseUrl}/rest/v1/categories?select=slug,created_at`, {
        headers,
        next: { revalidate: 3600 },
      });
      if (catsRes.ok) {
        const cats = await catsRes.json();
        dynamicPages.push(...cats.map((cat: { slug: string; created_at: string }) => ({
          url: `${baseUrl}/categories/${cat.slug}`,
          lastModified: new Date(cat.created_at),
        })));
      }

      // Fetch skill packages
      const skillsRes = await fetch(`${supabaseUrl}/rest/v1/skill_packages?select=slug,created_at&status=eq.published`, {
        headers,
        next: { revalidate: 3600 },
      });
      if (skillsRes.ok) {
        const skills = await skillsRes.json();
        dynamicPages.push(...skills.map((skill: { slug: string; created_at: string }) => ({
          url: `${baseUrl}/skills/${skill.slug}`,
          lastModified: new Date(skill.created_at),
        })));
      }

      if (dynamicPages.length > 0) {
        return [...staticPages.map(p => ({ ...p, url: `${baseUrl}${p.url}` })), ...dynamicPages];
      }
    }
  } catch (error) {
    // If Supabase fetch fails, return static pages only (guides SEO to known good URLs)
    console.warn('Sitemap generation: Supabase fetch failed, returning static pages only:', error);
  }

  return staticPages;
}
