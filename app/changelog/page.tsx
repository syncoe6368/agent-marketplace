import type { Metadata } from 'next';
import { Bot, Sparkles, GitFork, Eye, Star, Shield, Zap, Heart, BookOpen, Search, Users, Bell, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Changelog — AgentHub',
  description: 'Latest updates, features, and improvements to the AgentHub marketplace.',
  openGraph: {
    title: 'Changelog — AgentHub',
    description: 'Latest updates, features, and improvements to the AgentHub marketplace.',
  },
};

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  type: 'major' | 'feature' | 'improvement' | 'fix';
  changes: { icon: React.ReactNode; text: string }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: 'v0.9.0',
    date: '2026-04-05',
    title: 'Creator Profiles, Search Autocomplete & Changelog',
    description: 'Public creator profile pages, smarter agent discovery, and full transparency with our changelog.',
    type: 'feature',
    changes: [
      { icon: <Users className="h-4 w-4" />, text: 'Public creator profile pages — click any creator to see all their agents' },
      { icon: <Search className="h-4 w-4" />, text: 'Search autocomplete API — instant suggestions as you type' },
      { icon: <Sparkles className="h-4 w-4" />, text: 'Smarter "Similar Agents" — tag-based + category-based recommendations' },
      { icon: <BookOpen className="h-4 w-4" />, text: 'Public changelog page — what you\'re reading right now!' },
    ],
  },
  {
    version: 'v0.8.0',
    date: '2026-04-05',
    title: 'API Documentation & Embed Badges',
    description: 'Full API reference page and SVG badge generator for external embeds.',
    type: 'feature',
    changes: [
      { icon: <BookOpen className="h-4 w-4" />, text: 'API documentation page with curl examples and all endpoint references' },
      { icon: <Zap className="h-4 w-4" />, text: 'SVG embed badge generator — 4 styles (flat, flat-square, for-the-badge, social)' },
      { icon: <Eye className="h-4 w-4" />, text: 'API link added to navbar, footer, and mobile nav' },
    ],
  },
  {
    version: 'v0.7.0',
    date: '2026-04-05',
    title: 'Live Stats, Recently Added & Enhanced Pricing',
    description: 'Dynamic marketplace stats on homepage and pricing page with live DB data.',
    type: 'feature',
    changes: [
      { icon: <Eye className="h-4 w-4" />, text: 'Live stats API endpoint (/api/stats) with 60s server-side caching' },
      { icon: <Sparkles className="h-4 w-4" />, text: '"Recently Added" section on homepage showing 4 newest agents' },
      { icon: <Star className="h-4 w-4" />, text: 'Enhanced pricing page with live stats, plan icons, and FAQ section' },
      { icon: <Shield className="h-4 w-4" />, text: 'Trust badges in hero section (verified, free, community-driven)' },
    ],
  },
  {
    version: 'v0.6.0',
    date: '2026-04-04',
    title: 'Bookmarks, Newsletter & Social Sharing',
    description: 'Save your favorite agents, subscribe to updates, and share with one click.',
    type: 'feature',
    changes: [
      { icon: <Heart className="h-4 w-4" />, text: 'Agent bookmarking system with heart icon toggle' },
      { icon: <Users className="h-4 w-4" />, text: 'Saved Agents page with sort options' },
      { icon: <Bell className="h-4 w-4" />, text: 'Newsletter signup with email validation and rate limiting' },
      { icon: <GitFork className="h-4 w-4" />, text: 'Share Agent dialog — copy link, X, LinkedIn, Discord' },
    ],
  },
  {
    version: 'v0.5.0',
    date: '2026-04-04',
    title: 'Skill Packages & Security Hardening',
    description: 'Skill package distribution system and critical security fixes.',
    type: 'major',
    changes: [
      { icon: <BookOpen className="h-4 w-4" />, text: 'Skill packages browse and detail pages' },
      { icon: <Shield className="h-4 w-4" />, text: 'Fixed SQL injection vulnerability in agent search' },
      { icon: <Eye className="h-4 w-4" />, text: 'JSON-LD structured data (WebSite + Organization schema)' },
      { icon: <Sparkles className="h-4 w-4" />, text: 'Skill packages preview on homepage' },
    ],
  },
  {
    version: 'v0.4.0',
    date: '2026-04-04',
    title: 'Performance & Dynamic OG Images',
    description: 'Edge caching, query consolidation, and auto-generated social cards.',
    type: 'improvement',
    changes: [
      { icon: <Zap className="h-4 w-4" />, text: 'ISR caching (60s) on homepage, /agents, and category pages' },
      { icon: <Eye className="h-4 w-4" />, text: 'Homepage DB queries reduced from 5 to 2' },
      { icon: <GitFork className="h-4 w-4" />, text: 'Dynamic OG image route for unique social cards per agent' },
    ],
  },
  {
    version: 'v0.3.0',
    date: '2026-04-04',
    title: 'Error Tracking & Analytics',
    description: 'Error monitoring, Vercel Analytics, and launch preparation kit.',
    type: 'feature',
    changes: [
      { icon: <Shield className="h-4 w-4" />, text: 'Global error tracking with /api/errors endpoint' },
      { icon: <Eye className="h-4 w-4" />, text: 'Vercel Analytics integration (Web Vitals + pageviews)' },
      { icon: <Rocket className="h-4 w-4" />, text: 'Launch announcement draft for Product Hunt, HN, Reddit' },
    ],
  },
  {
    version: 'v0.2.0',
    date: '2026-04-04',
    title: 'User Experience Polish',
    description: 'Custom 404, loading skeletons, testimonials, and error boundaries.',
    type: 'improvement',
    changes: [
      { icon: <Sparkles className="h-4 w-4" />, text: 'Custom 404 page with CTAs and category suggestions' },
      { icon: <Eye className="h-4 w-4" />, text: 'Skeleton loaders across all major pages' },
      { icon: <Star className="h-4 w-4" />, text: 'Testimonials section pulling real reviews from DB' },
      { icon: <Shield className="h-4 w-4" />, text: 'Global error boundary with retry button' },
    ],
  },
  {
    version: 'v0.1.0',
    date: '2026-04-04',
    title: 'AgentHub MVP Launch',
    description: 'Initial marketplace with agent browsing, search, reviews, and 22 seed agents.',
    type: 'major',
    changes: [
      { icon: <Bot className="h-4 w-4" />, text: 'Agent browsing with search, category filters, and sort options' },
      { icon: <Star className="h-4 w-4" />, text: 'Review and rating system with star ratings' },
      { icon: <Users className="h-4 w-4" />, text: 'User authentication (email + OAuth)' },
      { icon: <Eye className="h-4 w-4" />, text: 'Dynamic hero stats and trending agents page' },
      { icon: <Shield className="h-4 w-4" />, text: 'RLS policies on all database tables' },
    ],
  },
];

