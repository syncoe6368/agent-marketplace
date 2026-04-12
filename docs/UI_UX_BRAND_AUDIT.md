# UI/UX Brand Compliance Audit Report

**Product:** AgentHub Marketplace — `marketplace.syncoe.com`
**Date:** 2026-04-12
**Auditor:** UI/UX Brand Compliance Auditor (automated)
**Baseline Standard:** Syncoe Brand Guidelines — Agent Marketplace vertical

---

## Executive Summary

The AgentHub marketplace currently has **126 brand color violations** (109 indigo + 17 purple references) across its codebase. The brand gradient `#3B82F6` → `#8B5CF6` is meant to be an **accent used in only 10–15% of visible page area**, but it is instead used as the **dominant color** across nearly every component — backgrounds, icons, borders, hover states, links, avatars, badges, and focus rings.

The site feels like a default Tailwind shadcn template rather than a curated, premium marketplace. The overuse flattens visual hierarchy and makes it difficult for users to identify primary actions.

**Target:** Reduce indigo/purple references to **< 30 total** (a ~76% reduction).

---

## Current State — Color Reference Counts

| Category | Current Count | Target |
|---|---|---|
| `text-indigo-*` (text/icon color) | 74 | ≤ 10 |
| `bg-indigo-*` (backgrounds/badges) | 17 | ≤ 5 |
| `hover:text-indigo-*` / `hover:border-indigo-*` | 17 | ≤ 3 |
| `from-indigo-*` / `to-purple-*` (gradients) | 10 | ≤ 3 |
| `border-indigo-*` | 7 | ≤ 2 |
| `ring-indigo-*` (focus rings) | 2 | ≤ 1 |
| `text-purple-*` / `bg-purple-*` | 17 | ≤ 3 |
| **TOTAL** | **144** | **< 30** |

### Breakdown by Page/Section

| Page/Section | Indigo | Purple | Total |
|---|---|---|---|
| Landing page (all sections) | 25 | 4 | 29 |
| Agent cards (reusable) | 8 | 2 | 10 |
| Agent detail page | 3 | 2 | 5 |
| Pricing page | 14 | 8 | 22 |
| Navbar + Mobile Nav | 8 | 0 | 8 |
| Footer | 1 | 0 | 1 |
| Auth pages (login/signup/reset/update) | 9 | 0 | 9 |
| Dashboard (all subpages) | 7 | 1 | 8 |
| Admin panel | 4 | 0 | 4 |
| Legal pages (terms/privacy/dmca/guidelines) | 25 | 0 | 25 |
| Compare page | 4 | 1 | 5 |
| Changelog | 2 | 0 | 2 |
| Error/loading/not-found pages | 3 | 1 | 4 |
| Feedback inline | 1 | 0 | 1 |
| Other (categories, etc.) | 2 | 0 | 2 |

---

## Brand Guidelines Recap

### Where the Brand Gradient IS Allowed
1. **Hero section accent** (heading gradient, CTA button)
2. **Primary CTA buttons** (gradient background)
3. **Key highlights** ( sparing — one per page section max)

### Where Neutrals Should Dominate

| Role | Light Mode | Dark Mode |
|---|---|---|
| Page backgrounds | `#FFFFFF` / `bg-white` | `#111827` / `bg-gray-900` |
| Alternating sections | `#F9FAFB` / `bg-gray-50` | `#1F2937` / `bg-gray-800` |
| Headings | `#111827` / `text-gray-900` | `#F9FAFB` / `text-gray-50` |
| Body text | `#4B5563` / `text-gray-600` | `#D1D5DB` / `text-gray-300` |
| Captions | `#9CA3AF` / `text-gray-400` | `#6B7280` / `text-gray-500` |
| Borders | `#E5E7EB` / `border-gray-200` | `#374151` / `border-gray-700` |
| Links | `#3B82F6` / `text-blue-500` | `#60A5FA` / `text-blue-400` |
| Success | `#10B981` / `text-green-500` | `#34D399` / `text-green-400` |
| Ratings/badges | `#F59E0B` / `text-amber-500` | `#FBBF24` / `text-amber-400` |
| Verification badge | `#3B82F6` / `text-blue-500` | `#60A5FA` / `text-blue-400` |

