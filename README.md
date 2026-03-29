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
- [ ] Admin moderation panel
- [ ] Agent comparison tool
- [ ] Newsletter / notifications
- [ ] API for programmatic agent access
- [ ] Social sharing & embeds
- [ ] Agent analytics dashboard (charts)
- [ ] Multi-language support

## License

MIT
