import Link from 'next/link';
import { FileCode, ArrowRight, Terminal, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SkillPackage {
  slug: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: string;
  pricingModel: string;
  tags: string[];
  features: string[];
  hasSkillMd: boolean;
  hasScripts: boolean;
}

async function fetchFeaturedSkills(): Promise<SkillPackage[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agenthub.syncoe.com';
  try {
    const res = await fetch(`${baseUrl}/api/skills`, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.skills || []).slice(0, 3);
  } catch {
    return [];
  }
}

export async function SkillPackagesPreview() {
  const skills = await fetchFeaturedSkills();

  if (skills.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Skill Packages</h2>
          </div>
          <Link href="/skills" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all packages
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <p className="text-muted-foreground mb-8">
          Drop-in capabilities for OpenClaw agents. Install with a single command.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <Link key={skill.slug} href={`/skills/${skill.slug}`}>
              <Card className="group h-full hover:shadow-lg hover:border-primary/30 transition-all duration-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white shrink-0">
                      <FileCode className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                        {skill.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        v{skill.version} · {skill.author}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] ml-auto shrink-0">
                      {skill.pricingModel === 'free' ? 'Free' : skill.pricingModel}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {skill.description}
                  </p>

                  <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                    {skill.features.slice(0, 2).map((feature, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    {skill.hasSkillMd && (
                      <span className="flex items-center gap-1">
                        <FileCode className="h-3 w-3" /> Docs
                      </span>
                    )}
                    {skill.hasScripts && (
                      <span className="flex items-center gap-1">
                        <Terminal className="h-3 w-3" /> Scripts
                      </span>
                    )}
                    <div className="flex gap-1 ml-auto">
                      {skill.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
