'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, ExternalLink, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgentCard } from '@/components/agents/agent-card';
import { supabase } from '@/lib/supabase/client';
import { formatPrice, formatDate } from '@/lib/utils';

interface BookmarkAgent {
  bookmark_id: string;
  bookmarked_at: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  pricing_model: string;
  price_amount: number | null;
  currency: string;
  logo_url: string | null;
  tags: string[] | null;
  is_featured: boolean;
  is_verified: boolean;
  views_count: number;
  average_rating: number;
  review_count: number;
  category?: { id: string; name: string; slug: string } | null;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      const { data, error } = await supabase
        .from('bookmarks')
        .select('id, created_at, agent:agents(*, category:categories(id, name, slug), reviews(rating))')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch bookmarks:', error);
        setLoading(false);
        return;
      }

      // Flatten and compute rating
      const agents = (data || []).map((b: any) => {
        const agent = b.agent as any;
        const reviews = agent?.reviews || [];
        const avgRating = reviews.length > 0
          ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
          : 0;
        return {
          bookmark_id: b.id,
          bookmarked_at: b.created_at,
          id: agent.id,
          name: agent.name,
          slug: agent.slug,
          description: agent.description,
          pricing_model: agent.pricing_model,
          price_amount: agent.price_amount,
          currency: agent.currency,
          logo_url: agent.logo_url,
          tags: agent.tags,
          is_featured: agent.is_featured,
          is_verified: agent.is_verified,
          views_count: agent.views_count,
          average_rating: avgRating,
          review_count: reviews.length,
          category: agent.category,
        } as BookmarkAgent;
      }).filter(Boolean);

      setBookmarks(agents);
      setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      init();
    });
    return () => subscription.unsubscribe();
  }, []);

  const sorted = [...bookmarks].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.bookmarked_at).getTime() - new Date(a.bookmarked_at).getTime();
    if (sortBy === 'oldest') return new Date(a.bookmarked_at).getTime() - new Date(b.bookmarked_at).getTime();
    return a.name.localeCompare(b.name);
  });

  if (!isAuthenticated && !loading) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Heart className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Sign in to view your bookmarks</h1>
        <p className="text-muted-foreground mb-6">
          Save agents you&apos;re interested in and come back to them later.
        </p>
        <Link href="/auth/login">
          <Button size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Bookmarks</h1>
            <p className="text-sm text-muted-foreground">
              {bookmarks.length} agent{bookmarks.length !== 1 ? 's' : ''} saved
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {bookmarks.length > 1 && (
            <div className="flex bg-muted rounded-lg p-0.5">
              {(['newest', 'oldest', 'name'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    sortBy === opt
                      ? 'bg-background shadow-sm font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt === 'newest' ? 'Newest' : opt === 'oldest' ? 'Oldest' : 'A-Z'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && bookmarks.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No bookmarks yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Browse agents and tap the heart icon to save them here for quick access.
          </p>
          <Link href="/agents">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse Agents
            </Button>
          </Link>
        </div>
      )}

      {/* Bookmarks grid */}
      {!loading && bookmarks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((agent) => (
            <AgentCard key={agent.id} agent={agent} showCompare={false} />
          ))}
        </div>
      )}
    </div>
  );
}