---

## Per-Component Audit

### 1. Hero Section — `src/components/landing/hero-section.tsx`

**Status:** ⚠️ PARTIAL — Uses too many indigo elements in non-accent roles

| Line | Current Class | Issue | Replacement |
|---|---|---|---|
| 14 | `bg-gradient-to-b from-indigo-50/50 to-background dark:from-indigo-950/20` | **OK** — Hero is an allowed accent zone | Keep as-is |
| 17 | `bg-indigo-500/10 blur-3xl` | Decorative blob | ✅ **Keep** — Hero decoration |
| 18 | `bg-purple-500/10 blur-3xl` | Decorative blob | ✅ **Keep** — Hero decoration |
| 23 | `bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300` | Pill badge | `bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300` |
| 30 | `bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent` | **OK** — Hero heading accent | ✅ **Keep** |
| 62 | `focus:ring-2 focus:ring-indigo-500` | Search input focus ring | `focus:ring-2 focus:ring-blue-500` |

**Changes needed:** 2 (med priority)

---

### 2. Featured Agents — `src/components/landing/featured-agents.tsx`

**Status:** ✅ CLEAN — No indigo/purple references. Uses `<Flame className="text-orange-500">` and delegates to `AgentCard`.

**Changes needed:** 0

---

### 3. Trending Agents — `src/components/landing/trending-agents.tsx`

**Status:** ⚠️ OVERUSE — Indigo in card hover, avatar, and text hover

| Line | Current Class | Issue | Replacement |
|---|---|---|---|
| 47 | `hover:border-indigo-200 dark:hover:border-indigo-800` | Card hover border | `hover:border-blue-200 dark:hover:border-blue-800` |
| 57 | `bg-gradient-to-br from-indigo-500 to-purple-600` | Avatar gradient | `bg-gray-800 dark:bg-gray-700` |
| 61 | `group-hover:text-indigo-600` | Text hover | `group-hover:text-blue-600` |

**Changes needed:** 3 (medium priority)

---

### 4. Categories Grid — `src/components/landing/categories-grid.tsx`

**Status:** 🔴 OVERUSE — Indigo on every single category card

| Line | Current Class | Issue | Replacement |
|---|---|---|---|
| 39 | `hover:border-indigo-200 dark:hover:border-indigo-800` | Card hover | `hover:border-blue-200 dark:hover:border-blue-800` |
| 40 | `bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600` | Icon container — **ALL 6+ cards** | `bg-gray-100 dark:bg-gray-800 text-gray-600` |

**Changes needed:** 2 (high priority — appears on every category card, very visible)

**Recommendation:** Use category-specific accent colors instead (e.g., Zap→amber, Search→blue, MessageSquare→green, Code→violet, Megaphone→rose, TrendingUp→emerald). This makes the grid feel curated and visually rich.

---

### 5. Testimonials Section — `src/components/landing/testimonials-section.tsx`

**Status:** ✅ MOSTLY CLEAN

| Line | Current Class | Issue | Replacement |
|---|---|---|---|
| 48 | `text-indigo-600` | Agent name link | `text-blue-500` |

**Changes needed:** 1 (low priority)

**Note:** Star ratings correctly use `fill-yellow-400 text-yellow-400` ✅

---

### 6. How It Works — `src/components/landing/how-it-works.tsx`

**Status:** 🔴 OVERUSE — Indigo on every step icon

| Line | Current Class | Issue | Replacement |
|---|---|---|---|
| 33 | `bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600` | Icon container | `bg-gray-100 dark:bg-gray-800 text-gray-600` |
| 36 | `bg-indigo-600` | Step number badge | `bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900` |

**Changes needed:** 2 (high priority)

**Recommendation:** Use step-specific colors (Discover=blue, Evaluate=amber, Deploy=green) to create visual progression.

---

### 7. Agent Card — `src/components/agents/agent-card.tsx`

**Status:** 🔴 CRITICAL — This is the most-reused component; every indigo ref here multiplies across every page

