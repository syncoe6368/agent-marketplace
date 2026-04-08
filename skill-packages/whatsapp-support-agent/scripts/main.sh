#!/usr/bin/env bash
# WhatsApp Support Agent — Main Script
# Starts the WhatsApp Business webhook listener

set -euo pipefail

ACTION="${1:-start}"

echo "💬 WhatsApp Support Agent"
echo ""

case "$ACTION" in
  start)
    echo "Starting WhatsApp webhook listener..."
    echo "Requires WHATSAPP_BUSINESS_TOKEN and SUPABASE_URL env vars."
    echo ""
    echo "Endpoints:"
    echo "  GET  /api/webhook  — Verification"
    echo "  POST /api/webhook  — Message handler"
    ;;
  test)
    echo "Running test suite..."
    echo "Requires test credentials in .env.test"
    ;;
  *)
    echo "Usage: $0 [start|test]"
    ;;
esac
