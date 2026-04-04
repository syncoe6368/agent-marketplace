import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface RecentAgent {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricing_model: string;
  price_amount: number | null;
  currency: string;
  tags?: string[] | null;
  is_verified?: boolean;
  is_featured?: boolean;
  created_at: string;
  category?: { id: string; name: string; slug: string } | null;
}

interface RecentlyAddedProps {
  agents: RecentAgent[];
}

const categoryGradients: Record<string, string> = {
  automation: 'from-amber-500 to-orange-500',
  'research-analysis': 'from-blue-500 to-cyan-500',
  'customer-support': 'from-emerald-500 to-teal-500',
  development: 'from-violet-500 to-purple-500',
  finance: 'from-sky-500 to-blue-500',
  marketing: 'from-rose-500 to-pink-500',
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const pricingLabels: Record<string, string> = {
  free: 'Free',
  paid: 'Paid',
  freemium: 'Freemium',
  subscription: 'Subscription',
};

export function RecentlyAdded({ agents }: RecentlyAddedProps) {
  if (agents.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Recently Added</h2>
            </div>
            <p className="text-muted-foreground">Newest agents joining the marketplace</p>
          </div>
          <Link
            href="/agents?sort=newest"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.slice(0, 4).map((agent) => (
            <Link key={agent.id} href={`/agents/${agent.slug}`}>
              <Card className="group h-full hover:shadow-lg hover:border-primary/30 transition-all duration-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${categoryGradients[agent.category?.slug || ''] || 'from-primary to-primary/70'} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {agent.category?.name || 'Uncategorized'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {agent.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {timeAgo(agent.created_at)}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {pricingLabels[agent.pricing_model] || agent.pricing_model}
                    </Badge>
                  </div>

                  {(agent.tags?.length || 0) > 0 && (
                    <div className="flex gap-1 flex-wrap mt-3">
                      {agent.tags!.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
