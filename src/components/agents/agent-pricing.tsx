'use client';

import { useState } from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface AgentPricingProps {
  name: string;
  pricingModel: string;
  priceAmount: number | null;
  currency: string;
  pricingTierFree?: { features: string[]; limits: string } | null;
  pricingTierPaid?: {
    features: string[];
    price_monthly?: number;
    price_annual?: number;
    popular?: boolean;
  } | null;
}

export function AgentPricing({
  name,
  pricingModel,
  priceAmount,
  currency,
  pricingTierFree,
  pricingTierPaid,
}: AgentPricingProps) {
  const [annual, setAnnual] = useState(false);

  const fmtPrice = (amount: number | null | undefined) => {
    if (!amount) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  // Derive tiers from pricing model if no explicit data
  const freeFeatures = pricingTierFree?.features || (
    pricingModel === 'free'
      ? ['Full access', 'Community support', 'All integrations', 'Unlimited usage']
      : pricingModel === 'freemium'
        ? ['Basic usage (100 req/day)', 'Community support', 'Core integrations', 'Standard models']
        : ['7-day free trial', 'Full feature access', 'Community support']
  );

  const freeLimits = pricingTierFree?.limits || (
    pricingModel === 'free' ? 'No limits' : pricingModel === 'freemium' ? '100 requests/day' : '7-day trial'
  );

  const paidFeatures = pricingTierPaid?.features || (
    pricingModel === 'subscription'
      ? ['Unlimited requests', 'Priority support', 'All integrations', 'Advanced models', 'Custom workflows', 'Team management', 'Analytics dashboard']
      : pricingModel === 'freemium'
        ? ['Unlimited requests', 'Priority support', 'Premium integrations', 'Advanced models', 'Custom workflows']
        : pricingModel === 'paid'
          ? ['Lifetime access', 'All future updates', 'Priority support', 'All integrations', 'Advanced features']
          : ['Enhanced capabilities', 'Priority access', 'Premium support']
  );

  const monthlyPrice = pricingTierPaid?.price_monthly || (pricingModel !== 'free' ? priceAmount : null);
  const annualPrice = pricingTierPaid?.price_annual || (monthlyPrice ? monthlyPrice * 10 : null); // ~2 months free
  const isPopular = pricingTierPaid?.popular || pricingModel === 'subscription';

  if (pricingModel === 'free') {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5 text-green-600" />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
            <p className="text-3xl font-bold text-green-700 dark:text-green-400">Free</p>
            <p className="text-sm text-muted-foreground mt-1">No credit card required</p>
            <div className="mt-4 space-y-2 text-left">
              {freeFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-primary" />
          Pricing Plans
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Billing toggle */}
        {pricingModel === 'subscription' && (
          <div className="flex items-center justify-center gap-2">
            <span className={`text-sm ${!annual ? 'font-medium' : 'text-muted-foreground'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                annual ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  annual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${annual ? 'font-medium' : 'text-muted-foreground'}`}>
              Annual <Badge variant="secondary" className="ml-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Save 17%</Badge>
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {/* Free Tier */}
          {(pricingModel === 'freemium' || pricingModel === 'paid') && (
            <div className="relative p-4 rounded-lg border bg-card">
              <p className="font-semibold">Free</p>
              <p className="text-2xl font-bold mt-1">$0</p>
              <p className="text-xs text-muted-foreground mt-1">{freeLimits}</p>
              <Separator className="my-3" />
              <div className="space-y-1.5">
                {freeFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paid Tier */}
          <div className="relative p-4 rounded-lg border-2 border-primary/30 bg-card">
            {isPopular && (
              <Badge className="absolute -top-2.5 right-3 bg-primary text-primary-foreground text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            )}
            <p className="font-semibold">
              {pricingModel === 'subscription' ? 'Pro' : pricingModel === 'freemium' ? 'Premium' : 'Full License'}
            </p>
            <p className="text-2xl font-bold mt-1">
              {annual && annualPrice
                ? fmtPrice(annualPrice)
                : fmtPrice(monthlyPrice)}
              <span className="text-sm font-normal text-muted-foreground">
                {pricingModel === 'subscription'
                  ? annual ? '/year' : '/month'
                  : ' one-time'}
              </span>
            </p>
            <Separator className="my-3" />
            <div className="space-y-1.5">
              {paidFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" size="sm">
              Get {pricingModel === 'subscription' ? 'Pro' : 'Access'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
