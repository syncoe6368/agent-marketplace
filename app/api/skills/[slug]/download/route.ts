import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const SKILLS_DIR = join(process.cwd(), 'skill-packages');

const ALLOWED_EXTENSIONS = new Set([
  '.md', '.json', '.js', '.ts', '.sh', '.py', '.yaml', '.yml', '.toml',
  '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico',
  '.txt', '.env.example', '.gitignore', '.dockerignore',
]);

/**
 * GET /api/skills/[slug]/download?file=<relative-path>
 * Download a specific file from a skill package.
 *
 * Security: Only files with allowed extensions can be downloaded.
 *           Path traversal is prevented.
 *           Files starting with '.' are blocked.
 *
 * Query params:
 *   file — Relative path within the skill package (e.g. "skill.json", "SKILL.md", "scripts/main.sh")
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const file = request.nextUrl.searchParams.get('file');

  if (!file) {
    return NextResponse.json(
      { error: 'file query parameter is required. Example: ?file=SKILL.md' },
      { status: 400 }
    );
  }

  // Prevent directory traversal
  if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }
  if (file.includes('..') || file.startsWith('/') || file.startsWith('\\')) {
    return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
  }

  // Block hidden files
  const parts = file.split('/');
  if (parts.some((p) => p.startsWith('.'))) {
    return NextResponse.json({ error: 'Hidden files cannot be downloaded' }, { status: 403 });
  }

  // Validate extension
  const fileName = parts[parts.length - 1];
  const ext = fileName.includes('.')
    ? '.' + fileName.split('.').pop()!.toLowerCase()
    : '';
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: `File type '${ext}' is not allowed for download` },
      { status: 403 }
    );
  }

  const filePath = join(SKILLS_DIR, slug, file);
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  try {
    const content = await readFile(filePath);

    // Determine content type
    const contentTypes: Record<string, string> = {
      '.md': 'text/markdown',
      '.json': 'application/json',
      '.js': 'text/javascript',
      '.ts': 'text/typescript',
      '.sh': 'text/x-shellscript',
      '.py': 'text/x-python',
      '.yaml': 'text/yaml',
      '.yml': 'text/yaml',
      '.toml': 'text/toml',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.ico': 'image/x-icon',
      '.txt': 'text/plain',
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';

    // Set Content-Disposition for download
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    headers.set('Cache-Control', 'public, max-age=3600');

    return new NextResponse(content, { status: 200, headers });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to read file', details: String(err) },
      { status: 500 }
    );
  }
}
