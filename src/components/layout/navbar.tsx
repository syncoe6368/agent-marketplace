import Link from 'next/link';
import { Search, Menu, X, Bot, GitCompare, TrendingUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { SignOutButton } from './sign-out-button';
import { ThemeToggle } from './theme-toggle';
import { MobileNav } from './mobile-nav';

export async function Navbar() {
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Bot className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">AgentHub</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/agents" className="text-muted-foreground hover:text-foreground transition-colors">
              Browse Agents
            </Link>
            <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
              Categories
            </Link>
            <Link href="/compare" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <GitCompare className="h-3.5 w-3.5" />
              Compare
            </Link>
            <Link href="/trending" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <TrendingUp className="h-3.5 w-3.5" />
              Trending
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/skills" className="text-muted-foreground hover:text-foreground transition-colors">
              Skills
            </Link>
            <Link href="/api-docs" className="text-muted-foreground hover:text-foreground transition-colors">
              API
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/submit">
                <Button size="sm">List Agent</Button>
              </Link>
              <Link href="/bookmarks">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Heart className="h-3.5 w-3.5" />
                  Saved
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
          <MobileNav user={!!user} />
        </div>
      </div>
    </header>
  );
}