| Line | Current Class | Issue | Replacement |
|---|---|---|---|
| 126 | `bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200` | Freemium badge | `bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200` |
| 135 | `hover:border-indigo-200 dark:hover:border-indigo-800` | Card hover | `hover:border-blue-200 dark:hover:border-blue-800` |
| 140 | `bg-gradient-to-br from-indigo-500 to-purple-600` | Agent avatar | `bg-gray-800 dark:bg-gray-700` |
| 145 | `group-hover:text-indigo-600` | Name hover | `group-hover:text-blue-600` |
| 149 | `text-indigo-600` | Verified badge | `text-blue-500` |
| 200 | `text-indigo-600 bg-indigo-50 dark:bg-indigo-950` | Compare active state | `text-blue-600 bg-blue-50 dark:bg-blue-950` |
| 201 | `hover:text-indigo-600` | Compare hover | `hover:text-blue-600` |

**Changes needed:** 7 (**CRITICAL** — used on browse, featured, search, dashboard)

---

### 8. Star Rating — `src/components/agents/star-rating.tsx`

**Status:** ✅ CLEAN — Uses `fill-yellow-400 text-yellow-400` correctly

**Changes needed:** 0

---

### 9. Navbar — `src/components/layout/navbar.tsx`

**Status:** ⚠️ MINOR — One icon color

| Line | Current Class | Issue | Replacement |
|---|---|---|---|
| 17 | `text-indigo-600` | Bot logo icon | `text-gray-900 dark:text-gray-100` |

**Changes needed:** 1 (low priority — brand logo should use neutral/primary)

**Note:** Navigation links correctly use `text-muted-foreground hover:text-foreground` ✅. Button defaults use shadcn `bg-primary text-primary-foreground` ✅.

---

### 10. Mobile Nav — `src/components/layout/mobile-nav.tsx`

**Status:** ⚠️ OVERUSE — Indigo on nav icon + every link hover

| Line | Current Class | Issue | Replacement |
|---|---|---|---|
| 26 | `text-indigo-600` | Bot logo icon | `text-gray-900 dark:text-gray-100` |
| 30 | `hover:text-indigo-600` | Browse Agents link | `hover:text-foreground` |
| 33 | `hover:text-indigo-600` | Categories link | `hover:text-foreground` |
| 36 | `hover:text-indigo-600` | Compare link | `hover:text-foreground` |
| 40 | `hover:text-indigo-600` | Trending link | `hover:text-foreground` |
| 44 | `hover:text-indigo-600` | Pricing link | `hover:text-foreground` |

**Changes needed:** 6 (medium priority)

---

### 11. Footer — `src/components/layout/footer.tsx`

**Status:** ✅ MOSTLY CLEAN

| Line | Current Class | Issue | Replacement |
|---|---|---|---|
| 13 | `text-indigo-600` | Bot logo icon | `text-gray-900 dark:text-gray-100` |

**Changes needed:** 1 (low priority)

---

### 12. Pricing Page — `app/pricing/page.tsx`

**Status:** 🔴 OVERUSE — Background gradient + card border

| Line | Current Class | Issue | Replacement |
|---|---|---|---|
| 72 | `bg-gradient-to-b from-white to-indigo-50` | Page background | `bg-white dark:bg-gray-950` |
| 88 | `border-indigo-600` | Popular plan card border | `border-blue-500` |
| 96 | `bg-indigo-600` | "Most Popular" badge | `bg-amber-500 text-white` |

**Changes needed:** 3 (high priority)

---

### 13. Pricing Strategy Section — `app/pricing/strategy-section.tsx`

**Status:** 🔴 HEAVY OVERUSE — 14 indigo/purple references in one section

| Line | Current Class | Issue | Replacement |
|---|---|---|---|
| 7 | `bg-gradient-to-br from-indigo-50 to-purple-50` | Section background | `bg-gray-50 dark:bg-gray-900` |
| 24 | `text-indigo-600` | Price stat | `text-gray-900 dark:text-gray-100` |
| 34 | `text-purple-600` | Price stat | `text-gray-900 dark:text-gray-100` |
| 49 | `text-indigo-600` | Zap icon | `text-amber-500` |
| 90 | `text-indigo-600` | Segment label | `text-blue-600` |
| 98 | `text-purple-600` | Segment label | `text-green-600` |
| 111 | `text-purple-600` | DollarSign icon | `text-green-500` |
| 119 | `bg-indigo-50` | Revenue card bg | `bg-gray-50` |
| 120 | `text-indigo-600` | Revenue stat | `text-gray-900` |
| 137 | `bg-indigo-100` | Icon circle bg | `bg-gray-100` |
| 138 | `text-indigo-600` | Star icon | `text-amber-500` |
| 155 | `bg-purple-100` | Icon circle bg | `bg-gray-100` |
| 156 | `text-purple-600` | Users icon | `text-blue-500` |

