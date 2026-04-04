import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CallToAction() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border p-8 md:p-16">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Join 500+ agent builders
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready to List Your Agent?
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Get your AI agent in front of thousands of potential users. Free to start, with powerful tools to grow your reach.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link href="/submit">
                <Button size="lg" className="w-full sm:w-auto text-base px-8">
                  List Your Agent — It&apos;s Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8">
                  View Pricing
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              No credit card required · Free tier includes up to 3 listings · Setup in under 2 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
