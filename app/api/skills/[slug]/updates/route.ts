import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * GET /api/skills/[slug]/updates
 * Check for available updates for a skill package.
 *
 * Query params:
 *   current_version — The version the user currently has installed (required)
 *
 * Response includes:
 *   - latestVersion: The latest available version
 *   - updateAvailable: Boolean indicating if current_version < latestVersion
 *   - versionsSince: Array of versions released since current_version
 *   - totalChangelog: Combined changelog entries since current_version
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Prevent directory traversal
  if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  const searchParams = request.nextUrl.searchParams;
  const currentVersion = searchParams.get('current_version');

  if (!currentVersion) {
    return NextResponse.json(
      { error: 'current_version query parameter is required' },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Get all versions for this slug, ordered by creation date
  const { data: allVersions, error } = await supabase
    .from('skill_versions')
    .select('version, previous_version, changelog, created_at')
    .eq('slug', slug)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch version history', details: error.message },
      { status: 500 }
    );
  }

  if (!allVersions || allVersions.length === 0) {
    return NextResponse.json({
      slug,
      currentVersion,
      latestVersion: null,
      updateAvailable: false,
      versionsSince: [],
      message: 'No version history found for this skill package',
    });
  }

  const latestVersion = allVersions[0].version;
  const updateAvailable = compareSemver(currentVersion, latestVersion) < 0;

  // Find versions released after the user's current version
  const versionsSince: typeof allVersions = [];
  let foundCurrent = false;
  for (const v of allVersions) {
    if (v.version === currentVersion) {
      foundCurrent = true;
      break;
    }
    versionsSince.push(v);
  }

  // If we didn't find the exact version, use semver comparison
  if (!foundCurrent) {
    versionsSince.length = 0;
    for (const v of allVersions) {
      if (compareSemver(currentVersion, v.version) < 0) {
        versionsSince.push(v);
      }
    }
  }

  // Build combined changelog
  const totalChangelog = versionsSince
    .map((v) => `## v${v.version}\n${v.changelog || 'No changelog provided.'}`)
    .join('\n\n');

  return NextResponse.json({
    slug,
    currentVersion,
    latestVersion,
    updateAvailable,
    versionsBehind: versionsSince.length,
    versionsSince: versionsSince.map((v) => ({
      version: v.version,
      changelog: v.changelog || null,
      date: v.created_at,
    })),
    totalChangelog: versionsSince.length > 0 ? totalChangelog : null,
  });
}

/**
 * POST /api/skills/[slug]/updates
 * Subscribe to update notifications for a skill package.
 *
 * Body:
 *   notify_via — "email" | "webhook" | "in-app" (default: "in-app")
 *   webhook_url — Required if notify_via is "webhook"
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Rate limiting
  const rl = rateLimit(request, RATE_LIMITS.write);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: rl.headers });
  }

  // Authentication required
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const notifyVia = (['email', 'webhook', 'in-app'].includes(body.notify_via as string) ? body.notify_via : 'in-app') as 'email' | 'webhook' | 'in-app';
  const webhookUrl = body.webhook_url as string | undefined;

  if (!['email', 'webhook', 'in-app'].includes(notifyVia)) {
    return NextResponse.json(
      { error: 'notify_via must be one of: email, webhook, in-app' },
      { status: 400 }
    );
  }

  if (notifyVia === 'webhook' && !webhookUrl) {
    return NextResponse.json(
      { error: 'webhook_url is required when notify_via is "webhook"' },
      { status: 400 }
    );
  }

  // Get current version of the skill package
  const { readFile } = await import('fs/promises');
  const { join } = await import('path');
  const { existsSync } = await import('fs');
  const SKILLS_DIR = join(process.cwd(), 'skill-packages');
  const skillJsonPath = join(SKILLS_DIR, slug, 'skill.json');

  let currentVersion = '0.0.0';
  if (existsSync(skillJsonPath)) {
    try {
      const raw = await readFile(skillJsonPath, 'utf-8');
      const manifest = JSON.parse(raw);
      currentVersion = manifest.version || '0.0.0';
    } catch {
      // Fall back to 0.0.0
    }
  }

  // Upsert subscription
  const { data: subscription, error: upsertError } = await supabase
    .from('skill_update_subscriptions')
    .upsert({
      user_id: user.id,
      slug,
      current_version: currentVersion,
      notify_via: notifyVia,
      webhook_url: webhookUrl || null,
      is_active: true,
    }, { onConflict: 'user_id,slug' })
    .select()
    .single();

  if (upsertError) {
    return NextResponse.json(
      { error: 'Failed to create subscription', details: upsertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: `Subscribed to updates for '${slug}'`,
    subscription: {
      slug,
      currentVersion,
      notifyVia,
      isActive: (subscription as Record<string, unknown>).is_active as boolean,
    },
  }, { status: 201 });
}

/**
 * DELETE /api/skills/[slug]/updates
 * Unsubscribe from update notifications.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { error: deleteError } = await supabase
    .from('skill_update_subscriptions')
    .delete()
    .eq('user_id', user.id)
    .eq('slug', slug);

  if (deleteError) {
    return NextResponse.json(
      { error: 'Failed to unsubscribe', details: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: `Unsubscribed from updates for '${slug}'` });
}

/**
 * Compare two semver strings.
 * Returns: -1 if a < b, 0 if a == b, 1 if a > b
 */
function compareSemver(a: string, b: string): number {
  const parseVersion = (v: string) => {
    const parts = v.replace(/-.*$/, '').split('.').map(Number);
    return parts[0] * 1000000 + (parts[1] || 0) * 1000 + (parts[2] || 0);
  };
  const va = parseVersion(a);
  const vb = parseVersion(b);
  if (va < vb) return -1;
  if (va > vb) return 1;
  return 0;
}
