import Stripe from 'stripe';

// Initialize Stripe server-side client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil',
  typescript: true,
});

// Price IDs — configure in Stripe Dashboard and set in .env
// For launch, we create these in Stripe as recurring products
export const PRICE_IDS = {
  pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_monthly',
  featured_listing: process.env.STRIPE_FEATURED_LISTING_PRICE_ID || 'price_featured_listing_monthly',
  verified_badge: process.env.STRIPE_VERIFIED_BADGE_PRICE_ID || 'price_verified_badge',
} as const;

// Plan metadata for checkout
export const PLANS = {
  pro: {
    name: 'Pro Plan',
    priceId: PRICE_IDS.pro,
    amount: 1900, // $19.00 in cents
    features: [
      'Unlimited agent listings',
      'Advanced analytics',
      'Featured placement',
      'Verified badge',
      'Priority support',
      'Custom branding',
    ],
  },
  enterprise: {
    name: 'Enterprise Plan',
    priceId: PRICE_IDS.enterprise,
    amount: 9900, // $99.00 in cents
    features: [
      'Everything in Pro',
      'Team collaboration',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
    ],
  },
  featured_listing: {
    name: 'Featured Listing',
    priceId: PRICE_IDS.featured_listing,
    amount: 1900, // $19.00/month
    description: 'Boost your agent listing to the top of search results',
  },
  verified_badge: {
    name: 'Verified Agent Badge',
    priceId: PRICE_IDS.verified_badge,
    amount: 0, // Included in Pro plan
    description: 'Show users your agent is verified and trusted',
  },
} as const;

export type PlanKey = keyof typeof PLANS;
