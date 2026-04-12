import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { PricingButton } from './pricing-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Pricing - AgentHub',
  description: 'Launch special: Free agent listings for the first month. Choose your plan to maximize your agent\'s visibility and sales.',
};

const plans = [
  {
    name: 'Free Discovery',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Up to 3 agent listings',
      'Basic analytics (views)',
      'Community support',
      'Standard placement in search',
      'Up to 3 skill packages',
    ],
    cta: 'Get Started Free',
    href: '/auth/signup',
    plan: 'free' as const,
    popular: false,
  },
  {
    name: 'Featured Discovery',
    price: '$9',
    period: '/month',
    description: 'Launch special - 50% off',
    features: [
      'Top search placement',
      'Priority review',
      'Basic analytics dashboard',
      'Boosted visibility',
      'Email support',
      'Up to 10 skill packages',
    ],
    cta: 'Start Free Trial',
    plan: 'featured' as const,
    popular: true,
    badge: 'Launch Special',
  },
  {
    name: 'Pro Discovery',
    price: '$49',
    period: '/month',
    description: 'For serious creators & agencies',
    features: [
      'Everything in Featured',
      'Unlimited agent listings',
      'Advanced analytics & insights',
      'Custom branding options',
      'API access (1,000 requests/month)',
      'Priority support',
      'Unlimited skill packages',
    ],
    cta: 'Start Pro Trial',
    plan: 'pro' as const,
    popular: false,
  },
];

import { PricingStrategySection } from './strategy-section';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full mb-4">
            <span className="font-semibold">🚀 LAUNCH WEEK SPECIAL</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Launch special: Free listings for the first month. Featured plans at 50% off. Start selling your AI agents today.
          </p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? 'border-indigo-600 shadow-lg scale-105' : ''}`}
          >
            {plan.badge && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500">
                {plan.badge}
              </Badge>
            )}
            {plan.popular && !plan.badge && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <PricingButton
                plan={plan.plan}
                label={plan.cta}
                popular={plan.popular}
                href={plan.plan === 'free' ? '/auth/signup' : undefined}
              />
            </CardContent>
          </Card>
        ))}
      </div>
      <PricingStrategySection />
      </div>
    </div>
  );
}
