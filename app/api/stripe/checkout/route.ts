/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICE_IDS, type PlanKey } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

// POST /api/stripe/checkout — Create a Stripe Checkout Session
// Body: { plan: 'pro' | 'enterprise' | 'featured_listing', agent_id?: string }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, agent_id } = body as { plan: PlanKey; agent_id?: string };

    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be one of: pro, enterprise, featured_listing' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Build checkout metadata
    const metadata: Record<string, string> = {
      user_id: user.id,
      user_email: user.email || '',
      plan,
    };
    if (agent_id) {
      metadata.agent_id = agent_id;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_IDS[plan],
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${siteUrl}/pricing?canceled=true`,
      metadata,
      subscription_data: {
        metadata,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return NextResponse.json({ url: session.url, session_id: session.id });
  } catch (error) {
    console.error('[Stripe Checkout] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
