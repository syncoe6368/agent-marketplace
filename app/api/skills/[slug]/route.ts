import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync, statSync } from 'fs';

const SKILLS_DIR = join(process.cwd(), 'skill-packages');

interface SkillManifest {
  name: string;
  version: string;
  description: string;
  longDescription?: string;
  author: string;
  license: string;
  category: string;
  pricingModel: string;
  price?: number;
  currency?: string;
  homepage?: string;
  repository?: string;
  apiDocs?: string;
  icon?: string;
  tags: string[];
  features: string[];
  runtime?: Record<string, string>;
  entrypoint?: string;
}

/**
 * GET /api/skills/[slug]
 * Get a single skill package by slug.
 *
 * Query params:
 *   include=readme  — Include SKILL.md content in response
 *   include=files   — List all files in the package
 *   include=all     — Include both readme and file listing
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

  const skillDir = join(SKILLS_DIR, slug);
  if (!existsSync(skillDir)) {
    return NextResponse.json({ error: 'Skill package not found' }, { status: 404 });
  }

  const skillJsonPath = join(skillDir, 'skill.json');
  if (!existsSync(skillJsonPath)) {
    return NextResponse.json({ error: 'Invalid skill package: missing skill.json' }, { status: 404 });
  }

  try {
    const raw = await readFile(skillJsonPath, 'utf-8');
    const manifest: SkillManifest = JSON.parse(raw);

    const searchParams = request.nextUrl.searchParams;
    const include = searchParams.get('include') || '';
    const includeReadme = include === 'readme' || include === 'all';
    const includeFiles = include === 'files' || include === 'all';

    const result: Record<string, unknown> = {
      slug,
      manifest,
      hasSkillMd: existsSync(join(skillDir, 'SKILL.md')),
      hasIcon: existsSync(join(skillDir, manifest.icon || 'icon.svg')),
      hasScripts: existsSync(join(skillDir, 'scripts')),
    };

    // Optionally include SKILL.md content
    if (includeReadme && result.hasSkillMd) {
      const skillMd = await readFile(join(skillDir, 'SKILL.md'), 'utf-8');
      result.skillMd = skillMd;
    }

    // Optionally include file listing
    if (includeFiles) {
      result.files = await listFilesRecursive(skillDir, skillDir);
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to read skill package', details: String(err) },
      { status: 500 }
    );
  }
}

async function listFilesRecursive(dir: string, base: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = fullPath.replace(base + '/', '');

    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(fullPath, base)));
    } else {
      const stats = statSync(fullPath);
      files.push(`${relativePath} (${(stats.size / 1024).toFixed(1)} KB)`);
    }
  }

  return files;
}
