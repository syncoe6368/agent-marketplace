/**
 * Input sanitization and validation utilities for AgentHub.
 *
 * Prevents XSS, injection, and malformed data across all API endpoints.
 * Uses allowlists and strict length limits — not blocklists.
 */

// ─── HTML/XSS Sanitization ────────────────────────────────────────

const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#96;',
};

const HTML_ENTITY_RE = /[&<>"'`/]/g;

/**
 * Escape HTML-special characters to prevent stored XSS.
 * Use on ALL user-supplied text before storing or rendering.
 */
export function escapeHtml(str: string): string {
  return str.replace(HTML_ENTITY_RE, (ch) => HTML_ENTITY_MAP[ch] || ch);
}

/**
 * Strip ALL HTML tags from a string. Use for fields that must be plain text.
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Aggressive sanitization: strip HTML then trim. For short text fields
 * like names, titles, slugs.
 */
export function sanitizePlainText(str: string, maxLength = 200): string {
  const cleaned = stripHtml(str).trim().slice(0, maxLength);
  return cleaned;
}

/**
 * Sanitize rich text: escape HTML (don't strip). For descriptions,
 * comments, long_description where some formatting chars may appear.
 */
export function sanitizeRichText(str: string, maxLength = 10000): string {
  const trimmed = str.trim().slice(0, maxLength);
  return escapeHtml(trimmed);
}

// ─── URL Validation ────────────────────────────────────────────────

const ALLOWED_URL_SCHEMES = ['http://', 'https://'];

/**
 * Validate and normalize a URL. Returns null if invalid.
 */
export function sanitizeUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (trimmed.length > 2048) return null;
  const hasValidScheme = ALLOWED_URL_SCHEMES.some((s) =>
    trimmed.toLowerCase().startsWith(s)
  );
  if (!hasValidScheme) return null;

  try {
    const url = new URL(trimmed);
    // Block javascript: and data: after parsing (defense in depth)
    if (['javascript:', 'data:', 'vbscript:'].includes(url.protocol)) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

// ─── Tag Sanitization ──────────────────────────────────────────────

const TAG_RE = /^[a-zA-Z0-9_-]+$/;
const MAX_TAGS = 10;
const MAX_TAG_LENGTH = 50;

/**
 * Validate and sanitize a tags array. Returns cleaned array.
 */
export function sanitizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags
    .filter((t): t is string => typeof t === 'string')
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0 && t.length <= MAX_TAG_LENGTH && TAG_RE.test(t))
    .slice(0, MAX_TAGS);
}

// ─── UUID Validation ───────────────────────────────────────────────

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validate a UUID string. Returns true if valid.
 */
export function isValidUuid(str: string): boolean {
  return UUID_RE.test(str);
}

// ─── Slug Validation ───────────────────────────────────────────────

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MIN_SLUG_LENGTH = 2;
const MAX_SLUG_LENGTH = 80;

/**
 * Validate a slug string. Returns cleaned slug or null.
 */
export function sanitizeSlug(slug: string): string | null {
  const cleaned = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '');
  if (cleaned.length < MIN_SLUG_LENGTH || cleaned.length > MAX_SLUG_LENGTH) return null;
  if (!SLUG_RE.test(cleaned)) return null;
  return cleaned;
}

// ─── Enum Validation ───────────────────────────────────────────────

const VALID_PRICING_MODELS = ['free', 'paid', 'freemium', 'subscription'] as const;
export type PricingModel = (typeof VALID_PRICING_MODELS)[number];

/**
 * Validate pricing model enum. Returns valid value or 'free'.
 */
export function sanitizePricingModel(val: unknown): PricingModel {
  if (typeof val === 'string' && VALID_PRICING_MODELS.includes(val as PricingModel)) {
    return val as PricingModel;
  }
  return 'free';
}

const VALID_MODERATE_ACTIONS = [
  'approve', 'suspend', 'feature', 'unfeature', 'verify', 'unverify',
] as const;
export type ModerateAction = (typeof VALID_MODERATE_ACTIONS)[number];

/**
 * Validate admin moderation action. Returns valid value or null.
 */
export function sanitizeModerateAction(val: unknown): ModerateAction | null {
  if (typeof val === 'string' && VALID_MODERATE_ACTIONS.includes(val as ModerateAction)) {
    return val as ModerateAction;
  }
  return null;
}

// ─── Integer / Pagination Validation ───────────────────────────────

/**
 * Safely parse a positive integer from query param.
 */
export function sanitizeInt(
  val: string | null,
  defaults: number,
  min = 0,
  max = 100
): number {
  if (!val) return defaults;
  const parsed = parseInt(val, 10);
  if (Number.isNaN(parsed)) return defaults;
  return Math.max(min, Math.min(max, parsed));
}

// ─── Search Query Sanitization ─────────────────────────────────────

/**
 * Sanitize a search query for safe use in Supabase filters.
 * Strips characters that could break PostgREST filter syntax.
 */
export function sanitizeSearchQuery(q: string | null): string {
  if (!q) return '';
  // Remove PostgREST special chars: , . ( ) " ' : ;
  // Keep alphanumeric, spaces, hyphens, underscores
  return q.replace(/[^a-zA-Z0-9\s\-_]/g, '').trim().slice(0, 200);
}

// ─── Field Length Limits ───────────────────────────────────────────

export const FIELD_LIMITS = {
  agentName: 120,
  agentDescription: 500,
  agentLongDescription: 5000,
  reviewComment: 2000,
  profileFullName: 100,
  profileBio: 500,
  currency: 3,
} as const;
