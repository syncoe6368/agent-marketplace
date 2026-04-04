import type { Metadata } from 'next';
import { Check, HelpCircle, Bot, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
    icon: Bot,
    features: [
      'Up to 3 agent listings',
      'Basic analytics (views)',
      'Community support',
      'Standard placement',
      'Public reviews & ratings',
    ],
    cta: 'Get Started Free',
    href: '/auth/signup',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For serious agent builders',
    icon: Zap,
    features: [
      'Unlimited agent listings',
      'Advanced analytics',
      'Featured placement',
      'Verified badge',
      'Priority support',
      'Custom branding',
      'Skill package hosting',
    ],
    cta: 'Start Pro Trial',
    href: '/auth/signup',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For teams and organizations',
    icon: Shield,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'White-label options',
    ],
    cta: 'Contact Sales',
    href: '#',
    popular: false,
  },
];

const faqs = [
  {
    q: 'Can I change plans later?',
    a: 'Absolutely. Upgrade or downgrade at any time. Changes take effect immediately and we prorate billing automatically.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'Yes! Pro comes with a 14-day free trial. No credit card required to start.',
  },
  {
    q: 'What counts as an agent listing?',
    a: 'Each unique AI agent you submit counts as one listing. This includes variations (e.g., different versions or configurations of the same agent).',
  },
  {
    q: 'How does the featured placement work?',
    a: 'Pro and Enterprise agents get priority placement in browse results and a spotlight on the homepage. Enterprise users can request specific placement targeting.',
  },
  {
    q: 'Can I list agents for free indefinitely?',
    a: 'Yes — the Free plan lets you list up to 3 agents forever. You only pay when you need more listings or premium features.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards, PayPal, and bank transfers (Enterprise). All payments are processed securely through Stripe.',
  },
];

export default async function PricingPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(c) { try { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {} },
      },
    }
  );

  const [{ count: totalAgents }, { count: totalCategories }, { count: totalReviews }] = await Promise.all([
    supabase.from('agents').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase.from('reviews').select('id', { count: 'exact', head: true }),
  ]);

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header with live stats */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that works for you. Upgrade or downgrade at any time.
        </p>
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Bot className="h-4 w-4 text-primary" />
            <span><strong className="text-foreground">{totalAgents || 0}</strong> agents listed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span><strong className="text-foreground">{totalCategories || 0}</strong> categories</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-primary" />
            <span><strong className="text-foreground">{totalReviews || 0}</strong> reviews</span>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-2 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <plan.icon className="h-5 w-5 text-primary" />
              </div>
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
              <Link href={plan.href}>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          </div>
          <p className="text-muted-foreground">Everything you need to know about AgentHub pricing</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.q}>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <p className="text-muted-foreground mb-4">
          Still have questions? We&apos;re happy to help.
        </p>
        <Link href="/auth/signup">
          <Button size="lg" variant="outline">
            Get Started Free
          </Button>
        </Link>
      </div>
    </div>
  );
}
