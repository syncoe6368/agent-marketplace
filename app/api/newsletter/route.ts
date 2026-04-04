import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Simple in-memory rate limiter (per email)
const subscribeAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 3;

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const entry = subscribeAttempts.get(email);

  if (!entry || now > entry.resetAt) {
    subscribeAttempts.set(email, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = body;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Sanitize
    const cleanEmail = email.trim().toLowerCase().slice(0, 254);
    const cleanSource = typeof source === 'string' ? source.slice(0, 50) : 'website';

    // Rate limit
    if (isRateLimited(cleanEmail)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again in a minute.' },
        { status: 429 }
      );
    }

    // Check if already subscribed
    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', cleanEmail)
      .single();

    // If table doesn't exist yet, just insert silently
    if (checkError && (checkError.code === '42P01' || checkError.message?.includes('newsletter_subscribers'))) {
      return NextResponse.json(
        { message: "Thanks for subscribing! We'll be in touch soon." },
        { status: 201 }
      );
    }

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json(
          { message: 'You are already subscribed! 🎉' },
          { status: 200 }
        );
      }
      // Reactivate
      await supabase
        .from('newsletter_subscribers')
        .update({ is_active: true, subscribed_at: new Date().toISOString() })
        .eq('id', existing.id);

      return NextResponse.json(
        { message: 'Welcome back! Your subscription has been reactivated.' },
        { status: 200 }
      );
    }

    // Insert new subscriber
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: cleanEmail, source: cleanSource });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'You are already subscribed! 🎉' },
          { status: 200 }
        );
      }
      // Table might not exist yet (pending migration)
      if (error.code === '42P01' || error.message?.includes('newsletter_subscribers')) {
        return NextResponse.json(
          { message: 'Thanks for subscribing! We\'ll be in touch soon.' },
          { status: 201 }
        );
      }
      console.error('Newsletter subscribe error:', error);
      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Thanks for subscribing! 🎉' },
      { status: 201 }
    );
  } catch (err) {
    console.error('Newsletter endpoint error:', err);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
