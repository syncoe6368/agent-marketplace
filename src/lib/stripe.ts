// Stripe stub — replace with real Stripe integration when ready
// This allows the build to succeed while Stripe is not yet configured

export type PlanKey = 'pro' | 'enterprise' | 'featured_listing';

export const PRICE_IDS: Record<PlanKey, string> = {
  pro: process.env.STRIPE_PRICE_PRO || 'price_pro_placeholder',
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise_placeholder',
  featured_listing: process.env.STRIPE_PRICE_FEATURED || 'price_featured_placeholder',
};

export const stripe = {
  checkout: {
    sessions: {
      create: async () => {
        throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY environment variable.');
      },
    },
  },
  customers: {
    create: async () => {
      throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY environment variable.');
    },
  },
  billingPortal: {
    sessions: {
      create: async () => {
        throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY environment variable.');
      },
    },
  },
  webhooks: {
    constructEvent: () => {
      throw new Error('Stripe is not configured.');
    },
  },
};
