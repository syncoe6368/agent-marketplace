import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const SKILLS_DIR = join(process.cwd(), 'skill-packages');

/**
 * GET /api/skills/[slug]/versions
 * Returns version history and changelog for a skill package.
 *
 * Query params:
 *   since — Return only versions newer than this semver string
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  const skillDir = join(SKILLS_DIR, slug);
  if (!existsSync(skillDir)) {
    return NextResponse.json({ error: 'Skill package not found' }, { status: 404 });
  }

  const skillJsonPath = join(skillDir, 'skill.json');
  if (!existsSync(skillJsonPath)) {
    return NextResponse.json({ error: 'Invalid skill package' }, { status: 404 });
  }

  const since = request.nextUrl.searchParams.get('since');

  try {
    const raw = await readFile(skillJsonPath, 'utf-8');
    const manifest = JSON.parse(raw);

    // Read changelog if it exists
    const changelogPath = join(skillDir, 'CHANGELOG.md');
    let changelog: string | null = null;
    if (existsSync(changelogPath)) {
      changelog = await readFile(changelogPath, 'utf-8');
    }

    // Get directory stats for "last modified" tracking
    const skillStat = await stat(skillDir);

    // Build version info
    const currentVersion = {
      version: manifest.version,
      releasedAt: skillStat.mtime.toISOString(),
      name: manifest.name,
      description: manifest.description,
      category: manifest.category,
      pricingModel: manifest.pricingModel,
      tags: manifest.tags || [],
    };

    // If "since" param provided, check if this is a new version
    let hasUpdate = false;
    if (since) {
      hasUpdate = compareVersions(manifest.version, since) > 0;
    }

    // Parse changelog into structured entries
    const changelogEntries = changelog ? parseChangelog(changelog) : [];

    const result: Record<string, unknown> = {
      slug,
      currentVersion,
      hasUpdate: since ? hasUpdate : undefined,
      changelog: changelogEntries,
      totalVersions: changelogEntries.length || 1,
      lastModified: skillStat.mtime.toISOString(),
    };

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to read version info', details: String(err) },
      { status: 500 }
    );
  }
}

/**
 * Compare two semver strings. Returns >0 if a > b, <0 if a < b, 0 if equal.
 */
function compareVersions(a: string, b: string): number {
  const parseSemver = (v: string) => {
    const match = v.match(/^(\d+)\.(\d+)\.(\d+)/);
    if (!match) return [0, 0, 0];
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  };

  const aParts = parseSemver(a);
  const bParts = parseSemver(b);

  for (let i = 0; i < 3; i++) {
    if (aParts[i] !== bParts[i]) return aParts[i] - bParts[i];
  }
  return 0;
}

/**
 * Parse a Keep-a-Changelog formatted CHANGELOG.md into structured entries.
 */
interface ChangelogEntry {
  version: string;
  date: string;
  added: string[];
  changed: string[];
  deprecated: string[];
  removed: string[];
  fixed: string[];
  security: string[];
}

function parseChangelog(content: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  const versionRegex = /^##\s+\[?(\d+\.\d+\.\d+[^]]*)\]?\s*[-–]?\s*(.*)$/gm;

  let match;
  while ((match = versionRegex.exec(content)) !== null) {
    const version = match[1];
    const date = match[2].trim() || 'Unknown';
    const sectionStart = match.index + match[0].length;

    // Find next version header or end of string
    const nextMatch = versionRegex.exec(content);
    const sectionEnd = nextMatch ? nextMatch.index : content.length;
    versionRegex.lastIndex = match.index + match[0].length; // Reset for next iteration

    const section = content.substring(sectionStart, sectionEnd);

    entries.push({
      version,
      date,
      added: extractSection(section, 'added'),
      changed: extractSection(section, 'changed'),
      deprecated: extractSection(section, 'deprecated'),
      removed: extractSection(section, 'removed'),
      fixed: extractSection(section, 'fixed'),
      security: extractSection(section, 'security'),
    });
  }

  return entries;
}

function extractSection(content: string, sectionName: string): string[] {
  const sectionRegex = new RegExp(`###\\s+${sectionName}`, 'i');
  const match = sectionRegex.exec(content);
  if (!match) return [];

  const start = match.index + match[0].length;
  const nextSection = content.indexOf('###', start);
  const end = nextSection > -1 ? nextSection : content.length;
  const sectionContent = content.substring(start, end);

  // Extract bullet points
  const bullets: string[] = [];
  const lines = sectionContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      bullets.push(trimmed.substring(2).trim());
    }
  }

  return bullets;
}
