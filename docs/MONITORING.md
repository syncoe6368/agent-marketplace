# Monitoring Setup — Agent Marketplace

> Production monitoring guide for uptime tracking and alerting.

## Architecture

```
[Cron every 5 min] → monitor.sh → GET /api/health → Discord Webhook (on failure)
```

## Health Endpoint

**`GET /api/health`** returns:

```json
{
  "status": "healthy",       // healthy | degraded | unhealthy
  "timestamp": "2026-04-05T00:20:00Z",
  "version": "0.1.0",
  "uptime": 86400,
  "checks": {
    "database": {
      "status": "healthy",
      "latency_ms": 42,
      "agent_count": 22,
      "category_count": 6
    },
    "api": { "status": "healthy" }
  }
}
```

- **healthy**: 200 OK — all systems normal
- **degraded**: 200 OK — DB slow or partial failure
- **unhealthy**: 503 — DB unreachable

## Setup (5 minutes)

### 1. Create Discord Webhook

1. Go to your Discord server → `#agent-marketplace` channel settings → Integrations → Webhooks
2. Create webhook named "AgentHub Monitor"
3. Copy the webhook URL

### 2. Set Environment Variables

Add to your `.env.local` or hosting platform env vars:

```env
MONITOR_TARGET_URL=https://your-agent-marketplace-domain.com
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
MONITOR_TIMEOUT=15
MONITOR_RETRIES=2
```

### 3. Schedule Cron Job

**On Vercel (recommended):** Use a free monitoring service instead:
- [UptimeRobot](https://uptimerobot.com) — Free, 5-min intervals, 50 monitors
- [BetterUptime](https://betteruptime.com) — Free tier available
- Point monitor to `https://your-domain.com/api/health`
- Set expected status code: `200`

**On a VPS/self-hosted:**

```bash
# Edit crontab
crontab -e

# Add this line (runs every 5 minutes)
*/5 * * * * /path/to/agent_marketplace/scripts/monitor.sh >> /var/log/agenthub-monitor.log 2>&1
```

### 4. Verify

```bash
# Test health endpoint
curl https://your-domain.com/api/health | python3 -m json.tool

# Test monitor script
DISCORD_WEBHOOK_URL="" MONITOR_TARGET_URL=https://your-domain.com ./scripts/monitor.sh
```

## Free Monitoring Services

| Service | Free Tier | Interval | Alerts |
|---------|-----------|----------|--------|
| UptimeRobot | 50 monitors | 5 min | Email, webhook, Slack |
| BetterUptime | 1 monitor | 3 min | Email, webhook |
| Pingdom | 1 monitor | 1 min | Email |
| Instatus | Free | 5 min | Status page |

**Recommended:** UptimeRobot + Discord webhook for redundancy.

## Alert Flow

1. Monitor detects `status != healthy` or HTTP error
2. Retries 2 times with 5-second gaps
3. If still failing → sends Discord embed with details
4. Logs timestamp, HTTP code, and response body

## Metrics Tracked

- **Uptime percentage** (via monitoring service dashboard)
- **DB latency** (in health response)
- **Agent count** (in health response, tracks data integrity)
- **Response time** (via monitoring service)

## Post-Incident

After an incident:
1. Check `/api/health` for current status
2. Check Vercel logs: `vercel logs`
3. Check Supabase dashboard: https://supabase.com/dashboard/project/ouqqqstjnfkpcndvrxoc
4. Review `agent_marketplace/app/api/errors` endpoint for recent client-side errors
