'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme, forcedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 flex items-center justify-center">
        <Monitor className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  // Cycle: light → dark → system → light
  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const icon =
    resolvedTheme === 'dark' ? (
      <Sun className="h-4 w-4" />
    ) : theme === 'system' ? (
      <Monitor className="h-4 w-4" />
    ) : (
      <Moon className="h-4 w-4" />
    );

  return (
    <Button variant="ghost" size="icon" onClick={cycleTheme}>
      {icon}
      <span className="sr-only">
        {resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
    </Button>
  );
}