**Changes needed:** 13 (high priority — entire section needs neutralization)

---

### 14. Bottom CTA — `app/page.tsx` (lines 130-142)

**Status:** ✅ APPROPRIATE — CTA banner is an allowed accent use

| Line | Current Class | Verdict |
|---|---|---|
| 133 | `bg-gradient-to-r from-indigo-600 to-purple-600` | ✅ **Keep** — Primary CTA |
| 135 | `text-indigo-100` | ✅ **Keep** — On gradient bg |
| 139 | `text-indigo-600 hover:bg-indigo-50` | ✅ **Keep** — White btn on gradient bg |

**Changes needed:** 0

---

### 15. Legal Pages — `app/legal/*.tsx`

**Status:** ⚠️ SYSTEMIC — All legal pages use `text-indigo-600` for links

All inline links across `dmca/page.tsx`, `terms/page.tsx`, `privacy/page.tsx`, and `guidelines/page.tsx` use `text-indigo-600 hover:underline`.

**Total:** 25 references

| File | Count | Replacement |
|---|---|---|
| `app/legal/dmca/page.tsx` | 6 | `text-blue-500 hover:underline` |
| `app/legal/terms/page.tsx` | 9 | `text-blue-500 hover:underline` |
| `app/legal/privacy/page.tsx` | 7 | `text-blue-500 hover:underline` |
| `app/legal/guidelines/page.tsx` | 3 | `text-blue-500 hover:underline` |

**Changes needed:** 25 (medium priority — bulk find-and-replace)

---

### 16. Auth Pages — `app/auth/*.tsx`

| File | Line | Current | Replacement |
|---|---|---|---|
| `login/page.tsx` | 49 | `text-indigo-600` (Bot icon) | `text-gray-900 dark:text-gray-100` |
| `login/page.tsx` | 90 | `text-indigo-600` (forgot pw link) | `text-blue-500` |
| `login/page.tsx` | 113 | `text-indigo-600` (signup link) | `text-blue-500` |
| `signup/page.tsx` | 56 | `text-indigo-600` (Bot icon) | `text-gray-900 dark:text-gray-100` |
| `signup/page.tsx` | 124 | `text-indigo-600` (login link) | `text-blue-500` |
| `reset-password/page.tsx` | 47 | `text-indigo-600` (Bot icon) | `text-gray-900 dark:text-gray-100` |
| `reset-password/page.tsx` | 103 | `text-indigo-600` (back link) | `text-blue-500` |
| `update-password/page.tsx` | 61 | `text-indigo-600` (Bot icon) | `text-gray-900 dark:text-gray-100` |

**Changes needed:** 8 (medium priority)

---

### 17. Dashboard Pages

| File | Line | Current | Replacement |
|---|---|---|---|
| `dashboard/page.tsx` | 57 | `bg-indigo-600` | `bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900` |
| `dashboard/dashboard-content.tsx` | 103 | `from-indigo-500 to-purple-600` (avatar) | `bg-gray-800 dark:bg-gray-700` |
| `dashboard/reviews/reviews-content.tsx` | 40 | `text-indigo-600` (icon) | `text-gray-600` |
| `dashboard/reviews/reviews-content.tsx` | 58 | `hover:text-indigo-600` | `hover:text-blue-600` |
| `dashboard/reviews/reviews-content.tsx` | 100 | `hover:text-indigo-600` | `hover:text-blue-600` |
| `dashboard/profile/profile-content.tsx` | 79 | `text-indigo-600` (Mail icon) | `text-gray-600` |
| `dashboard/profile/profile-content.tsx` | 99 | `text-indigo-600` (User icon) | `text-gray-600` |

**Changes needed:** 7 (medium priority)

---

### 18. Admin Panel — `app/admin/admin-content.tsx`

