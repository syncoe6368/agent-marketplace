import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  sanitizePlainText,
  sanitizeRichText,
  sanitizeUrl,
  sanitizeTags,
  sanitizeSlug,
  sanitizePricingModel,
  FIELD_LIMITS,
} from '@/lib/sanitize';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { logApiError } from '@/lib/sentry';

// ─── Constants ─────────────────────────────────────────────────

const SKILLS_DIR = process.cwd() + '/skill-packages';

const VALID_CATEGORIES = [
  'automation', 'marketing', 'security', 'finance', 'trading',
  'content', 'customer-support', 'productivity', 'developer-tools',
  'data-analysis', 'research', 'translation', 'entertainment',
];

const VALID_PRICING_MODELS = ['free', 'freemium', 'paid', 'subscription', 'pay-per-use'];

// Required fields in the manifest
const REQUIRED_MANIFEST_FIELDS = ['name', 'version', 'description', 'category', 'pricingModel', 'author'];

// Max total upload size (5 MB)
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

// Allowed file extensions in skill packages
const ALLOWED_EXTENSIONS = new Set([
  '.json', '.md', '.txt', '.sh', '.py', '.js', '.ts', '.tsx', '.jsx',
  '.yml', '.yaml', '.toml', '.env.example', '.svg', '.png', '.jpg',
  '.gitignore', '.dockerignore',
]);

// ─── POST /api/skills/upload ───────────────────────────────────
// Accepts a skill package manifest + files from an authenticated creator.
// The package is stored on disk and enters "pending" review status.

