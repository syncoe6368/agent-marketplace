'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface BookmarkCountProps {
  agentId: string;
}

export function BookmarkCount({ agentId }: BookmarkCountProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('agent_id', agentId);
      setCount(count);
    };

    fetchCount();
  }, [agentId]);

  if (count === null || count === 0) return null;

  return (
    <span className="text-sm text-muted-foreground">
      {count} {count === 1 ? 'save' : 'saves'}
    </span>
  );
}
