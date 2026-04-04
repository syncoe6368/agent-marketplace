'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GitCompare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COMPARE_KEY = 'agenthub_compare';

function getCompareList(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function CompareTray() {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => {
      const list = getCompareList();
      setCount(list.length);
      setVisible(list.length > 0);
    };
    sync();
    window.addEventListener('agenthub_compare_change', sync);
    // Also check on storage changes from other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === COMPARE_KEY) sync();
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('agenthub_compare_change', sync);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  if (!visible) return null;

  const slugs = getCompareList();
  const href = `/compare?agents=${slugs.join(',')}`;

  const clearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem(COMPARE_KEY, '[]');
    setCount(0);
    setVisible(false);
    window.dispatchEvent(new Event('agenthub_compare_change'));
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="flex items-center gap-3 rounded-full border bg-background/95 backdrop-blur shadow-lg px-4 py-2.5">
        <GitCompare className="h-4 w-4 text-primary shrink-0" />
        <span className="text-sm font-medium whitespace-nowrap">
          {count} agent{count !== 1 ? 's' : ''} selected
        </span>
        <Link href={href}>
          <Button size="sm" className="rounded-full text-xs px-4">
            Compare Now
          </Button>
        </Link>
        <button
          onClick={clearAll}
          className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="Clear comparison"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