| Line | Current | Replacement |
|---|---|---|
| 107 | `text-indigo-600` (ShieldCheck) | `text-gray-600` |
| 117 | `text-indigo-500` (Bot) | `text-gray-600` |
| 277 | `text-indigo-600` (link) | `text-blue-500` |
| 315 | `text-indigo-600` (link) | `text-blue-500` |

**Changes needed:** 4 (low priority — admin-only page)

---

### 19. Compare Page — `app/compare/compare-client.tsx`

| Line | Current | Replacement |
|---|---|---|
| 117 | `text-indigo-600` (icon) | `text-gray-600` |
| 127 | `from-indigo-500 to-purple-600` (avatar) | `bg-gray-800 dark:bg-gray-700` |
| 130 | `hover:text-indigo-600` | `hover:text-blue-600` |
| 134 | `text-indigo-600` (badge) | `text-blue-500` |

**Changes needed:** 4 (medium priority)

---

### 20. Agent Detail Page — `app/agents/[slug]/page.tsx`

| Line | Current | Replacement |
|---|---|---|
| 179 | `bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200` (freemium) | `bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200` |
| 235 | `from-indigo-500 to-purple-600` (avatar) | `bg-gray-800 dark:bg-gray-700` |
| 242 | `text-indigo-600` (BadgeCheck) | `text-blue-500` |

**Changes needed:** 3 (medium priority)

---

### 21. Agent Sub-Components

| File | Line | Current | Replacement |
|---|---|---|---|
| `agent-capabilities.tsx` | 82 | `text-indigo-600` | `text-gray-600` |
| `agent-capabilities.tsx` | 95 | `bg-indigo-100 dark:bg-indigo-900/50` | `bg-gray-100 dark:bg-gray-800` |
| `agent-capabilities.tsx` | 96 | `text-indigo-600 dark:text-indigo-400` | `text-gray-600 dark:text-gray-400` |
| `agent-requirements.tsx` | 93 | `text-indigo-600` | `text-gray-600` |
| `agent-install.tsx` | 86 | `text-indigo-600` | `text-gray-600` |
| `agent-pricing.tsx` | 101 | `text-indigo-600` (Star) | `text-amber-500` |
| `agent-pricing.tsx` | 113 | `bg-indigo-600` (toggle) | `bg-gray-900 dark:bg-gray-100` |
| `agent-pricing.tsx` | 148 | `border-indigo-200 dark:border-indigo-800` | `border-blue-200 dark:border-blue-800` |
| `agent-pricing.tsx` | 150 | `bg-indigo-600` (badge) | `bg-amber-500` |
| `agent-pricing.tsx` | 172 | `text-indigo-600` (Check) | `text-green-500` |

**Changes needed:** 10 (medium-high priority)

---

### 22. Miscellaneous Pages

| File | Line | Current | Replacement |
|---|---|---|---|
| `app/not-found.tsx` | 11 | `from-indigo-600 to-purple-600` | `from-gray-600 to-gray-400` |
| `app/not-found.tsx` | 14 | `bg-indigo-500/10` | `bg-gray-500/10` |
| `app/loading.tsx` | 6 | `border-t-indigo-600` | `border-t-gray-900 dark:border-t-gray-100` |
| `app/changelog/page.tsx` | 107 | `border-indigo-600` | `border-blue-500` |
| `app/changelog/page.tsx` | 113 | `bg-indigo-600` | `bg-amber-500` |
| `app/categories/[slug]/page.tsx` | 101 | `text-indigo-600` | `text-blue-500` |
| `feedback-inline.tsx` | 58 | `ring-indigo-500 border-indigo-500` | `ring-blue-500 border-blue-500` |
| `app/global-error.tsx` | 48 | `bg-indigo-600` | `bg-gray-900 dark:bg-gray-100` |

**Changes needed:** 8 (low-medium priority)

---

## Priority-Ranked Change List

### 🔴 CRITICAL (Do First — Highest Visibility Impact)

These changes affect components rendered on every page or every card, so fixing them has multiplicative impact.

