'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Star, BadgeCheck, GitCompare, Play, Monitor, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    slug: string;
    description: string;
    pricing_model: string;
    price_amount: number | null;
    currency: string;
    logo_url?: string | null;
    tags?: string[] | null;
    is_featured?: boolean;
    is_verified?: boolean;
    average_rating?: number;
    review_count?: number;
    category?: { id: string; name: string; slug: string } | null;
  };
  showCompare?: boolean;
}

// Map tags to platform compatibility icons
function getPlatformIcons(tags?: string[] | null): { name: string; icon: string }[] {
  const platforms: { name: string; icon: string }[] = [];
  const tag = (tags || []).map((t) => t.toLowerCase());

  // Default: always show web
  platforms.push({ name: 'Web', icon: '🌐' });

  if (tag.some((t) => ['coding', 'developer-tools', 'code-review'].includes(t))) {
    platforms.push({ name: 'VS Code', icon: '💻' });
    platforms.push({ name: 'CLI', icon: '⌨️' });
  }
  if (tag.some((t) => ['automation', 'workflow'].includes(t))) {
    platforms.push({ name: 'API', icon: '🔌' });
  }
  if (tag.some((t) => ['support', 'chatbot', 'customer-service'].includes(t))) {
    platforms.push({ name: 'Widget', icon: '💬' });
  }
  if (tag.some((t) => ['marketing', 'content', 'social-media'].includes(t))) {
    platforms.push({ name: 'Ext', icon: '🧩' });
  }

  return platforms.slice(0, 4); // max 4 icons
}

// Generate a tiny "try it" preview snippet based on tags
function getTryItSnippet(tags?: string[] | null): string {
  const t = (tags || []).map((x) => x.toLowerCase());
  if (t.includes('coding')) return '→ "Refactor this function for better readability"';
  if (t.includes('support') || t.includes('chatbot')) return '→ "How do I reset my password?"';
  if (t.includes('research') || t.includes('analysis')) return '→ "Summarize the latest papers on LLM reasoning"';
  if (t.includes('automation') || t.includes('workflow')) return '→ "Automate my daily standup reports"';
  if (t.includes('marketing') || t.includes('content')) return '→ "Write a blog post about AI trends in 2025"';
  if (t.includes('finance')) return '→ "Analyze my portfolio risk exposure"';
  return '→ "Help me get started with this agent"';
}

const COMPARE_KEY = 'agenthub_compare';

function getCompareList(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function AgentCard({ agent, showCompare = true }: AgentCardProps) {
  const [comparing, setComparing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const list = getCompareList();
    setComparing(list.includes(agent.slug));
  }, [agent.slug]);

  const toggleCompare = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const list = getCompareList();
    let newList: string[];
    if (list.includes(agent.slug)) {
      newList = list.filter((s) => s !== agent.slug);
    } else {
      if (list.length >= 3) {
        // Max 3 agents for comparison
        newList = [...list.slice(1), agent.slug];
      } else {
        newList = [...list, agent.slug];
      }
    }
    localStorage.setItem(COMPARE_KEY, JSON.stringify(newList));
    setComparing(newList.includes(agent.slug));
    // Dispatch event for other cards to sync
    window.dispatchEvent(new Event('agenthub_compare_change'));
  }, [agent.slug]);

  // Listen for external compare changes
  useEffect(() => {
    const handler = () => {
      const list = getCompareList();
      setComparing(list.includes(agent.slug));
    };
    window.addEventListener('agenthub_compare_change', handler);
    return () => window.removeEventListener('agenthub_compare_change', handler);
  }, [agent.slug]);

  // Per-category avatar gradient colors
  const categoryGradients: Record<string, string> = {
    automation: 'from-amber-500 to-orange-500',
    'research-analysis': 'from-blue-500 to-cyan-500',
    'customer-support': 'from-emerald-500 to-teal-500',
    development: 'from-violet-500 to-purple-500',
    finance: 'from-sky-500 to-blue-500',
    marketing: 'from-rose-500 to-pink-500',
  };
  const avatarGradient = categoryGradients[agent.category?.slug || ''] || 'from-primary to-primary/70';

  const pricingColors: Record<string, string> = {
    free: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    freemium: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    subscription: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  };

  const platformIcons = getPlatformIcons(agent.tags);
  const tryItSnippet = getTryItSnippet(agent.tags);

  return (
    <Link href={`/agents/${agent.slug}`}>
      <Card className="group h-full hover:shadow-lg hover:border-primary/30 transition-all duration-200">
        <CardContent className="p-5 flex flex-col h-full">
          {/* Top row: avatar, name, pricing */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {agent.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                    {agent.name}
                  </h3>
                  {agent.is_verified && (
                    <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                  )}
                  {agent.is_featured && (
                    <Flame className="h-4 w-4 text-orange-500 shrink-0" />
                  )}
                </div>
                {agent.category && (
                  <p className="text-xs text-muted-foreground">{agent.category.name}</p>
                )}
              </div>
            </div>
            <Badge variant="secondary" className={pricingColors[agent.pricing_model]}>
              {agent.pricing_model === 'free' ? 'Free' : formatPrice(agent.price_amount, agent.currency)}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
            {agent.description}
          </p>

          {/* Try It preview */}
          <div className="mb-3 px-2.5 py-1.5 rounded-md bg-zinc-950 dark:bg-zinc-900 text-xs font-mono text-zinc-400 truncate">
            <Play className="h-3 w-3 inline mr-1 text-green-500" />
            {tryItSnippet}
          </div>

          {/* Bottom row: rating, tags, platforms, compare */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {agent.average_rating ? agent.average_rating.toFixed(1) : 'New'}
              </span>
              {agent.review_count !== undefined && agent.review_count > 0 && (
                <span className="text-xs text-muted-foreground">({agent.review_count})</span>
              )}
            </div>

            {/* Platform icons */}
            <div className="flex items-center gap-0.5">
              {platformIcons.map((p) => (
                <span key={p.name} title={p.name} className="text-xs opacity-70 hover:opacity-100 transition-opacity">
                  {p.icon}
                </span>
              ))}
            </div>

            {/* Compare button */}
            {mounted && showCompare && (
              <button
                onClick={toggleCompare}
                className={`p-1 rounded transition-colors ${
                  comparing
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary hover:bg-muted'
                }`}
                title={comparing ? 'Remove from comparison' : 'Add to comparison'}
              >
                <GitCompare className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Tags */}
          {(agent.tags?.length || 0) > 0 && (
            <div className="flex gap-1 flex-wrap mt-2">
              {agent.tags!.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
