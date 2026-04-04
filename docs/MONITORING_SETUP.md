# Monitoring Setup Guide — AgentHub

## Error Tracking (Built-in)

AgentHub has a built-in error tracking endpoint at `/api/errors`:
- Client-side errors are caught by `global-error.tsx` and sent to `/api/errors`
- Errors are stored in-memory (resets on redeploy) — suitable for MVP
- View errors: `GET /api/errors` (requires Authorization header)

### Upgrade to Sentry (Recommended for Production)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Sentry free tier: 5K errors/month, 10K transactions/month.

---

## Uptime Monitoring

### Option 1: UptimeRobot (Free — 50 monitors)

1. Sign up at https://uptimerobot.com
2. Create monitor:
   - Type: HTTP(s)
   - URL: `https://agentmarketplace-kohl.vercel.app`
   - Check interval: 5 minutes
   - Alert via: Email, Discord webhook, Slack
3. Add status page (optional): `https://stats.uptimerobot.com/your-id`

### Option 2: BetterUptime (Free — 10 monitors)

1. Sign up at https://betteruptime.com
2. Create monitor:
   - URL: `https://agentmarketplace-kohl.vercel.app`
   - Check every: 3 minutes
   - Regions: Singapore + US East
3. Configure escalation: Email → Discord webhook

### Discord Webhook Setup

1. In Discord: Server Settings → Integrations → Webhooks
2. Create webhook in #agent-marketplace channel
3. Copy webhook URL into monitoring service alert settings

---

## Analytics (Privacy-First)

### Option 1: Plausible Analytics (Recommended)

- No cookies, GDPR compliant, no cookie banner needed
- Self-hosted (free) or cloud ($9/mo for 10K pageviews)
- Add to `layout.tsx`:

```tsx
<script defer data-domain="agentmarketplace-kohl.vercel.app" src="https://plausible.io/js/script.js" />
```

### Option 2: Umami (Self-hosted, Free)

- Self-hosted on Vercel/Railway with a PostgreSQL database
- Fully open source, GDPR compliant
- Track: pageviews, referrers, devices, countries

### Option 3: Vercel Analytics (Built-in)

```bash
npm install @vercel/analytics
```

Add to `layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';
// Add <Analytics /> inside <body>
```

Free on Vercel: Web Vitals + pageviews.

---

## Recommended MVP Stack

| Component | Service | Cost |
|-----------|---------|------|
| Uptime | UptimeRobot | Free |
| Errors | Built-in → Sentry free | Free |
| Analytics | Vercel Analytics | Free |
| Alerts | Discord webhook | Free |

**Total monitoring cost: $0/month**

---

*Setup time: ~30 minutes for all three services*
