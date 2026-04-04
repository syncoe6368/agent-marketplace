import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

interface SkillPackage {
  slug: string;
  manifest: SkillManifest;
  hasSkillMd: boolean;
  hasIcon: boolean;
  hasScripts: boolean;
}

async function loadSkillPackages(): Promise<SkillPackage[]> {
  if (!existsSync(SKILLS_DIR)) return [];

  const entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  const packages: SkillPackage[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('_') || entry.name.startsWith('.')) continue;

    const skillJsonPath = join(SKILLS_DIR, entry.name, 'skill.json');
    if (!existsSync(skillJsonPath)) continue;

    try {
      const raw = await readFile(skillJsonPath, 'utf-8');
      const manifest: SkillManifest = JSON.parse(raw);

      const skillMdPath = join(SKILLS_DIR, entry.name, 'SKILL.md');
      const iconPath = join(SKILLS_DIR, entry.name, manifest.icon || 'icon.svg');
      const scriptsPath = join(SKILLS_DIR, entry.name, 'scripts');

      packages.push({
        slug: entry.name,
        manifest,
        hasSkillMd: existsSync(skillMdPath),
        hasIcon: existsSync(iconPath),
        hasScripts: existsSync(scriptsPath),
      });
    } catch {
      // Skip malformed packages
    }
  }

  return packages;
}

/**
 * GET /api/skills
 * List all available skill packages with optional filtering.
 *
 * Query params:
 *   category - Filter by category (e.g. "development", "finance")
 *   tag      - Filter by tag (e.g. "security", "trading")
 *   model    - Filter by pricing model (free|paid|freemium|subscription)
 *   search   - Full-text search on name, description, and tags
 *   sort     - Sort field: "name" | "category" | "pricingModel" (default: "name")
 *   order    - Sort order: "asc" | "desc" (default: "asc")
 */
export async function GET(request: NextRequest) {
  const packages = await loadSkillPackages();

  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const model = searchParams.get('model');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'name';
  const order = searchParams.get('order') || 'asc';

  let filtered = packages;

  // Filter by category
  if (category) {
    filtered = filtered.filter((p) => p.manifest.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by tag
  if (tag) {
    filtered = filtered.filter((p) =>
      p.manifest.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  // Filter by pricing model
  if (model) {
    filtered = filtered.filter((p) => p.manifest.pricingModel.toLowerCase() === model.toLowerCase());
  }

  // Full-text search
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((p) => {
      const searchable = [
        p.manifest.name,
        p.manifest.description,
        p.manifest.longDescription || '',
        ...p.manifest.tags,
        ...p.manifest.features,
      ]
        .join(' ')
        .toLowerCase();
      return searchable.includes(q);
    });
  }

  // Sort
  filtered.sort((a, b) => {
    let cmp = 0;
    switch (sort) {
      case 'category':
        cmp = a.manifest.category.localeCompare(b.manifest.category);
        break;
      case 'pricingModel':
        cmp = a.manifest.pricingModel.localeCompare(b.manifest.pricingModel);
        break;
      case 'name':
      default:
        cmp = a.manifest.name.localeCompare(b.manifest.name);
        break;
    }
    return order === 'desc' ? -cmp : cmp;
  });

  // Build response (exclude internal details)
  const results = filtered.map((p) => ({
    slug: p.slug,
    name: p.manifest.name,
    version: p.manifest.version,
    description: p.manifest.description,
    longDescription: p.manifest.longDescription || null,
    author: p.manifest.author,
    license: p.manifest.license,
    category: p.manifest.category,
    pricingModel: p.manifest.pricingModel,
    price: p.manifest.price || null,
    currency: p.manifest.currency || null,
    homepage: p.manifest.homepage || null,
    repository: p.manifest.repository || null,
    apiDocs: p.manifest.apiDocs || null,
    tags: p.manifest.tags,
    features: p.manifest.features,
    runtime: p.manifest.runtime || null,
    hasSkillMd: p.hasSkillMd,
    hasIcon: p.hasIcon,
    hasScripts: p.hasScripts,
  }));

  return NextResponse.json({
    skills: results,
    total: results.length,
    filters: {
      category: category || null,
      tag: tag || null,
      model: model || null,
      search: search || null,
    },
  });
}
