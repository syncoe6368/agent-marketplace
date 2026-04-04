'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Check, X, Star, Eye, ArrowLeft, GitCompare,
  BadgeCheck, ExternalLink, Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';

interface CompareAgent {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string | null;
  pricing_model: string;
  price_amount: number | null;
  currency: string;
  tags: string[] | null;
  views_count: number;
  is_verified: boolean;
  website_url: string | null;
  github_url: string | null;
  created_at: string;
  category?: { id: string; name: string; slug: string } | null;
  reviews?: { rating: number }[];
}

export default function ComparePageClient() {
  const searchParams = useSearchParams();
  const [agents, setAgents] = useState<CompareAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slugs = searchParams.get('agents')?.split(',').filter(Boolean) || [];

    const fetchAgents = async () => {
      if (slugs.length === 0) {
        setAgents([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('agents')
        .select('*, category:categories(id, name, slug), reviews(rating)')
        .in('slug', slugs)
        .eq('status', 'active');

      const ordered = slugs
        .map((s) => (data || []).find((a: CompareAgent) => a.slug === s))
        .filter(Boolean) as CompareAgent[];

      setAgents(ordered);
      setLoading(false);
    };

    fetchAgents();
  }, [searchParams]);

  const getAvgRating = (agent: CompareAgent) => {
    const reviews = agent.reviews || [];
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
        <GitCompare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Compare Agents</h1>
        <p className="text-muted-foreground mb-6">
          Add agents to compare by browsing the marketplace and clicking &quot;Compare&quot;
        </p>
        <Link href="/agents">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse Agents
          </Button>
        </Link>
      </div>
    );
  }

  const allTags = [...new Set(agents.flatMap((a) => a.tags || []))];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/agents">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <GitCompare className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold">Agent Comparison</h1>
      </div>

      {/* Agent headers */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${agents.length}, 1fr)` }}>
        <div />
        {agents.map((agent) => (
          <Card key={agent.id} className="relative overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-2">
                {agent.name.charAt(0).toUpperCase()}
              </div>
              <Link href={`/agents/${agent.slug}`} className="font-semibold hover:text-primary transition-colors">
                {agent.name}
              </Link>
              {agent.is_verified && (
                <BadgeCheck className="h-4 w-4 text-primary inline ml-1" />
              )}
              {agent.category && (
                <p className="text-xs text-muted-foreground mt-1">{agent.category.name}</p>
              )}
              {agent.website_url && (
                <a href={agent.website_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Visit
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison rows */}
      <Card>
        <CardContent className="p-0">
          {/* Pricing */}
          <div className="grid border-b" style={{ gridTemplateColumns: `200px repeat(${agents.length}, 1fr)` }}>
            <div className="p-4 font-semibold text-sm bg-muted/30 border-r">Pricing</div>
            {agents.map((agent) => (
              <div key={agent.id} className="p-4 text-center border-r last:border-r-0">
                <Badge className={
                  agent.pricing_model === 'free'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }>
                  {agent.pricing_model === 'free' ? 'Free' : formatPrice(agent.price_amount, agent.currency)}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1 capitalize">{agent.pricing_model}</p>
              </div>
            ))}
          </div>

          {/* Rating */}
          <div className="grid border-b" style={{ gridTemplateColumns: `200px repeat(${agents.length}, 1fr)` }}>
            <div className="p-4 font-semibold text-sm bg-muted/30 border-r">Rating</div>
            {agents.map((agent) => {
              const avg = getAvgRating(agent);
              return (
                <div key={agent.id} className="p-4 text-center border-r last:border-r-0">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{avg > 0 ? avg.toFixed(1) : 'N/A'}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{agent.reviews?.length || 0} reviews</p>
                </div>
              );
            })}
          </div>

          {/* Views */}
          <div className="grid border-b" style={{ gridTemplateColumns: `200px repeat(${agents.length}, 1fr)` }}>
            <div className="p-4 font-semibold text-sm bg-muted/30 border-r">Views</div>
            {agents.map((agent) => (
              <div key={agent.id} className="p-4 text-center border-r last:border-r-0">
                <div className="flex items-center justify-center gap-1">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{agent.views_count.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Verified */}
          <div className="grid border-b" style={{ gridTemplateColumns: `200px repeat(${agents.length}, 1fr)` }}>
            <div className="p-4 font-semibold text-sm bg-muted/30 border-r">Verified</div>
            {agents.map((agent) => (
              <div key={agent.id} className="p-4 text-center border-r last:border-r-0">
                {agent.is_verified ? (
                  <Check className="h-5 w-5 text-green-600 mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-muted-foreground mx-auto" />
                )}
              </div>
            ))}
          </div>

          {/* Capabilities */}
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${agents.length}, 1fr)` }}>
            <div className="p-4 font-semibold text-sm bg-muted/30 border-r">
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                Capabilities
              </div>
            </div>
            {agents.map((agent) => (
              <div key={agent.id} className="p-4 border-r last:border-r-0">
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {allTags.map((tag) => {
                    const has = agent.tags?.includes(tag);
                    return (
                      <Badge
                        key={tag}
                        variant={has ? 'default' : 'outline'}
                        className={`text-xs ${has ? '' : 'opacity-40'}`}
                      >
                        {has ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                        {tag}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Descriptions */}
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-bold">Descriptions</h3>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(agents.length, 3)}, 1fr)` }}>
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{agent.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {agent.long_description || agent.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-3">Want to compare different agents?</p>
        <Link href="/agents">
          <Button variant="outline">Browse More Agents</Button>
        </Link>
      </div>
    </div>
  );
}
