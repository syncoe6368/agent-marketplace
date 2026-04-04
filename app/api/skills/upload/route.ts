import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { writeFile, mkdir, readdir, rm } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const SKILLS_DIR = join(process.cwd(), 'skill-packages');

/** Maximum total upload size: 5 MB */
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Maximum individual file size: 1 MB */
const MAX_FILE_BYTES = 1 * 1024 * 1024;

/** Maximum number of files per upload */
const MAX_FILES = 20;

/** Allowed file extensions for skill packages */
const ALLOWED_EXTENSIONS = new Set([
  '.md', '.json', '.js', '.ts', '.sh', '.py', '.yaml', '.yml', '.toml',
  '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico',
  '.txt', '.env.example', '.gitignore', '.dockerignore',
]);

/** Required fields in skill.json manifest */
const REQUIRED_FIELDS = ['name', 'version', 'description', 'author', 'license', 'category', 'pricingModel', 'tags'] as const;

/** Valid pricing models */
const VALID_PRICING_MODELS = new Set(['free', 'paid', 'freemium', 'subscription']);

/** Valid categories */
const VALID_CATEGORIES = new Set([
  'automation', 'development', 'finance', 'marketing', 'research-analysis',
  'customer-support', 'security', 'productivity', 'content', 'trading',
  'data-analysis', 'education', 'healthcare', 'legal', 'other',
]);

/**
 * Slugify a string: lowercase, replace non-alphanumeric with hyphens, collapse repeats.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Validate a filename for safety.
 * - No path traversal (.. or / or \)
 * - No hidden files (starting with .)
 * - Must have an allowed extension
 */
function validateFileName(fileName: string): { valid: boolean; error?: string } {
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return { valid: false, error: `Path traversal in filename: ${fileName}` };
  }
  if (fileName.startsWith('.')) {
    return { valid: false, error: `Hidden files not allowed: ${fileName}` };
  }
  const ext = fileName.includes('.') ? '.' + fileName.split('.').pop()!.toLowerCase() : '';
  if (ext && !ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: `File extension '${ext}' not allowed: ${fileName}` };
  }
  return { valid: true };
}

/**
 * Validate skill.json manifest structure.
 */
