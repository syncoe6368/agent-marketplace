'use client';

import { useState, useEffect, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface BookmarkButtonProps {
  agentId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export function BookmarkButton({ agentId, size = 'md', className = '', showLabel = false }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    return !!session;
  }, []);

  const checkBookmark = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('agent_id', agentId)
      .maybeSingle();
    setIsBookmarked(!!data);
    setLoading(false);
  }, [agentId]);

  useEffect(() => {
    checkAuth().then(async (authed) => {
      if (authed) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          await checkBookmark(session.user.id);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const authed = !!session;
      setIsAuthenticated(authed);
      if (authed && session?.user?.id) {
        await checkBookmark(session.user.id);
      } else {
        setIsBookmarked(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [agentId, checkAuth, checkBookmark]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/auth/login?redirect=' + encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : ''));
      return;
    }

    setToggling(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', session.user.id)
          .eq('agent_id', agentId);
        setIsBookmarked(false);
      } else {
        await supabase
          .from('bookmarks')
          .insert({ user_id: session.user.id, agent_id: agentId });
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    } finally {
      setToggling(false);
    }
  };

  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  const btnSize = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-10 w-10' : 'h-8 w-8';

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`${btnSize} ${className} group/bookmark ${toggling ? 'animate-pulse' : ''}`}
      onClick={toggle}
      disabled={loading || toggling}
      aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      <Heart
        className={`${iconSize} transition-all duration-200 ${
          isBookmarked
            ? 'fill-red-500 text-red-500 scale-110'
            : 'text-muted-foreground group-hover/bookmark:text-red-400 group-hover/bookmark:scale-110'
        } ${toggling ? 'animate-bounce' : ''}`}
      />
      {showLabel && (
        <span className="text-xs ml-1.5 text-muted-foreground group-hover/bookmark:text-foreground">
          {isBookmarked ? 'Saved' : 'Save'}
        </span>
      )}
    </Button>
  );
}
