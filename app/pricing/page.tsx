import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { PricingButton } from './pricing-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for AgentHub. List your AI agents and reach thousands of users.',
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Up to 3 agent listings',
      'Basic analytics (views)',
      'Community support',
      'Standard placement',
    ],
    cta: 'Get Started Free',
    href: '/auth/signup',
    plan: 'free' as const,
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For serious agent builders',
    features: [
      'Unlimited agent listings',
      'Advanced analytics',
      'Featured placement',
      'Verified badge',
      'Priority support',
      'Custom branding',
    ],
    cta: 'Start Pro Trial',
    plan: 'pro' as const,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    plan: 'enterprise' as const,
    popular: false,
  },
];

import { PricingStrategySection } from './strategy-section';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works for you. Upgrade or downgrade at any time.
          </p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? 'border-indigo-600 shadow-lg scale-105' : ''}`}
          >
            {plan.popular && (
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
  );
}
