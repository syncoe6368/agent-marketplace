import { BadgeCheck, Eye, Star, ArrowRight, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SpotlightAgent {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricing_model: string;
  price_amount: number | null;
  logo_url: string | null;
  tags: string[] | null;
  is_featured: boolean;
  is_verified: boolean;
  views_count: number;
  weekly_views: number;
  created_at: string;
  category?: { id: string; name: string; slug: string; description?: string | null; icon?: string | null } | null;
  creator?: { full_name?: string | null } | null;
  reviews?: { rating: number }[];
}

interface AgentSpotlightProps {
  agent: SpotlightAgent;
}

export function AgentSpotlight({ agent }: AgentSpotlightProps) {
  const ratings = (agent.reviews || []).map(r => r.rating);
  const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  const reviewCount = ratings.length;

  const categoryGradients: Record<string, string> = {
    automation: 'from-amber-500 to-orange-500',
    'research-analysis': 'from-blue-500 to-cyan-500',
    'customer-support': 'from-emerald-500 to-teal-500',
    development: 'from-violet-500 to-purple-500',
    finance: 'from-sky-500 to-blue-500',
    marketing: 'from-rose-500 to-pink-500',
  };

  const gradient = categoryGradients[agent.category?.slug || ''] || 'from-primary to-primary/70';

  const pricingLabel: Record<string, string> = {
    free: 'Free',
    paid: `From $${agent.price_amount || 0}`,
    freemium: 'Freemium',
    subscription: 'Subscription',
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="relative rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8 md:p-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-start gap-8">
          {/* Badge */}
          <div className="absolute -top-3 left-6">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-3 py-1 text-sm">
              ⭐ Spotlight
            </Badge>
          </div>

          {/* Agent icon */}
          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-3xl md:text-4xl shrink-0 shadow-lg mt-2`}>
            {agent.name.charAt(0).toUpperCase()}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl md:text-3xl font-bold">{agent.name}</h2>
              {agent.is_verified && <BadgeCheck className="h-6 w-6 text-primary" />}
              {agent.category && (
                <Badge variant="outline">{agent.category.name}</Badge>
              )}
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {pricingLabel[agent.pricing_model] || agent.pricing_model}
              </Badge>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              {agent.description}
            </p>

            {agent.tags && agent.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {agent.tags.slice(0, 5).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
              {reviewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="font-medium text-foreground">{avgRating.toFixed(1)}</span>
                  <span>({reviewCount} reviews)</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {agent.views_count.toLocaleString()} views
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Listed {new Date(agent.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Link href={`/agents/${agent.slug}`}>
                <Button size="lg" className="text-base">
                  View Agent
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/trending">
                <Button variant="outline" size="lg" className="text-base">
                  See All Trending
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
