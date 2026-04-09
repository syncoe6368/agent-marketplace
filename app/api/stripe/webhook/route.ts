// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

// Stripe Webhook Handler
// Handles: checkout.session.completed, customer.subscription.updated,
//          customer.subscription.deleted, invoice.payment_failed

// Disable body parsing — Stripe needs raw body for signature verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('[Stripe Webhook] Missing signature or webhook secret');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 400 });
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent> | null = null;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { user_id, plan, agent_id } = session.metadata || {};

        if (!user_id || !plan) {
          console.error('[Stripe Webhook] Missing metadata in checkout session:', session.id);
          break;
        }

        // Activate subscription for user
        const subscriptionData: Record<string, unknown> = {
          user_id,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          plan,
          status: 'active',
          current_period_start: new Date(),
          current_period_end: null, // Will be updated from invoice
          created_at: new Date().toISOString(),
        };

        // Insert or update subscription
        const { error: subError } = await supabase
          .from('subscriptions')
          .upsert(subscriptionData, { onConflict: 'user_id' });

        if (subError) {
          console.error('[Stripe Webhook] Failed to save subscription:', subError);
        }

        // If featured listing, update the agent
        if (plan === 'featured_listing' && agent_id) {
          const { error: agentError } = await supabase
            .from('agents')
            .update({
              featured: true,
              featured_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .eq('id', agent_id)
            .eq('creator_id', user_id);

          if (agentError) {
            console.error('[Stripe Webhook] Failed to feature agent:', agentError);
          }
        }

        // If Pro/Enterprise plan, grant verified badge
        if (plan === 'pro' || plan === 'enterprise') {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ verified: true, plan })
            .eq('id', user_id);

          if (profileError) {
            console.error('[Stripe Webhook] Failed to update profile:', profileError);
          }
        }

        console.log(`[Stripe Webhook] Checkout completed: user=${user_id} plan=${plan}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const { user_id } = subscription.metadata || {};

        if (!user_id) break;

        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_end: new Date((subscription as { current_period_end: number }).current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('[Stripe Webhook] Failed to update subscription:', error);
        }

        console.log(`[Stripe Webhook] Subscription updated: user=${user_id} status=${subscription.status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const { user_id } = subscription.metadata || {};

        if (!user_id) break;

        // Downgrade to free
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled', plan: 'free' })
          .eq('stripe_subscription_id', subscription.id);

        // Remove verified badge and featured status
        await supabase
          .from('profiles')
          .update({ verified: false, plan: 'free' })
          .eq('id', user_id);

        // Unfeature all agents
        await supabase
          .from('agents')
          .update({ featured: false, featured_until: null })
          .eq('creator_id', user_id);

        console.log(`[Stripe Webhook] Subscription canceled: user=${user_id}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customer = invoice.customer as string;

        // Log payment failure — could trigger email notification
        console.warn(`[Stripe Webhook] Payment failed for customer: ${customer}`);

        // Update subscription status to past_due
        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_customer_id', customer);

        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error('[Stripe Webhook] Handler error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
