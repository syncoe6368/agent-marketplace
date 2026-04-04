import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FileCode, Terminal, ExternalLink } from 'lucide-react';

interface SkillCardProps {
  skill: {
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
  };
}

const categoryColors: Record<string, string> = {
  development: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
  finance: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
  security: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  research: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  marketing: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
  automation: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
};

const pricingLabels: Record<string, string> = {
  free: 'Free',
  paid: 'Paid',
  freemium: 'Freemium',
  subscription: 'Subscription',
};

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <Link href={`/skills/${skill.slug}`}>
      <Card className="group h-full hover:shadow-lg hover:border-primary/30 transition-all duration-200">
        <CardContent className="p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white shrink-0">
                <FileCode className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                  {skill.name}
                </h3>
                <p className="text-xs text-muted-foreground">by {skill.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge variant="outline" className="text-[10px]">
                v{skill.version}
              </Badge>
              <Badge className={categoryColors[skill.category] || 'bg-muted text-muted-foreground'}>
                {pricingLabels[skill.pricingModel] || skill.pricingModel}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3 flex-1">
            {skill.description}
          </p>

          {/* Features */}
          <div className="mb-3">
            <ul className="text-xs text-muted-foreground space-y-1">
              {skill.features.slice(0, 3).map((feature, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
              {skill.features.length > 3 && (
                <li className="text-muted-foreground">+{skill.features.length - 3} more features</li>
              )}
            </ul>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {skill.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {skill.hasSkillMd && (
                <span className="flex items-center gap-1" title="Includes SKILL.md">
                  <FileCode className="h-3 w-3" />
                  Docs
                </span>
              )}
              {skill.hasScripts && (
                <span className="flex items-center gap-1" title="Includes scripts">
                  <Terminal className="h-3 w-3" />
                  Scripts
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{skill.license}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
