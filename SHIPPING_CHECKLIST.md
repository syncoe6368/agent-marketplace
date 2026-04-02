# Agent Marketplace — Product Shipping Readiness Checklist

> **Goal:** MVP launch ready to accept first agent listings and generate revenue
> **Target:** 7-day sprint
> **Last Updated:** 2026-03-27

---

## 1. Foundation & Setup

- [ ] Repository initialized (Next.js + Supabase)
- [ ] CI/CD pipeline configured (GitHub Actions → Vercel)
- [ ] Development environment documented (`CONTRIBUTING.md`)
- [ ] Environment variables template created (`.env.example`)
- [ ] Domain / subdomain secured (e.g. `agentmarketplace.io`)
- [ ] SSL / HTTPS active
- [ ] Supabase project created (DB, Auth, Storage)

## 2. Core Architecture

- [ ] Database schema designed & migrated
  - [ ] `agents` table (name, description, category, pricing_model, api_url, creator_id, status, created_at)
  - [ ] `users` table (via Supabase Auth)
  - [ ] `reviews` table (rating, comment, user_id, agent_id, created_at)
  - [ ] `categories` table (name, slug, icon, description)
  - [ ] `transactions` table (for future payment tracking)
- [ ] API routes defined
  - [ ] `GET /api/agents` — list/search agents
  - [ ] `GET /api/agents/[id]` — single agent detail
  - [ ] `POST /api/agents` — create listing (auth required)
  - [ ] `PUT /api/agents/[id]` — update listing (owner only)
  - [ ] `DELETE /api/agents/[id]` — remove listing (owner/admin)
  - [ ] `POST /api/reviews` — submit review
  - [ ] `GET /api/categories` — list categories
- [ ] Row-Level Security (RLS) policies on all tables
- [ ] Rate limiting on API endpoints

## 3. Authentication & User Flows

- [ ] User sign-up (email/password)
- [ ] User sign-in (email/password)
- [ ] OAuth sign-in (Google, GitHub)
- [ ] Password reset flow
- [ ] User profile page
- [ ] "List Your Agent" onboarding flow
  - [ ] Step 1: Basic info (name, description, category)
  - [ ] Step 2: Configuration (pricing model, API/endpoint)
  - [ ] Step 3: Preview & submit
- [ ] Admin dashboard for listing moderation

## 4. Frontend — Public Pages

- [ ] **Landing page** (hero, value prop, CTA, featured agents)
- [ ] **Agent browse/discovery** (search bar, category filters, sort options)
- [ ] **Agent detail page** (description, reviews, pricing, "Try it" button)
- [ ] **Category pages** (browse by category)
- [ ] **Search results page** (with filters)
- [ ] **Footer** (links, legal, socials)
- [ ] Responsive design (mobile-first)
- [ ] Dark/light mode toggle

## 5. Frontend — Creator Dashboard

- [ ] My agents list (with status: pending/active/suspended)
- [ ] Edit agent form
- [ ] View reviews on my agents
- [ ] Basic analytics (views, clicks, reviews count)

## 6. Search & Discovery

- [ ] Full-text search on agent name + description
- [ ] Filter by category
- [ ] Filter by pricing model (free, paid, freemium, subscription)
- [ ] Sort by (newest, top rated, most popular)
- [ ] Featured/boosted listings logic

## 7. Reviews & Ratings

- [ ] Star rating (1-5) submission
- [ ] Text review submission
- [ ] Average rating display on agent cards
- [ ] Review listing on agent detail page
- [ ] Spam/abuse basic protection (auth required, one review per user per agent)

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

- [ ] Meta tags on all pages (title, description, Open Graph)
- [ ] `robots.txt` configured
- [ ] `sitemap.xml` auto-generated
- [ ] Semantic HTML throughout
- [ ] Page loading performance (Lighthouse score > 90)
- [ ] Favicon and OG images created

## 10. Legal & Compliance

- [ ] Terms of Service page
- [ ] Privacy Policy page
- [ ] Cookie consent banner (if applicable)
- [ ] Agent listing guidelines / rules
- [ ] DMCA / takedown policy

## 11. Launch Preparation

- [ ] 3-5 seed agent listings created
- [ ] 3 categories populated with descriptions
- [ ] Social media accounts created (X, Discord, etc.)
- [ ] Launch announcement draft ready
- [ ] Submission to Product Hunt / Hacker News / relevant directories
- [ ] Error tracking configured (Sentry or similar)
- [ ] Analytics configured (Plausible / Umami / Google Analytics)

## 12. Security

- [ ] Supabase RLS policies reviewed
- [ ] Input sanitization on all forms
- [ ] CSRF protection active
- [ ] Environment secrets not committed to repo
- [ ] Content Security Policy headers set
- [ ] Dependency audit (`npm audit`) passing with no criticals

## 13. Monitoring & Post-Launch

- [ ] Uptime monitoring configured (BetterUptime / UptimeRobot)
- [ ] Error alerting to Discord/email
- [ ] User feedback collection method (form, email, or widget)
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

## Notes

- **v1 is a discovery platform, not a hosting platform.** Agents link out to their own endpoints/platforms. This massively reduces complexity.
- **Payments can be v1.1** if it delays launch. Start with free listings + manual featured placement to validate demand first.
- **Creator dashboard** can be a simple admin view initially — full self-serve can come later.
