import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

// POST /api/admin/moderate — approve, suspend, feature, verify, unfeature agents
export async function POST(request: NextRequest) {
  // Rate limit
  const rl = rateLimit(request, RATE_LIMITS.write);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: rl.headers });
  }

  // Auth check
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Admin role check
  const isAdmin = user.user_metadata?.role === 'admin';
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
  }

  // Parse body
  const body = await request.json();
  const { agentId, action } = body as { agentId: string; action: string };

  if (!agentId || !action) {
    return NextResponse.json({ error: 'Missing agentId or action' }, { status: 400 });
  }

  // Determine update payload based on action
  let updatePayload: Record<string, unknown> = {};
  let successMessage = '';

  switch (action) {
    case 'approve':
      updatePayload = { status: 'active' };
      successMessage = 'Agent approved and now active';
      break;
    case 'suspend':
      updatePayload = { status: 'suspended' };
      successMessage = 'Agent suspended';
      break;
    case 'feature':
      updatePayload = { is_featured: true };
      successMessage = 'Agent marked as featured';
      break;
    case 'unfeature':
      updatePayload = { is_featured: false };
      successMessage = 'Agent unfeatured';
      break;
    case 'verify':
      updatePayload = { is_verified: true };
      successMessage = 'Agent verified';
      break;
    case 'unverify':
      updatePayload = { is_verified: false };
      successMessage = 'Agent unverified';
      break;
    default:
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  }

  // Apply update
  const { error } = await supabase
    .from('agents')
    .update(updatePayload)
    .eq('id', agentId);

  if (error) {
    console.error('Admin moderate error:', error);
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: successMessage });
}
