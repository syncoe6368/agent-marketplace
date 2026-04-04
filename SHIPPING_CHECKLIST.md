# Agent Marketplace — Product Shipping Readiness Checklist

> **Goal:** MVP launch ready to accept first agent listings and generate revenue
> **Target:** 7-day sprint
> **Last Updated:** 2026-04-03

---

## 1. Foundation & Setup

- [x] Repository initialized (Next.js + Supabase)
- [x] CI/CD pipeline configured (GitHub Actions → Vercel)
- [x] Development environment documented (`CONTRIBUTING.md`)
- [x] Environment variables template created (`.env.example`)
- [x] Domain / subdomain secured — agenthub.syncoe.com
- [x] SSL / HTTPS active (Vercel-managed)
- [x] Supabase project created (DB, Auth, Storage)

## 2. Core Architecture

- [x] Database schema designed & migrated
  - [x] `agents` table (name, description, category, pricing_model, api_url, creator_id, status, created_at)
  - [x] `users` table (via Supabase Auth)
  - [x] `reviews` table (rating, comment, user_id, agent_id, created_at)
  - [x] `categories` table (name, slug, icon, description)
  - [x] `transactions` table (for future payment tracking)
- [x] API routes defined
  - [x] `GET /api/agents` — list/search agents
  - [x] `GET /api/agents/[id]` — single agent detail
  - [x] `POST /api/agents` — create listing (auth required)
  - [x] `PUT /api/agents/[id]` — update listing (owner only)
  - [x] `DELETE /api/agents/[id]` — remove listing (owner/admin)
  - [x] `POST /api/reviews` — submit review
  - [x] `GET /api/categories` — list categories
- [x] Row-Level Security (RLS) policies on all tables
- [x] Rate limiting on API endpoints

## 3. Authentication & User Flows

- [x] User sign-up (email/password)
- [x] User sign-in (email/password)
- [x] OAuth sign-in (Google, GitHub)
- [x] Password reset flow
- [x] User profile page
- [x] "List Your Agent" onboarding flow
  - [x] Step 1: Basic info (name, description, category)
  - [x] Step 2: Configuration (pricing model, API/endpoint)
  - [x] Step 3: Preview & submit
- [x] Admin dashboard for listing moderation

## 4. Frontend — Public Pages

- [x] **Landing page** (hero, value prop, CTA, featured agents)
- [x] **Agent browse/discovery** (search bar, category filters, sort options)
- [x] **Agent detail page** (description, reviews, pricing, "Try it" button)
- [x] **Category pages** (browse by category)
- [x] **Search results page** (with filters)
- [x] **Footer** (links, legal, socials)
- [x] Responsive design (mobile-first)
- [x] Dark/light mode toggle

## 5. Frontend — Creator Dashboard

- [x] My agents list (with status: pending/active/suspended)
- [x] Edit agent form
- [x] View reviews on my agents
- [x] Basic analytics (views, clicks, reviews count)

## 6. Search & Discovery

- [x] Full-text search on agent name + description
- [x] Filter by category
- [x] Filter by pricing model (free, paid, freemium, subscription)
- [x] Sort by (newest, top rated, most popular)
- [x] Featured/boosted listings logic

## 7. Reviews & Ratings

- [x] Star rating (1-5) submission
- [x] Text review submission
- [x] Average rating display on agent cards
- [x] Review listing on agent detail page
- [x] Spam/abuse basic protection (auth required, one review per user per agent)

## 8. Payments & Monetization (v1)

- [ ] Stripe account connected
- [ ] Featured listing payment flow (one-time or monthly)
- [ ] "Verified Agent" badge purchase flow
- [ ] Payment confirmation page
- [ ] Webhook handler for payment status updates
- [ ] Featured badge display on listings
- [ ] Pricing page (public)
  - [ ] Free listing: $0
  - [ ] Featured listing: $XX/month
  - [ ] Verified badge: $XX one-time

## 9. Content & SEO

