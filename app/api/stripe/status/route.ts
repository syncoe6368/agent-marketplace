// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

// GET /api/stripe/status — Get current user's subscription status
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan, status, current_period_end')
      .eq('user_id', user.id)
      .single();

    const { data: profile } = await supabase
      .from('profiles')
      .select('verified, plan')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      subscription: subscription || { plan: 'free', status: 'none' },
      profile: profile || { verified: false, plan: 'free' },
    });
  } catch (error) {
    console.error('[Stripe Status] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    );
  }
}
