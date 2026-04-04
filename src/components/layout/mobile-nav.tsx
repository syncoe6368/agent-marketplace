'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Bot, GitCompare, TrendingUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

interface MobileNavProps {
  user: boolean;
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetTitle className="flex items-center gap-2 mb-6">
          <Bot className="h-5 w-5 text-primary" />
          AgentHub
        </SheetTitle>
        <nav className="flex flex-col gap-3">
          <Link href="/agents" onClick={() => setOpen(false)} className="text-lg hover:text-primary transition-colors">
            Browse Agents
          </Link>
          <Link href="/categories" onClick={() => setOpen(false)} className="text-lg hover:text-primary transition-colors">
            Categories
          </Link>
          <Link href="/compare" onClick={() => setOpen(false)} className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
            <GitCompare className="h-4 w-4" />
            Compare
          </Link>
          <Link href="/trending" onClick={() => setOpen(false)} className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
            <TrendingUp className="h-4 w-4" />
            Trending
          </Link>
          <Link href="/pricing" onClick={() => setOpen(false)} className="text-lg hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="/skills" onClick={() => setOpen(false)} className="text-lg hover:text-primary transition-colors">
            Skills
          </Link>
          <Link href="/api-docs" onClick={() => setOpen(false)} className="text-lg hover:text-primary transition-colors">
            API
          </Link>
          <hr className="my-2" />
          {user ? (
            <>
              <Link href="/bookmarks" onClick={() => setOpen(false)} className="flex items-center gap-2 text-lg hover:text-primary transition-colors">
                <Heart className="h-4 w-4" />
                Saved Agents
              </Link>
              <Link href="/submit" onClick={() => setOpen(false)}>
                <Button className="w-full">List Your Agent</Button>
              </Link>
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">Dashboard</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