- [x] Meta tags on all pages (title, description, Open Graph)
- [x] `robots.txt` configured
- [x] `sitemap.xml` auto-generated
- [x] Semantic HTML throughout
- [x] Page loading performance (Lighthouse score > 90) — ISR caching (60s), query consolidation, preconnect, dynamic OG images
- [x] Favicon and OG images created

## 10. Legal & Compliance

- [x] Terms of Service page
- [x] Privacy Policy page
- [x] Cookie consent banner (if applicable)
- [x] Agent listing guidelines / rules
- [x] DMCA / takedown policy

## 11. Launch Preparation

- [x] 3-5 seed agent listings created (22 agents live in Supabase)
- [x] 3 categories populated with descriptions (6 categories live)
- [ ] Social media accounts created (X, Discord, etc.)
- [x] Launch announcement draft ready (docs/LAUNCH_ANNOUNCEMENT.md)
- [x] Submission to Product Hunt / Hacker News / relevant directories (content ready in docs/PRODUCT_HUNT_SUBMISSION.md + docs/DIRECTORY_SUBMISSIONS.md)
- [x] Error tracking configured (built-in /api/errors endpoint + global-error.tsx)
- [x] Analytics configured (Vercel Analytics — free Web Vitals + pageviews)

## 12. Security

- [x] Supabase RLS policies reviewed (audit: `docs/RLS_AUDIT_2026-04-04.md`)
- [x] Input sanitization on all forms
- [x] CSRF protection active (CSP + SameSite cookies)
- [x] Environment secrets not committed to repo
- [x] Content Security Policy headers set
- [x] Dependency audit (`npm audit`) passing with no criticals

## 13. Monitoring & Post-Launch

- [x] Uptime monitoring configured (health endpoint + scripts/monitor.sh + docs/MONITORING.md)
- [x] Error alerting to Discord/email — real-time Discord webhook via /api/errors + cron monitor.sh
- [x] User feedback collection method (form, email, or widget) — floating feedback widget + POST /api/feedback with rate limiting + localStorage fallback
- [ ] Post-launch support channel ready (Discord server or email)

---

## Priority Order (MVP Critical Path)

| Priority | Section | Estimated Time |
|----------|---------|----------------|
| 🔴 P0 | Foundation & Setup | 0.5 day |
| 🔴 P0 | Core Architecture | 1.5 days |
| 🔴 P0 | Frontend — Public Pages | 2 days |
| 🟡 P1 | Authentication & User Flows | 1 day |
| 🟡 P1 | Search & Discovery | 0.5 day |
| 🟡 P1 | Reviews & Ratings | 0.5 day |
| 🟡 P1 | Content & SEO | 0.5 day |
| 🟢 P2 | Payments & Monetization | 1 day |
| 🟢 P2 | Creator Dashboard | 1 day |
| 🟢 P2 | Launch Preparation | 0.5 day |
| 🔵 P3 | Legal & Compliance | 0.5 day |
| 🔵 P3 | Security hardening | 0.5 day |
| 🔵 P3 | Monitoring & Post-Launch | 0.5 day |

**P0 items = must ship. P1 = should ship. P2/P3 = can follow in v1.1.**

---

## 14. Skill Package Distribution API

- [x] `GET /api/skills` — List/search/filter skill packages
- [x] `GET /api/skills/[slug]` — Get skill package details (manifest + optional SKILL.md + file listing)
- [x] `GET /api/skills/[slug]/download?file=<path>` — Download individual skill files (whitelist security)
- [x] `GET /api/skills/[slug]/install` — Generate install instructions and shell scripts
- [x] Skill package upload API (creator-submitted packages)
- [x] Skill package versioning and update notifications

## Notes

- **v1 is a discovery platform, not a hosting platform.** Agents link out to their own endpoints/platforms. This massively reduces complexity.
- **Payments can be v1.1** if it delays launch. Start with free listings + manual featured placement to validate demand first.
- **Creator dashboard** can be a simple admin view initially — full self-serve can come later.