export async function POST(request: NextRequest) {
  // Rate limit
  const rl = rateLimit(request, RATE_LIMITS.write);
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: rl.headers });
  }

  const supabase = await createClient();

  // Authenticate
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized — sign in to upload skill packages' }, { status: 401 });
  }

  // Parse multipart/form-data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data — expected multipart/form-data' }, { status: 400 });
  }

  // ─── Extract manifest ────────────────────────────────────────
  const manifestRaw = formData.get('manifest');
  if (!manifestRaw || typeof manifestRaw !== 'string') {
    return NextResponse.json(
      { error: 'Missing "manifest" field — must be a JSON string' },
      { status: 400 }
    );
  }

  let manifest: Record<string, unknown>;
  try {
    manifest = JSON.parse(manifestRaw);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON in manifest field' }, { status: 400 });
  }

  // ─── Validate manifest ───────────────────────────────────────
  const validation = validateManifest(manifest);
  if (!validation.valid) {
    return NextResponse.json({ error: 'Manifest validation failed', details: validation.errors }, { status: 400 });
  }

  // Generate slug
  const rawSlug = (manifest.slug as string) || (manifest.name as string);
  const slug = sanitizeSlug(rawSlug);
  if (!slug) {
    return NextResponse.json({ error: 'Could not generate a valid slug from name' }, { status: 400 });
  }

  // Check if slug already exists
  const { exists: slugExists } = await checkSlugExists(slug);
  if (slugExists) {
    return NextResponse.json(
      {
        error: `Slug "${slug}" already exists`,
        suggestion: `${slug}-v2`,
      },
      { status: 409 }
    );
  }

  // ─── Extract files ───────────────────────────────────────────
  const files: { path: string; file: File }[] = [];
  let totalSize = 0;

  try {
    formData.forEach((value, key) => {
      if (key === 'manifest') return;
      if (value instanceof File) {
        // Validate file path safety
        if (key.includes('..') || key.startsWith('/') || key.includes('\\')) {
          throw new Error(`Unsafe file path: ${key}`);
        }
        // Validate extension
        const ext = '.' + key.split('.').pop();
        if (!ALLOWED_EXTENSIONS.has(ext) && !ALLOWED_EXTENSIONS.has(key)) {
          throw new Error(`File type not allowed: ${key} (extension ${ext})`);
        }
        totalSize += value.size;
        files.push({ path: key, file: value });
      }
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid file in upload';
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (totalSize > MAX_UPLOAD_SIZE) {
    return NextResponse.json(
      { error: `Total upload size exceeds ${(MAX_UPLOAD_SIZE / 1024 / 1024).toFixed(0)} MB limit` },
      { status: 413 }
    );
  }

  // ─── Write package to disk ───────────────────────────────────
  const { writeFile, mkdir } = await import('fs/promises');
  const { join } = await import('path');
  const { existsSync } = await import('fs');

  const packageDir = join(SKILLS_DIR, slug);

  try {
    // Create package directory
    if (!existsSync(SKILLS_DIR)) {
      await mkdir(SKILLS_DIR, { recursive: true });
    }
    await mkdir(packageDir, { recursive: true });

    // Write sanitized manifest
    const sanitizedManifest = {
      name: sanitizePlainText(manifest.name as string, FIELD_LIMITS.agentName),
      version: sanitizeVersion(manifest.version as string),
      description: sanitizePlainText(manifest.description as string, FIELD_LIMITS.agentDescription),
      longDescription: manifest.longDescription
        ? sanitizeRichText(manifest.longDescription as string, FIELD_LIMITS.agentLongDescription)
        : undefined,
      author: sanitizePlainText(manifest.author as string, 100),
      license: manifest.license ? sanitizePlainText(manifest.license as string, 50) : 'MIT',
      category: manifest.category as string,
      pricingModel: manifest.pricingModel as string,
      price: typeof manifest.price === 'number' ? manifest.price : undefined,
      currency: typeof manifest.currency === 'string' ? manifest.currency.toUpperCase() : 'USD',
      homepage: manifest.homepage ? sanitizeUrl(manifest.homepage as string) : undefined,
      repository: manifest.repository ? sanitizeUrl(manifest.repository as string) : undefined,
      apiDocs: manifest.apiDocs ? sanitizeUrl(manifest.apiDocs as string) : undefined,
      icon: manifest.icon ? sanitizePlainText(manifest.icon as string, 100) : undefined,
      tags: Array.isArray(manifest.tags) ? sanitizeTags(manifest.tags) : [],
      features: Array.isArray(manifest.features)
        ? (manifest.features as string[]).slice(0, 20).map((f: string) => sanitizePlainText(f, 200))
        : [],
      runtime: manifest.runtime || undefined,
      entrypoint: manifest.entrypoint ? sanitizePlainText(manifest.entrypoint as string, 200) : undefined,
    };

    await writeFile(
      join(packageDir, 'skill.json'),
      JSON.stringify(sanitizedManifest, null, 2),
      'utf-8'
    );

    // Write uploaded files
    for (const { path: filePath, file } of files) {
      const fullPath = join(packageDir, filePath);
      // Ensure parent dir exists
      const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(fullPath, buffer);
    }

    // Auto-generate SKILL.md if not provided
    if (!files.some(f => f.path === 'SKILL.md')) {
      const skillMd = generateDefaultSkillMd(sanitizedManifest);
      await writeFile(join(packageDir, 'SKILL.md'), skillMd, 'utf-8');
    }
  } catch (err) {
    // Cleanup on failure
    try {
      const { rm } = await import('fs/promises');
      await rm(packageDir, { recursive: true, force: true });
    } catch { /* best effort */ }

    logApiError(request, err, { slug, creator_id: user.id });
    return NextResponse.json({ error: 'Failed to write skill package' }, { status: 500 });
  }

  // ─── Record in database ──────────────────────────────────────
  // Store upload metadata so admin can review and approve
  const { error: dbError } = await supabase
    .from('agents')
    .insert({
      name: sanitizePlainText(manifest.name as string, FIELD_LIMITS.agentName),
      slug,
      description: sanitizePlainText(manifest.description as string, FIELD_LIMITS.agentDescription),
      long_description: manifest.longDescription
        ? sanitizeRichText(manifest.longDescription as string, FIELD_LIMITS.agentLongDescription)
        : null,
      pricing_model: manifest.pricingModel as string,
      price_amount: typeof manifest.price === 'number' ? manifest.price : null,
      currency: typeof manifest.currency === 'string' ? manifest.currency.toUpperCase() : 'USD',
      website_url: manifest.homepage ? sanitizeUrl(manifest.homepage as string) : null,
      github_url: manifest.repository ? sanitizeUrl(manifest.repository as string) : null,
      tags: Array.isArray(manifest.tags) ? sanitizeTags(manifest.tags) : null,
      creator_id: user.id,
      status: 'pending',
      // Store skill-specific metadata in the agents table
    });

  if (dbError) {
    logApiError(request, dbError, { slug, creator_id: user.id });
    // Don't fail the whole request — package is on disk, just log the DB error
    console.error('DB insert failed for skill upload:', dbError);
  }

  return NextResponse.json(
    {
      success: true,
      slug,
      message: 'Skill package uploaded successfully and queued for review',
      status: 'pending',
      filesReceived: files.length,
      totalSizeKB: Math.round(totalSize / 1024),
    },
    { status: 201 }
  );
}

// ─── Validation helpers ────────────────────────────────────────

function validateManifest(m: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const field of REQUIRED_MANIFEST_FIELDS) {
    if (!m[field] || (typeof m[field] === 'string' && !(m[field] as string).trim())) {
      errors.push(`Missing required field: "${field}"`);
    }
  }

  if (m.category && !VALID_CATEGORIES.includes(m.category as string)) {
    errors.push(`Invalid category "${m.category}". Valid: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (m.pricingModel && !VALID_PRICING_MODELS.includes(m.pricingModel as string)) {
    errors.push(`Invalid pricingModel "${m.pricingModel}". Valid: ${VALID_PRICING_MODELS.join(', ')}`);
  }

  if (m.version && !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(m.version as string)) {
    errors.push('Version must follow semver (e.g., "1.0.0" or "1.0.0-beta.1")');
  }

  if (m.tags && !Array.isArray(m.tags)) {
    errors.push('"tags" must be an array of strings');
  }

  if (m.features && !Array.isArray(m.features)) {
    errors.push('"features" must be an array of strings');
  }

  return { valid: errors.length === 0, errors };
}

async function checkSlugExists(slug: string): Promise<{ exists: boolean }> {
  const { existsSync } = await import('fs');
  const { join } = await import('path');
  return { exists: existsSync(join(SKILLS_DIR, slug)) };
}

function sanitizeVersion(v: string): string {
  // Only allow semver-like strings
  return v.replace(/[^0-9a-zA-Z.\-]/g, '').slice(0, 30);
}

function generateDefaultSkillMd(m: Record<string, unknown>): string {
  const name = m.name || 'Unnamed Agent';
  const description = m.description || 'No description provided.';
  const features = Array.isArray(m.features) ? m.features as string[] : [];

  return `# ${name}

${description}

## Features

${features.length > 0 ? features.map((f: string) => `- ${f}`).join('\n') : '- See skill.json for details'}

## Installation

\`\`\`bash
# Install via AgentHub CLI
agenthub install ${m.name?.toString().toLowerCase().replace(/\s+/g, '-') || 'package'}
\`\`\`

## Configuration

See the included scripts and configuration files for setup instructions.

---

*Auto-generated by AgentHub Skill Package Upload API*
`;
}
