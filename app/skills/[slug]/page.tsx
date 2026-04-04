import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  FileCode, Terminal, ExternalLink, GitFork, Globe, BookOpen,
  Shield, Tag, Copy, Check,
} from 'lucide-react';

export const revalidate = 300;

interface SkillDetailProps {
  params: Promise<{ slug: string }>;
}

async function fetchSkill(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agenthub.syncoe.com';
  const res = await fetch(`${baseUrl}/api/skills/${slug}?include=all`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: SkillDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const skill = await fetchSkill(slug);
  if (!skill) return { title: 'Skill Package Not Found' };
  return {
    title: `${skill.manifest.name} — Skill Package`,
    description: skill.manifest.description,
    openGraph: {
      title: skill.manifest.name,
      description: skill.manifest.description,
    },
  };
}

export default async function SkillDetailPage({ params }: SkillDetailProps) {
  const { slug } = await params;
  const skill = await fetchSkill(slug);

  if (!skill) notFound();

  const { manifest, skillMd, files } = skill;

  const installCommands = [
    `mkdir -p ~/.openclaw/skills/${slug}`,
    `cd ~/.openclaw/skills/${slug}`,
    `curl -sL https://agenthub.syncoe.com/api/skills/${slug}/download?file=skill.json -o skill.json`,
    ...(skill.hasSkillMd ? [`curl -sL https://agenthub.syncoe.com/api/skills/${slug}/download?file=SKILL.md -o SKILL.md`] : []),
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white shrink-0">
          <FileCode className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{manifest.name}</h1>
            <Badge variant="outline" className="text-xs">
              v{manifest.version}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>by {manifest.author}</span>
            <span>{manifest.license}</span>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {manifest.pricingModel === 'free' ? 'Free' : manifest.pricingModel}
            </Badge>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed mb-6">
        {manifest.longDescription || manifest.description}
      </p>

      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        <Tag className="h-4 w-4 text-muted-foreground" />
        {manifest.tags.map((tag: string) => (
          <Badge key={tag} variant="secondary">{tag}</Badge>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-8">
        {manifest.homepage && (
          <a href={manifest.homepage} target="_blank" rel="noopener noreferrer">
            <Button size="sm">
              <Globe className="mr-2 h-4 w-4" />
              Homepage
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </a>
        )}
        {manifest.repository && (
          <a href={manifest.repository} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <GitFork className="mr-2 h-4 w-4" />
              Source
            </Button>
          </a>
        )}
        {manifest.apiDocs && (
          <a href={manifest.apiDocs} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <BookOpen className="mr-2 h-4 w-4" />
              API Docs
            </Button>
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {manifest.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* SKILL.md content */}
          {skillMd && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none prose-sm">
                  <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
                    {skillMd}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Files */}
          {files && files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Package Contents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-xs space-y-1 bg-muted p-4 rounded-lg">
                  {files.map((file: string, i: number) => (
                    <div key={i} className="text-muted-foreground">
                      {file}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Install */}
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="text-lg">Quick Install</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-zinc-950 dark:bg-zinc-900 rounded-lg p-4 font-mono text-xs space-y-1 overflow-x-auto">
                {installCommands.map((cmd: string, i: number) => (
                  <div key={i} className="text-green-400">
                    <span className="text-muted-foreground mr-1">$</span>
                    {cmd}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Requires OpenClaw CLI. <a href="https://github.com/openclaw/openclaw" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Install OpenClaw →</a>
              </p>
            </CardContent>
          </Card>

          {/* Package Info */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Version</span>
                <span className="font-mono">{manifest.version}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">License</span>
                <span>{manifest.license}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="capitalize">{manifest.category}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Includes</span>
                <div className="flex gap-1">
                  {skill.hasSkillMd && <Badge variant="outline" className="text-[10px]">Docs</Badge>}
                  {skill.hasScripts && <Badge variant="outline" className="text-[10px]">Scripts</Badge>}
                  {skill.hasIcon && <Badge variant="outline" className="text-[10px]">Icon</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
