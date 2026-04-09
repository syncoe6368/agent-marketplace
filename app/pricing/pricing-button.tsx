'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface PricingButtonProps {
  plan: 'free' | 'pro' | 'enterprise';
  label: string;
  popular: boolean;
  href?: string;
}

export function PricingButton({ plan, label, popular, href }: PricingButtonProps) {
  const [loading, setLoading] = useState(false);

  // Free plan → signup page
  if (plan === 'free' && href) {
    return (
      <Link href={href} className="block">
        <Button className="w-full" variant="outline">
          {label}
        </Button>
      </Link>
    );
  }

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        // If not authenticated, redirect to signup
        if (res.status === 401) {
          window.location.href = '/auth/signup?redirect=/pricing';
          return;
        }
        const err = await res.json();
        throw new Error(err.error || 'Failed to start checkout');
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('[Pricing] Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      className="w-full"
      variant={popular ? 'default' : 'outline'}
      onClick={handleClick}
      disabled={loading}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? 'Redirecting...' : label}
    </Button>
  );
}
