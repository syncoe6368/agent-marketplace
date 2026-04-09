import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { SuccessContent } from './success-content';

export const metadata: Metadata = {
  title: 'Payment Successful — AgentHub',
  description: 'Your subscription is now active. Welcome to AgentHub Pro!',
  robots: 'noindex',
};

export default function PricingSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <Suspense
        fallback={
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
