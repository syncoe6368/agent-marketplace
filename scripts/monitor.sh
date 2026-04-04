#!/usr/bin/env bash
# =============================================================
# AgentHub / Agent Marketplace — Uptime Monitor + Discord Alerts
# =============================================================
# Run via cron every 5 minutes:
#   */5 * * * * /path/to/scripts/monitor.sh >> /var/log/agenthub-monitor.log 2>&1
#
# Required env vars (or set in .env.local):
#   MONITOR_TARGET_URL  — e.g. https://your-domain.com
#   DISCORD_WEBHOOK_URL — Discord channel webhook for alerts
#
# Optional:
#   MONITOR_TIMEOUT     — curl timeout in seconds (default: 15)
#   MONITOR_RETRIES     — retry count before alerting (default: 2)
# =============================================================

set -euo pipefail

# Load env
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

if [[ -f "$PROJECT_DIR/.env.local" ]]; then
  set -a; source "$PROJECT_DIR/.env.local"; set +a
fi

TARGET_URL="${MONITOR_TARGET_URL:-${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}}"
WEBHOOK="${DISCORD_WEBHOOK_URL:-}"
TIMEOUT="${MONITOR_TIMEOUT:-15}"
RETRIES="${MONITOR_RETRIES:-2}"
HEALTH_ENDPOINT="${TARGET_URL}/api/health"

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

send_discord_alert() {
  local title="$1" description="$2" color="$3"

  if [[ -z "$WEBHOOK" ]]; then
    log "⚠️  No DISCORD_WEBHOOK_URL set — skipping Discord alert"
    return
  fi

  curl -s -X POST "$WEBHOOK" \
    -H "Content-Type: application/json" \
    -d "$(cat <<EOF
{
  "embeds": [{
    "title": "🚨 AgentHub: ${title}",
    "description": "${description}",
    "color": ${color},
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "footer": {"text": "AgentHub Monitor"}
  }]
}
EOF
)" > /dev/null 2>&1
}

# === Health Check ===
FAIL_COUNT=0
RESPONSE=""
HTTP_CODE=0

for i in $(seq 1 $((RETRIES + 1))); do
  HTTP_CODE=$(curl -s -o /tmp/agenthub-health.json -w "%{http_code}" \
    --max-time "$TIMEOUT" "$HEALTH_ENDPOINT" 2>/dev/null || echo "000")

  if [[ "$HTTP_CODE" == "200" ]]; then
    RESPONSE=$(cat /tmp/agenthub-health.json)
    STATUS=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('status','unknown'))" 2>/dev/null || echo "parse_error")

    if [[ "$STATUS" == "healthy" ]]; then
      DB_LATENCY=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['checks']['database']['latency_ms'])" 2>/dev/null || echo "?")
      AGENT_COUNT=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['checks']['database']['agent_count'])" 2>/dev/null || echo "?")

      log "${GREEN}✅ HEALTHY${NC} | DB: ${DB_LATENCY}ms | Agents: ${AGENT_COUNT} | Attempt: $i/$((RETRIES+1))"
      exit 0
    elif [[ "$STATUS" == "degraded" ]]; then
      log "${YELLOW}⚠️  DEGRADED${NC} | Attempt: $i/$((RETRIES+1))"
      if [[ $i -gt $RETRIES ]]; then
        send_discord_alert "Service Degraded" "Health endpoint returned degraded status after $((RETRIES+1)) attempts.\n\nURL: ${HEALTH_ENDPOINT}\nResponse: ${RESPONSE}" "16776960"
      fi
      exit 1
    else
      FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
  else
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi

  if [[ $i -le $RETRIES ]]; then
    sleep 5
  fi
done

# All retries failed
log "${RED}❌ UNHEALTHY${NC} | HTTP: ${HTTP_CODE} | Attempts: $((RETRIES+1))"

send_discord_alert "Service Down" \
  "Health check failed after $((RETRIES+1)) attempts.\n\nHTTP Status: ${HTTP_CODE}\nURL: ${HEALTH_ENDPOINT}\nTime: $(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  "15158332"

exit 1
