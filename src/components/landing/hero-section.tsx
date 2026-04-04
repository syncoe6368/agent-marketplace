import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HeroSectionProps {
  totalAgents: number;
  totalReviews: number;
  avgRating: number;
}

export function HeroSection({ totalAgents, totalReviews, avgRating }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            The #1 AI Agent Marketplace
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Discover & Deploy
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
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

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{totalAgents}+</p>
              <p>AI Agents</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{totalReviews}+</p>
              <p>Reviews</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{avgRating.toFixed(1)}<span className="text-amber-500">★</span></p>
              <p>Avg Rating</p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Verified listings
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Free to start
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Community driven
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