const typeConfig = {
  major: { label: 'Major', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  feature: { label: 'Feature', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  improvement: { label: 'Improved', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  fix: { label: 'Fixed', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
};

export default function ChangelogPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
          <Rocket className="h-4 w-4" />
          What&apos;s New
        </div>
        <h1 className="text-4xl font-bold mb-3">Changelog</h1>
        <p className="text-muted-foreground text-lg">
          Every improvement we ship. No fluff, just progress.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-8">
          {changelog.map((entry, index) => (
            <div key={entry.version} className="relative pl-12">
              {/* Timeline dot */}
              <div className={`absolute left-2.5 top-1.5 w-4 h-4 rounded-full border-2 ${
                index === 0
                  ? 'bg-primary border-primary'
                  : 'bg-background border-muted-foreground/30'
              }`} />

              <Card className={index === 0 ? 'border-primary/30 shadow-sm' : ''}>
                <CardContent className="p-6">
                  {/* Version header */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-semibold text-primary">{entry.version}</span>
                    <Badge variant="secondary" className={typeConfig[entry.type].className}>
                      {typeConfig[entry.type].label}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Title & description */}
                  <h3 className="font-semibold text-lg mb-1">{entry.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{entry.description}</p>

                  {/* Change list */}
                  <ul className="space-y-2">
                    {entry.changes.map((change, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <span className="text-muted-foreground mt-0.5 shrink-0">{change.icon}</span>
                        <span>{change.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Want to request a feature?{' '}
          <a href="https://github.com/syncoe6368/agent-marketplace/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Open an issue on GitHub
          </a>{' '}
          or join our{' '}
          <a href="https://discord.com/invite/clawd" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Discord community
          </a>.
        </p>
      </div>
    </div>
  );
}
