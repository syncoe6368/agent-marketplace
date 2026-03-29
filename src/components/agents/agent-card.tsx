import Link from 'next/link';
import { Star, ExternalLink, BadgeCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Agent } from '@/types';
import { formatPrice } from '@/lib/utils';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const pricingColors: Record<string, string> = {
    free: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    freemium: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    subscription: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  };

  return (
    <Link href={`/agents/${agent.slug}`}>
      <Card className="group h-full hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {agent.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm truncate group-hover:text-indigo-600 transition-colors">
                    {agent.name}
                  </h3>
                  {agent.is_verified && (
                    <BadgeCheck className="h-4 w-4 text-indigo-600 shrink-0" />
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

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {agent.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {agent.average_rating ? agent.average_rating.toFixed(1) : 'New'}
              </span>
              {agent.review_count !== undefined && agent.review_count > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({agent.review_count})
                </span>
              )}
            </div>
            <div className="flex gap-1 flex-wrap">
              {agent.tags?.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
