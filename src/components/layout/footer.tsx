import Link from 'next/link';
import { Bot, GitFork, MessageCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Bot className="h-6 w-6 text-primary" />
              AgentHub
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover, compare, and deploy the best AI agents for your business.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Platform</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/agents" className="hover:text-foreground transition-colors">Browse Agents</Link>
              <Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link>
              <Link href="/submit" className="hover:text-foreground transition-colors">List Your Agent</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/skills" className="hover:text-foreground transition-colors">Skill Packages</Link>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Explore</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/compare" className="hover:text-foreground transition-colors">Compare Agents</Link>
              <Link href="/trending" className="hover:text-foreground transition-colors">Trending</Link>
              <Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link>
              <Link href="/skills" className="hover:text-foreground transition-colors">Skill Packages</Link>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Legal</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/legal/guidelines" className="hover:text-foreground transition-colors">Listing Guidelines</Link>
              <Link href="/legal/dmca" className="hover:text-foreground transition-colors">DMCA Policy</Link>
            </nav>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AgentHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://github.com/syncoe6368/agent-marketplace" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <GitFork className="h-5 w-5" />
            </Link>
            <Link href="https://discord.com/invite/clawd" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
