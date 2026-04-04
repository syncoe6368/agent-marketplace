import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { createClient } from '@/lib/supabase/server';

const SKILLS_DIR = join(process.cwd(), 'skill-packages');

/**
 * GET /api/skills/[slug]/versions
 * Get version history for a skill package.
 *
 * Query params:
 *   limit  — Max versions to return (default: 20, max: 100)
 *   offset — Pagination offset (default: 0)
 *   format — "full" for complete manifests, "summary" for version list only (default: "summary")
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
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const format = searchParams.get('format') || 'summary';

  // First check if the skill package exists on disk
  const skillDir = join(SKILLS_DIR, slug);
  if (!existsSync(skillDir)) {
    return NextResponse.json({ error: 'Skill package not found' }, { status: 404 });
  }

  // Read current manifest
  const skillJsonPath = join(skillDir, 'skill.json');
  if (!existsSync(skillJsonPath)) {
    return NextResponse.json({ error: 'Invalid skill package: missing skill.json' }, { status: 404 });
  }

  let currentManifest: Record<string, unknown>;
  try {
    const raw = await readFile(skillJsonPath, 'utf-8');
    currentManifest = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Failed to read skill manifest' }, { status: 500 });
  }

  // Query Supabase for version history
  const supabase = await createClient();
  const selectFields = format === 'full'
    ? '*'
    : 'id,slug,version,previous_version,changelog,total_size_bytes,created_at';

  const { data: versions, error, count } = await supabase
    .from('skill_versions')
    .select(selectFields, { count: 'exact' })
    .eq('slug', slug)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    // If Supabase query fails, fall back to local-only response
    return NextResponse.json({
      slug,
      currentVersion: currentManifest.version,
      versions: [{
        version: currentManifest.version as string,
        date: new Date().toISOString(),
        source: 'local',
      }],
      total: 1,
      note: 'Supabase version history unavailable — showing local manifest only',
    });
  }

  const currentVersion = currentManifest.version as string;

  // Build version history response
  const versionHistory = ((versions || []) as unknown as Array<Record<string, unknown>>).map((v) => ({
    version: v.version,
    previousVersion: v.previous_version || null,
    changelog: v.changelog || null,
    date: v.created_at,
    sizeBytes: v.total_size_bytes || 0,
    ...(format === 'full' ? { manifest: v.manifest_snapshot, files: v.file_list } : {}),
  }));

  return NextResponse.json({
    slug,
    name: currentManifest.name,
    currentVersion,
    versions: versionHistory,
    pagination: {
      total: count || 0,
      limit,
      offset,
      hasMore: (count || 0) > offset + limit,
    },
  });
}
