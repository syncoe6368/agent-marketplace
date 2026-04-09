'use client';

import { loadStripe, type Stripe } from '@stripe/stripe-js';

// Singleton pattern to avoid multiple Stripe instances
let stripePromise: Promise<Stripe | null>;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.warn('[Stripe] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not set');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}

// Redirect to Stripe Checkout
export async function redirectToCheckout(plan: 'pro' | 'enterprise' | 'featured_listing', agentId?: string) {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error('Stripe not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.');
  }

  const response = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, agent_id: agentId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  const { url } = await response.json();

  if (url) {
    window.location.href = url;
  }
}

// Redirect to Stripe Customer Portal
export async function redirectToPortal() {
  const response = await fetch('/api/stripe/portal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create portal session');
  }

  const { url } = await response.json();

  if (url) {
    window.location.href = url;
  }
}

// Get current subscription status
export async function getSubscriptionStatus() {
  const response = await fetch('/api/stripe/status');
  if (!response.ok) {
    throw new Error('Failed to get subscription status');
  }
  return response.json();
}
