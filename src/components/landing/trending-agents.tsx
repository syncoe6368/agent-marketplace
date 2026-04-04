import Link from 'next/link';
import { Flame, Sparkles, Eye, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface TrendingAgent {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricing_model: string;
  price_amount: number | null;
  currency: string;
  views_count: number;
  tags?: string[] | null;
  is_verified?: boolean;
  created_at: string;
  category?: { id: string; name: string; slug: string } | null;
}

interface TrendingAgentsProps {
  agents: TrendingAgent[];
}

function isLast7Days(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return diff <= 7 * 24 * 60 * 60 * 1000;
}

const categoryGradients: Record<string, string> = {
  automation: 'from-amber-500 to-orange-500',
  'research-analysis': 'from-blue-500 to-cyan-500',
  'customer-support': 'from-emerald-500 to-teal-500',
  development: 'from-violet-500 to-purple-500',
  finance: 'from-sky-500 to-blue-500',
  marketing: 'from-rose-500 to-pink-500',
};

export function TrendingAgents({ agents }: TrendingAgentsProps) {
  if (agents.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-transparent">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h2 className="text-2xl font-bold">Trending This Week</h2>
        </div>
        <p className="text-muted-foreground mb-8">Most viewed agents in the last 7 days</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {agents.slice(0, 5).map((agent, i) => (
            <Link key={agent.id} href={`/agents/${agent.slug}`}>
              <Card className="group h-full hover:shadow-lg hover:border-primary/30 transition-all duration-200 relative overflow-hidden">
                {i === 0 && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-bl-lg">
                      #1
                    </div>
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${categoryGradients[agent.category?.slug || ''] || 'from-primary to-primary/70'} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                        {agent.name}
                      </h3>
                      {agent.category && (
                        <p className="text-xs text-muted-foreground truncate">{agent.category.name}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {agent.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{agent.views_count}</span>
                    </div>
                    <div className="flex gap-1">
                      {agent.views_count > 100 && (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-[10px] px-1.5 py-0">
                          🔥 Hot
                        </Badge>
                      )}
                      {isLast7Days(agent.created_at) && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-[10px] px-1.5 py-0">
                          New
                        </Badge>
                      )}
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
