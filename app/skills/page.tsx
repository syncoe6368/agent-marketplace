import type { Metadata } from 'next';
import { SkillCard } from '@/components/skills/skill-card';
import { FileCode, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Skill Packages',
  description: 'Browse and install OpenClaw skill packages. Ready-to-use agent capabilities for automation, development, security, and more.',
  openGraph: {
    title: 'Skill Packages — AgentHub',
    description: 'Browse and install OpenClaw skill packages for your AI agents.',
  },
};

interface SkillPackage {
  slug: string;
  name: string;
  version: string;
  description: string;
  longDescription?: string | null;
  author: string;
  license: string;
  category: string;
  pricingModel: string;
  price?: number | null;
  currency?: string | null;
  homepage?: string | null;
  repository?: string | null;
  apiDocs?: string | null;
  tags: string[];
  features: string[];
  hasSkillMd: boolean;
  hasIcon: boolean;
  hasScripts: boolean;
}

async function fetchSkills(): Promise<SkillPackage[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agenthub.syncoe.com';
  try {
    const res = await fetch(`${baseUrl}/api/skills`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.skills || [];
  } catch {
    return [];
  }
}

export default async function SkillsPage() {
  const skills = await fetchSkills();

  // Derive categories
  const categories = [...new Set(skills.map((s) => s.category))].sort();

  // Stats
  const totalSkills = skills.length;
  const freeSkills = skills.filter((s) => s.pricingModel === 'free').length;
  const authors = new Set(skills.map((s) => s.author)).size;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <FileCode className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Skill Packages</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Ready-to-install OpenClaw skill packages. Drop them into your agent workspace and unlock new capabilities instantly.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="px-4 py-2 rounded-lg bg-muted/50 text-sm">
            <span className="font-semibold">{totalSkills}</span> packages
          </div>
          <div className="px-4 py-2 rounded-lg bg-muted/50 text-sm">
            <span className="font-semibold">{freeSkills}</span> free
          </div>
          <div className="px-4 py-2 rounded-lg bg-muted/50 text-sm">
            <span className="font-semibold">{authors}</span> authors
          </div>
          {categories.length > 0 && (
            <div className="px-4 py-2 rounded-lg bg-muted/50 text-sm">
              <span className="font-semibold">{categories.length}</span> categories
            </div>
          )}
        </div>
      </div>

      {/* Category filter bar */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-sm text-muted-foreground mr-2 self-center">Filter:</span>
          {categories.map((cat) => (
            <a
              key={cat}
              href={`/skills?category=${encodeURIComponent(cat)}`}
              className="text-sm px-3 py-1.5 rounded-full border hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </a>
          ))}
        </div>
      )}

      {skills.length === 0 ? (
        <div className="text-center py-20">
          <FileCode className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg text-muted-foreground">No skill packages available yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Check back soon — new packages are added regularly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 text-center">
        <div className="rounded-xl border bg-muted/30 p-8 max-w-lg mx-auto">
          <h2 className="font-semibold text-lg mb-2">Have a Skill Package?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Publish your own skill packages to the AgentHub marketplace and reach the OpenClaw community.
          </p>
          <a
            href="https://github.com/syncoe6368/agent-marketplace"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Contribute on GitHub
            <Search className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
