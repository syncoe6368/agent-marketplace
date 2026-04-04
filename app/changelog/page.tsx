import type { Metadata } from 'next';
import { Bot, Sparkles, GitFork, Eye, Star, Shield, Zap, Heart, BookOpen, Search, Users, Bell, Rocket, Palette } from 'lucide-react';
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
    version: '2026.04.05',
    date: '2026-04-05',
    title: 'Creator Profiles, Search Autocomplete & API Docs',
    description: 'Public creator pages, smarter agent discovery, full API reference, and embed badges.',
    type: 'feature',
    changes: [
      { icon: <Users className="h-4 w-4" />, text: 'Public creator profile pages — click any creator to see all their agents' },
      { icon: <Search className="h-4 w-4" />, text: 'Search autocomplete API — instant suggestions as you type' },
      { icon: <Sparkles className="h-4 w-4" />, text: 'Smarter "Similar Agents" — tag-based + category-based recommendations' },
      { icon: <BookOpen className="h-4 w-4" />, text: 'API documentation page with curl examples and all endpoint references' },
      { icon: <Zap className="h-4 w-4" />, text: 'SVG embed badge generator — 4 styles (flat, flat-square, for-the-badge, social)' },
      { icon: <Eye className="h-4 w-4" />, text: 'Live stats API endpoint (/api/stats) with 60s server-side caching' },
      { icon: <Sparkles className="h-4 w-4" />, text: '"Recently Added" section on homepage showing newest agents' },
      { icon: <Star className="h-4 w-4" />, text: 'Enhanced pricing page with live stats, plan icons, and FAQ section' },
      { icon: <Shield className="h-4 w-4" />, text: 'Trust badges in hero section (verified, free, community-driven)' },
      { icon: <BookOpen className="h-4 w-4" />, text: 'Public changelog page with date-based versioning' },
    ],
  },
  {
    version: '2026.04.04',
    date: '2026-04-04',
    title: 'Bookmarks, Social Sharing, Theme Overhaul & Real Value',
    description: 'Save favorites, share agents, professional Ocean theme, and actionable agent detail pages.',
    type: 'major',
    changes: [
      { icon: <Heart className="h-4 w-4" />, text: 'Agent bookmarking system with heart icon toggle and /bookmarks page' },
      { icon: <Bell className="h-4 w-4" />, text: 'Newsletter signup with email validation and rate limiting' },
      { icon: <GitFork className="h-4 w-4" />, text: 'Share Agent dialog — copy link, X, LinkedIn, Discord' },
      { icon: <Palette className="h-4 w-4" />, text: 'Professional "Ocean" light + "Midnight" dark theme — replaced all purple/indigo' },
      { icon: <Zap className="h-4 w-4" />, text: 'Install commands, capabilities grid, requirements, pricing breakdown per agent' },
      { icon: <Search className="h-4 w-4" />, text: 'Agent comparison page — side-by-side compare up to 3 agents' },
      { icon: <Sparkles className="h-4 w-4" />, text: 'Trending This Week page — top 20 agents by weekly views' },
      { icon: <BookOpen className="h-4 w-4" />, text: 'Skill packages browse and detail pages' },
      { icon: <Shield className="h-4 w-4" />, text: 'Fixed SQL injection vulnerability in agent search' },
      { icon: <Eye className="h-4 w-4" />, text: 'ISR caching (60s), dynamic OG images, JSON-LD structured data' },
      { icon: <Star className="h-4 w-4" />, text: 'Review and rating system with star ratings' },
      { icon: <Users className="h-4 w-4" />, text: 'User authentication (email + OAuth)' },
      { icon: <Shield className="h-4 w-4" />, text: 'Custom 404, loading skeletons, global error boundary, testimonials' },
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
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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
