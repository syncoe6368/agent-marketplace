# AgentHub — AI Agent Marketplace

The #1 marketplace for discovering, comparing, and deploying AI agents.

## Features

- **Agent Discovery** — Browse, search, and filter AI agents across categories
- **Reviews & Ratings** — Community-driven reviews with star ratings
- **Creator Dashboard** — Manage your agent listings, view analytics
- **Multi-category Support** — Automation, Research, Customer Support, Development, Marketing, Finance
- **Pricing Models** — Free, Paid, Freemium, Subscription
- **Featured Listings** — Promote your agents with featured placement
- **Verified Badges** — Build trust with verified agent status
- **Auth** — Email/password + GitHub + Google OAuth via Supabase
- **Skill Package API** — Browse, download, and install skill packages programmatically
- **Admin Dashboard** — Listing moderation, user management
- **Dark Mode** — System-aware theme toggle
- **Responsive** — Mobile-first design
- **SEO** — Full meta tags, Open Graph, semantic HTML

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Icons:** Lucide React
- **Themes:** next-themes

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account

### Setup

1. **Clone and install:**
   ```bash
   git clone <repo-url>
   cd agent-marketplace
   npm install
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the migration in `supabase/migrations/001_initial_schema.sql`
   - Copy your Project URL and Anon Key

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Run the dev server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── agents/             # Browse & agent detail pages
│   ├── auth/               # Login, signup, OAuth callback
│   ├── categories/         # Category browse & detail
│   ├── dashboard/          # Creator dashboard & agent editing
│   ├── pricing/            # Pricing page
│   └── submit/             # Agent submission form
├── components/
│   ├── agents/             # Agent cards, search, reviews
│   ├── landing/            # Hero, featured, categories, how-it-works
│   ├── layout/             # Navbar, footer, theme toggle
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── supabase/           # Supabase client, server, middleware
│   └── utils.ts            # Utility functions
├── types/                  # TypeScript type definitions
└── middleware.ts            # Auth session middleware
```

## Skill Package Distribution API

The `/api/skills` endpoints enable programmatic discovery and installation of skill packages:

| Endpoint | Description |
|----------|-------------|
| `GET /api/skills` | List all skill packages with filtering (category, tag, model, search, sort) |
| `GET /api/skills/[slug]` | Get skill package details (manifest + optional SKILL.md + file listing) |
| `GET /api/skills/[slug]/download?file=<path>` | Download individual files (whitelist-secured) |
| `GET /api/skills/[slug]/install` | Generate install instructions or shell script (`?format=sh`) |
| `POST /api/skills/upload` | Upload a new skill package (auth required, multipart/form-data) |
| `GET /api/skills/[slug]/versions` | Get version history, changelog, and update notifications (`?since=<semver>`) |

### Example: Install a skill
```bash
# List available skills
curl https://agenthub.example.com/api/skills

# Get skill details
curl https://agenthub.example.com/api/skills/code-review-agent

# Download the SKILL.md
curl -LO https://agenthub.example.com/api/skills/code-review-agent/download?file=SKILL.md

# Get install script
curl https://agenthub.example.com/api/skills/code-review-agent/install?format=sh | bash

# Check for updates since version 0.9.0
curl https://agenthub.example.com/api/skills/code-review-agent/versions?since=0.9.0
```

### Example: Upload a skill package
```bash
# Upload a new skill package (requires auth)
curl -X POST https://agenthub.example.com/api/skills/upload \
  -H "Cookie: <auth-cookie>" \
  -F 'manifest={"name":"My Agent","version":"1.0.0","description":"...","category":"automation","pricingModel":"free","author":"me"}' \
  -F 'SKILL.md=@./SKILL.md' \
  -F 'scripts/main.sh=@./scripts/main.sh'
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Other Platforms

```bash
npm run build
npm start
```

## Roadmap

- [ ] Stripe payment integration for featured listings
- [x] Admin moderation panel
- [ ] Agent comparison tool
- [ ] Newsletter / notifications
- [x] Skill Package Distribution API
- [ ] Social sharing & embeds
- [ ] Agent analytics dashboard (charts)
- [ ] Multi-language support
- [x] Skill package upload API (creator-submitted)
- [x] Skill package versioning and changelog tracking

## License

MIT
