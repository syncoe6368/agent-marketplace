import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="space-y-6 max-w-md">
        {/* 404 illustration */}
        <div className="relative">
          <span className="text-8xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            404
          </span>
          <div className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-primary/10 blur-xl" />
        </div>

        <h1 className="text-2xl font-bold">Agent Not Found</h1>
        <p className="text-muted-foreground">
          The agent you&apos;re looking for doesn&apos;t exist or may have been removed from the marketplace.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/">
            <Button className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/agents">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse Agents
            </Button>
          </Link>
        </div>

        {/* Quick suggestions */}
        <div className="pt-4">
          <p className="text-xs text-muted-foreground mb-3">Popular categories:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Automation', 'Research', 'Customer Support', 'Content Creation', 'Data Analysis'].map((cat) => (
              <Link
                key={cat}
                href={`/agents?q=${encodeURIComponent(cat)}`}
                className="text-xs px-3 py-1 rounded-full border hover:bg-muted transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