| # | Component | What to Fix | Est. Refs Eliminated |
|---|---|---|---|
| C1 | `agent-card.tsx` | Replace avatar gradient, hover borders, text hovers, verify badge | 7 |
| C2 | `categories-grid.tsx` | Replace icon container indigo with per-category colors | 2 |
| C3 | `how-it-works.tsx` | Replace icon containers and step badges with neutrals | 2 |
| C4 | `pricing/strategy-section.tsx` | Full neutralization of this section | 13 |
| C5 | `pricing/page.tsx` | Background, popular card border, badge | 3 |

**Subtotal: 27 references eliminated**

### 🟠 HIGH (Do Second — Prominent Sections)

| # | Component | What to Fix | Est. Refs Eliminated |
|---|---|---|---|
| H1 | `hero-section.tsx` | Pill badge, search focus ring | 2 |
| H2 | `trending-agents.tsx` | Card hover, avatar, text hover | 3 |
| H3 | Legal pages (all 4) | Bulk replace `text-indigo-600` → `text-blue-500` | 25 |
| H4 | Agent sub-components | Capabilities, requirements, install, pricing | 10 |

**Subtotal: 40 references eliminated**

### 🟡 MEDIUM (Do Third — Secondary Pages)

| # | Component | What to Fix | Est. Refs Eliminated |
|---|---|---|---|
| M1 | `mobile-nav.tsx` | All hover states + logo icon | 6 |
| M2 | Auth pages (4 files) | Logo icon + links | 8 |
| M3 | Dashboard pages | Icons, avatar, links, button | 7 |
| M4 | Compare page | Icon, avatar, hovers, badge | 4 |
| M5 | Agent detail page | Avatar, badge, freemium | 3 |

**Subtotal: 28 references eliminated**

### 🟢 LOW (Do Last — Low-Traffic / Utility Pages)

| # | Component | What to Fix | Est. Refs Eliminated |
|---|---|---|---|
| L1 | `navbar.tsx` | Bot logo icon | 1 |
| L2 | `footer.tsx` | Bot logo icon | 1 |
| L3 | `not-found.tsx` | Gradient + blob | 2 |
| L4 | `loading.tsx` | Spinner accent | 1 |
| L5 | `changelog/page.tsx` | Timeline dot + badge | 2 |
| L6 | `feedback-inline.tsx` | Focus ring | 1 |
| L7 | `global-error.tsx` | Button bg | 1 |
| L8 | `categories/[slug]/page.tsx` | Link | 1 |
| L9 | Admin panel | Icons + links | 4 |

**Subtotal: 14 references eliminated**

---

## Projected Final State

| Priority | Eliminated | Remaining (allowed accent) |
|---|---|---|
| 🔴 Critical | 27 | 117 |
| 🟠 High | 40 | 77 |
| 🟡 Medium | 28 | 49 |
| 🟢 Low | 14 | 35 |

After all changes: **~35 allowed references** remaining (including hero gradient blobs, CTA banner gradient, and a few intentional accents). Some of these 35 are in the hero and CTA sections where indigo/purple is explicitly allowed per brand guidelines.

**To reach < 30 target:** Remove 5-6 more from the Low priority batch (admin panel icons, loading spinner, etc.).

---

## Recommendations: Making It Feel Premium

### 1. Replace Indigo Avatars with Agent-Specific Colors
The `from-indigo-500 to-purple-600` gradient avatar appears on every agent card, trending card, detail page, compare page, and dashboard. This is the single most impactful visual change.

**Fix:** Use deterministic color assignment based on category or agent name hash:
```
Automation → bg-blue-600
Research → bg-emerald-600  
Customer Support → bg-amber-600
Marketing → bg-rose-600
Developer Tools → bg-violet-600
Finance → bg-cyan-600
Default → bg-gray-800
```

### 2. Introduce Per-Category Icon Colors
Instead of all category icons being indigo, use semantically meaningful colors:
```
Zap (Automation) → text-amber-500, bg-amber-100
Search (Research) → text-blue-500, bg-blue-100
MessageSquare (Support) → text-green-500, bg-green-100
Code (Dev Tools) → text-violet-500, bg-violet-100
Megaphone (Marketing) → text-rose-500, bg-rose-100
TrendingUp (Growth) → text-emerald-500, bg-emerald-100
```

### 3. Step Progression in "How It Works"
Use a color gradient across the 3 steps to suggest progression:
```
Step 1 (Discover) → blue (exploration)
Step 2 (Evaluate) → amber (assessment)
Step 3 (Deploy) → green (action/success)
```

