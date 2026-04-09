'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Loader2, CreditCard, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

const planLabels: Record<string, { name: string; description: string }> = {
  pro: {
    name: 'Pro Plan',
    description: 'You now have unlimited listings, featured placement, and a verified badge.',
  },
  enterprise: {
    name: 'Enterprise Plan',
    description: 'Your team now has full API access, custom integrations, and dedicated support.',
  },
  featured_listing: {
    name: 'Featured Listing',
    description: 'Your agent is now featured at the top of search results for 30 days.',
  },
};

export function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'pro';
  const sessionId = searchParams.get('session_id');
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  const planInfo = planLabels[plan] || planLabels.pro;

  useEffect(() => {
    // Verify the session with Stripe
    async function verify() {
      try {
        const res = await fetch('/api/stripe/status');
        if (res.ok) {
          const data = await res.json();
          if (data.subscription?.status === 'active') {
            setVerified(true);
          }
        }
      } catch {
        // Non-critical — user still sees success page
      } finally {
        setVerifying(false);
      }
    }
    verify();
  }, []);

  return (
    <Card className="border-green-200 dark:border-green-900">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        <CardDescription className="text-base">
          Welcome to AgentHub {planInfo.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-muted-foreground">
          {planInfo.description}
        </p>

        {verifying && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying your subscription...
          </div>
        )}

        {verified && (
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 text-sm text-green-700 dark:text-green-300">
            ✓ Subscription verified and active
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span>Confirmation sent to your email</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span>Manage billing anytime from your dashboard</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span>Your new features are available immediately</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link href="/dashboard">
            <Button className="w-full" size="lg">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/submit">
            <Button variant="outline" className="w-full">
              List a New Agent
            </Button>
          </Link>
        </div>

        {sessionId && (
          <p className="text-xs text-center text-muted-foreground pt-2">
            Session: {sessionId.slice(0, 16)}...
          </p>
        )}
      </CardContent>
    </Card>
  );
}
