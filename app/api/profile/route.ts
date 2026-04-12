import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizePlainText, sanitizeUrl, FIELD_LIMITS } from '@/lib/sanitize';

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }

  return NextResponse.json({ profile });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { full_name, bio, avatar_url } = body as { full_name?: string; bio?: string; avatar_url?: string };

  // ─── Input Sanitization ──────────────────────────────────────
  const sanitizedName = full_name != null
    ? sanitizePlainText(String(full_name), FIELD_LIMITS.profileFullName)
    : undefined;
  const sanitizedBio = bio != null
    ? sanitizePlainText(String(bio), FIELD_LIMITS.profileBio)
    : undefined;
  const sanitizedAvatar = avatar_url != null
    ? sanitizeUrl(avatar_url)
    : undefined;

  // Build update object with only provided fields
  const updates: Record<string, unknown> = {};
  if (sanitizedName !== undefined) updates.full_name = sanitizedName;
  if (sanitizedBio !== undefined) updates.bio = sanitizedBio;
  if (sanitizedAvatar !== undefined) updates.avatar_url = sanitizedAvatar;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const { data: updated, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }

  return NextResponse.json({ profile: updated });
}