function validateManifest(manifest: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!manifest[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate types
  if (manifest.name && typeof manifest.name !== 'string') {
    errors.push('name must be a string');
  }
  if (manifest.version && typeof manifest.version !== 'string') {
    errors.push('version must be a string');
  }
  if (manifest.version && typeof manifest.version === 'string') {
    // Basic semver check: x.y.z or x.y.z-tag
    if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(manifest.version)) {
      errors.push('version must follow semver (e.g. 1.0.0)');
    }
  }
  if (manifest.description && typeof manifest.description === 'string' && manifest.description.length > 200) {
    errors.push('description must be 200 characters or less');
  }
  if (manifest.tags && !Array.isArray(manifest.tags)) {
    errors.push('tags must be an array');
  }
  if (manifest.features && !Array.isArray(manifest.features)) {
    errors.push('features must be an array');
  }

  // Validate pricing model
  if (manifest.pricingModel && !VALID_PRICING_MODELS.has(manifest.pricingModel as string)) {
    errors.push(`Invalid pricingModel: ${manifest.pricingModel}. Must be one of: ${[...VALID_PRICING_MODELS].join(', ')}`);
  }

  // Validate category
  if (manifest.category && !VALID_CATEGORIES.has(manifest.category as string)) {
    errors.push(`Invalid category: ${manifest.category}. Must be one of: ${[...VALID_CATEGORIES].join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Parse multipart form data from a NextRequest.
 * Returns an array of { name, filename, data (Buffer), contentType }.
 */
async function parseFormData(request: NextRequest): Promise<{
  files: Array<{ name: string; filename: string; data: Buffer; contentType: string }>;
  error?: string;
}> {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return { files: [], error: 'Content-Type must be multipart/form-data' };
  }

  const formData = await request.formData();
  const files: Array<{ name: string; filename: string; data: Buffer; contentType: string }> = [];

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      const arrayBuffer = await value.arrayBuffer();
      files.push({
        name: key,
        filename: value.name,
        data: Buffer.from(arrayBuffer),
        contentType: value.type,
      });
    }
  }

  return { files };
}

/**
 * POST /api/skills/upload
 * Upload a new skill package or update an existing one.
 *
 * Requires authentication.
 * Accepts multipart/form-data with:
 *   - skill.json (required): The skill manifest
 *   - SKILL.md (optional): The skill documentation
 *   - icon.svg (optional): The skill icon
 *   - Any other allowed files (e.g. scripts/main.sh)
 *
 * The slug is auto-generated from the manifest name, or can be specified
 * via a "slug" form field.
 *
 * If a package with the same slug already exists, it will be overwritten
 * (only if the authenticated user is the original uploader).
 *
 * Response:
 *   201 Created — { slug, manifest, files, message }
 *   400 Bad Request — Validation errors
 *   401 Unauthorized — Not authenticated
 *   413 Payload Too Large — Files exceed size limits
 *   429 Too Many Requests — Rate limited
 */
export async function POST(request: NextRequest) {
  // Rate limiting (write-tier)
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

  // Check content length
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
  if (contentLength > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `Upload too large. Maximum total size is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB` },
      { status: 413 }
    );
  }

  // Parse form data
  const { files, error: parseError } = await parseFormData(request);
  if (parseError) {
    return NextResponse.json({ error: parseError }, { status: 400 });
  }

  if (files.length === 0) {
    return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
  }

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Too many files. Maximum is ${MAX_FILES} files per upload` },
      { status: 413 }
    );
  }

  // Find and validate skill.json
  const manifestFile = files.find((f) => f.filename === 'skill.json');
  if (!manifestFile) {
    return NextResponse.json(
      { error: 'skill.json manifest file is required' },
      { status: 400 }
    );
  }

  let manifest: Record<string, unknown>;
  try {
    manifest = JSON.parse(manifestFile.data.toString('utf-8'));
  } catch {
    return NextResponse.json({ error: 'skill.json is not valid JSON' }, { status: 400 });
  }

  const manifestValidation = validateManifest(manifest);
  if (!manifestValidation.valid) {
    return NextResponse.json(
      { error: 'Invalid skill.json manifest', details: manifestValidation.errors },
      { status: 400 }
    );
  }

  // Generate slug
  const slug = slugify(manifest.name as string);
  if (!slug || slug.length < 2) {
    return NextResponse.json(
      { error: 'Skill name must produce a valid slug (at least 2 alphanumeric characters)' },
      { status: 400 }
    );
  }

  // Validate all filenames
  const safeFiles: Array<{ filename: string; data: Buffer }> = [];
  for (const file of files) {
    const validation = validateFileName(file.filename);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Check individual file size
    if (file.data.length > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: `File '${file.filename}' exceeds ${MAX_FILE_BYTES / 1024} KB limit` },
        { status: 413 }
      );
    }

    safeFiles.push({ filename: file.filename, data: file.data });
  }

  // Check if slug already exists
  const skillDir = join(SKILLS_DIR, slug);
  let previousVersion: string | null = null;
  if (existsSync(skillDir)) {
    // Check if existing package has an owner field matching current user
    const existingManifestPath = join(skillDir, 'skill.json');
    if (existsSync(existingManifestPath)) {
      try {
        const { readFile } = await import('fs/promises');
        const existingRaw = await readFile(existingManifestPath, 'utf-8');
        const existingManifest = JSON.parse(existingRaw);

        // If the existing package has a different uploader, reject
        if (existingManifest._uploadedBy && existingManifest._uploadedBy !== user.id) {
          return NextResponse.json(
            { error: 'A skill package with this name already exists from a different author' },
            { status: 409 }
          );
        }

        // Capture previous version for version tracking
        previousVersion = existingManifest.version || null;
      } catch {
        // If we can't read the existing manifest, reject to be safe
        return NextResponse.json(
          { error: 'Cannot overwrite existing package: unable to verify ownership' },
          { status: 409 }
        );
      }
    }

    // Remove existing package (owned by this user or no owner)
    await rm(skillDir, { recursive: true, force: true });
  }

  // Create skill directory
  await mkdir(skillDir, { recursive: true });

  // Write files
  const writtenFiles: string[] = [];
  for (const file of safeFiles) {
    // Handle subdirectory files (e.g. scripts/main.sh)
    const filePath = join(skillDir, file.filename);
    const fileDir = join(filePath, '..');

    // Create parent directories if needed
    if (!existsSync(fileDir)) {
      await mkdir(fileDir, { recursive: true });
    }

    await writeFile(filePath, file.data);
    writtenFiles.push(file.filename);
  }

  // Add metadata to manifest (not written to skill.json, only tracked)
  const enrichedManifest = {
    ...manifest,
    _uploadedBy: user.id,
    _uploadedAt: new Date().toISOString(),
    _fileCount: writtenFiles.length,
  };

  // Write updated manifest with metadata
  await writeFile(
    join(skillDir, 'skill.json'),
    JSON.stringify(enrichedManifest, null, 2)
  );

  // Record version in Supabase
  const totalSizeBytes = safeFiles.reduce((sum, f) => sum + f.data.length, 0);
  const newVersion = manifest.version as string;

  try {
    await supabase
      .from('skill_versions')
      .insert({
        slug,
        version: newVersion,
        previous_version: previousVersion,
        changelog: null, // Can be added via separate API or future upload field
        manifest_snapshot: enrichedManifest,
        file_list: writtenFiles,
        total_size_bytes: totalSizeBytes,
        uploader_id: user.id,
      });
  } catch (versionError) {
    // Version recording failure should not block upload
    console.error('Failed to record skill version:', versionError);
  }

  const isUpdate = previousVersion !== null;
  const versionChanged = previousVersion !== null && previousVersion !== newVersion;

  return NextResponse.json(
    {
      slug,
      manifest: {
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        category: manifest.category,
        pricingModel: manifest.pricingModel,
        tags: manifest.tags,
      },
      files: writtenFiles,
      totalSize: totalSizeBytes,
      versionInfo: {
        previousVersion,
        currentVersion: newVersion,
        isUpdate,
        versionChanged,
      },
      message: `Skill package '${slug}' ${isUpdate ? 'updated' : 'uploaded'} successfully${versionChanged ? ` (v${previousVersion} → v${newVersion})` : ''}`,
    },
    { status: 201 }
  );
}