### 4. Neutralize the Bot Logo Icon
The `text-indigo-600` on the Bot icon appears in navbar, footer, mobile nav, and all auth pages (8+ instances). Change to `text-gray-900 dark:text-gray-100` (or keep `text-foreground`). If brand identity requires a colored logo, use a single SVG file instead of relying on Lucide icon + Tailwind class.

### 5. Standardize Link Color to `text-blue-500`
Replace all `text-indigo-600 hover:underline` link patterns with `text-blue-500 hover:underline`. Blue is the brand-specified link color and is visually distinct enough from the accent gradient while maintaining accessibility.

### 6. Replace "Most Popular" Badge with Amber
The `bg-indigo-600` "Most Popular" badge on pricing is an unnecessary indigo usage. Use `bg-amber-500` to match the brand's "ratings/badges" color guideline. This also creates better visual hierarchy — amber stands out more on a white card than indigo does.

### 7. Remove Pricing Page Background Gradient
`from-white to-indigo-50` is a subtle but unnecessary indigo bleed. Use `bg-white` or `bg-gray-50` for a cleaner, more premium feel.

### 8. Loading/Error States Should Be Neutral
Loading spinner (`border-t-indigo-600`), 404 page gradient, and error page button should all use neutral grays. These are utility pages — they don't benefit from brand color.

---

## Quick Wins: Bulk Find & Replace

These can be done as a single `sed` or IDE find-replace across the codebase:

| Find | Replace | Files | Count |
|---|---|---|---|
| `text-indigo-600 hover:underline` | `text-blue-500 hover:underline` | Legal pages, auth, categories | ~30 |
| `text-indigo-600` (icon contexts) | `text-gray-600` | Admin, dashboard, agent detail | ~15 |
| `hover:text-indigo-600` | `hover:text-blue-600` | Mobile nav, cards, compare | ~12 |
| `hover:border-indigo-200 dark:hover:border-indigo-800` | `hover:border-blue-200 dark:hover:border-blue-800` | Cards, categories | ~4 |
| `bg-indigo-600` | `bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900` | Buttons, badges, toggles | ~5 |
| `from-indigo-500 to-purple-600` | `bg-gray-800 dark:bg-gray-700` | Agent avatars | ~5 |

**These bulk replacements alone would eliminate ~71 references (~49% of total).**

---

## Appendix: What Should Stay Indigo/Purple

After all changes, these references should remain (intentional brand accent usage):

| File | Line | Class | Reason |
|---|---|---|---|
| `hero-section.tsx` | 14 | `from-indigo-50/50` | Hero background — allowed |
| `hero-section.tsx` | 17 | `bg-indigo-500/10` | Hero decoration blob — allowed |
| `hero-section.tsx` | 18 | `bg-purple-500/10` | Hero decoration blob — allowed |
| `hero-section.tsx` | 30 | `from-indigo-600 to-purple-600` | Hero heading accent — allowed |
| `app/page.tsx` | 133 | `from-indigo-600 to-purple-600` | Bottom CTA banner — allowed |
| `app/page.tsx` | 135 | `text-indigo-100` | Text on CTA gradient — allowed |
| `app/page.tsx` | 139 | `text-indigo-600 hover:bg-indigo-50` | Button on CTA gradient — allowed |

**Total allowed: ~7 references** (all in hero + CTA — the two places brand guidelines explicitly permit the gradient).

All other indigo/purple should be replaced with neutral or blue.

---

## Implementation Order Recommendation

1. **Phase 1 (30 min):** Bulk find-and-replace for link colors and hover states (~71 refs)
2. **Phase 2 (1 hr):** Agent card component overhaul (7 refs but huge visual impact)
3. **Phase 3 (1 hr):** Categories grid + How It Works per-category coloring
4. **Phase 4 (1 hr):** Pricing page + strategy section neutralization
5. **Phase 5 (30 min):** Auth pages + dashboard + mobile nav
6. **Phase 6 (15 min):** Navbar/footer icons, loading/error states, misc

**Total estimated effort: ~4.25 hours of focused work.**

---

*Report generated by UI/UX Brand Compliance Auditor — 2026-04-12*
