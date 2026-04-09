import { Sparkles, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatNumber } from '@/lib/utils';

interface HeroSectionProps {
  totalAgents: number;
  totalReviews: number;
  avgRating: number;
}

export function HeroSection({ totalAgents, totalReviews, avgRating }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-indigo-50/50 to-background dark:from-indigo-950/20 dark:to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            The #1 AI Agent Marketplace
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Discover & Deploy
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {' '}AI Agents
            </span>{' '}
            That Actually Work
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse, compare, and deploy verified AI agents for automation, research, customer support, and more. Built by the community, reviewed by users like you.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link href="/agents">
              <Button size="lg" className="w-full sm:w-auto text-base px-8">
                Explore Agents
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/submit">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8">
                List Your Agent
              </Button>
            </Link>
          </div>

          {/* Search bar */}
          <form action="/agents" method="get" className="pt-6 max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                name="q"
                type="text"
                placeholder="Search AI agents..."
                className="w-full h-12 pl-12 pr-4 rounded-xl border bg-background shadow-sm text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </form>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{formatNumber(totalAgents)}</p>
              <p>AI Agents</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{formatNumber(totalReviews)}</p>
              <p>Reviews</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{avgRating.toFixed(1)}</p>
              <p>Avg Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
