import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'AgentHub product updates and release notes.',
};

const releases = [
  {
    version: '2026.04.09',
    date: 'April 9, 2026',
    tag: 'latest',
    changes: [
      { type: 'feature', text: 'Hero search bar — instant agent search from the landing page' },
      { type: 'feature', text: 'Testimonials section — real 5-star reviews from the community' },
      { type: 'feature', text: 'Public stats API endpoint (/api/stats) with agent/review/category counts' },
      { type: 'feature', text: 'ISR caching on agents browse page (60s revalidation)' },
      { type: 'feature', text: 'Health check endpoint (/api/health) with Supabase connectivity probe' },
      { type: 'feature', text: 'User feedback collection — inline form in footer with rate limiting' },
      { type: 'feature', text: 'JSON-LD structured data for SEO (WebSite + Organization schemas)' },
      { type: 'feature', text: 'ISR caching on homepage (60s revalidation) for faster page loads' },
      { type: 'fix', text: 'Global error handler now auto-reports errors to /api/errors in production' },
      { type: 'fix', text: 'metadataBase corrected to agenthub.syncoe.com (was old Vercel URL)' },
      { type: 'fix', text: 'Footer cleaned up — removed dead Twitter link, added Discord, deduplicated nav' },
    ],
  },
  {
    version: '2026.04.05',
    date: 'April 5, 2026',
    changes: [
      { type: 'fix', text: 'Fixed broken navigation links in footer (docs, blog, changelog pages removed)' },
      { type: 'fix', text: 'Set metadataBase to production URL — fixes OG image resolution' },
      { type: 'chore', text: 'Removed stale next.config.js duplicate' },
      { type: 'refactor', text: 'Trimmed 6,900+ lines of unused code — dead features, orphaned components, unused API routes' },
    ],
  },
  {
    version: '2026.04.04',
    date: 'April 4, 2026',
    changes: [
      { type: 'feature', text: 'Dynamic hero stats pulled from live database (agent count, review count, avg rating)' },
      { type: 'fix', text: 'Fixed top_rated sort — was sorting by created_at instead of actual review rating' },
      { type: 'feature', text: 'Agent spotlight section with weekly rotation' },
      { type: 'feature', text: 'Creator profiles with bios and avatar support' },
      { type: 'feature', text: 'Search autocomplete with instant suggestions' },
      { type: 'feature', text: 'Smarter "Similar Agents" recommendations on agent detail pages' },
      { type: 'feature', text: 'API documentation page and embed badge widget' },
    ],
  },
  {
    version: '2026.04.02',
    date: 'April 2, 2026',
    changes: [
      { type: 'feature', text: 'Full agent submission flow with 3-step onboarding' },
      { type: 'feature', text: 'Category pages with agent counts and descriptions' },
      { type: 'feature', text: 'Review system with star ratings and text reviews' },
      { type: 'feature', text: 'Agent comparison tool (side-by-side, up to 3 agents)' },
    ],
  },
  {
    version: '2026.04.01',
    date: 'April 1, 2026',
    changes: [
      { type: 'feature', text: 'Dark/light mode toggle' },
      { type: 'feature', text: 'Mobile-responsive design' },
      { type: 'feature', text: 'SEO meta tags, Open Graph images, sitemap.xml' },
      { type: 'feature', text: 'Legal pages: Terms, Privacy, DMCA, Listing Guidelines' },
    ],
  },
  {
    version: '2026.03.28',
    date: 'March 28, 2026',
    changes: [
      { type: 'feature', text: 'Initial AgentHub MVP — landing page, agent browsing, Supabase backend' },
      { type: 'feature', text: 'Agent search with category filtering and pricing model filters' },
      { type: 'feature', text: 'User authentication (email/password, Google, GitHub OAuth)' },
      { type: 'feature', text: 'Creator dashboard with agent management' },
    ],
  },
];

const typeStyles: Record<string, { label: string; color: string }> = {
  feature: { label: 'Feature', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  fix: { label: 'Fix', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  refactor: { label: 'Refactor', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  chore: { label: 'Chore', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
};

export default function ChangelogPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Changelog</h1>
        <p className="text-lg text-muted-foreground">
          Every improvement we ship. No fluff.
        </p>
      </div>

      <div className="relative space-y-12">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

        {releases.map((release) => (
          <div key={release.version} className="relative pl-8">
            {/* Timeline dot */}
            <div className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 border-indigo-600 bg-background" />

            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-lg font-semibold">v{release.version}</h2>
                {release.tag === 'latest' && (
                  <Badge className="bg-indigo-600 text-white text-xs">Latest</Badge>
                )}
                <span className="text-sm text-muted-foreground">{release.date}</span>
              </div>

              <ul className="space-y-2">
                {release.changes.map((change, i) => {
                  const style = typeStyles[change.type] || typeStyles.chore;
                  return (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Badge variant="secondary" className={style.color}>
                        {style.label}
                      </Badge>
                      <span className="text-muted-foreground pt-0.5">{change.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
