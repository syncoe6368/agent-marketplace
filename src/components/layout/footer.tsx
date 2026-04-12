import Link from 'next/link';
import { Bot, GitFork, MessageCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { FeedbackInline } from '@/components/feedback-inline';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Bot className="h-6 w-6 text-indigo-600" />
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
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Resources</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/compare" className="hover:text-foreground transition-colors">Compare Agents</Link>
              <Link href="/changelog" className="hover:text-foreground transition-colors">Changelog</Link>
              <Link href="https://github.com/syncoe6368/agent-marketplace" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub ↗</Link>
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

        {/* Inline feedback */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">Have feedback? We&apos;d love to hear it.</p>
          <FeedbackInline />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AgentHub. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by <a href="https://syncoe.com" className="hover:text-foreground transition-colors">Syncoe</a>
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://github.com/syncoe6368/agent-marketplace" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title="GitHub">
              <GitFork className="h-5 w-5" />
            </Link>
            <Link href="https://discord.com/invite/clawd" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title="Discord">
              <MessageCircle className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
