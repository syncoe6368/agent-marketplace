#!/usr/bin/env bash
# SecurityPad Auditor — Smart Contract Security Audit Script
# Usage: ./audit.sh <contract.sol | contract_directory>
set -euo pipefail

CONTRACT_PATH="${1:-}"
API_URL="${SECURITYPAD_API_URL:-https://securitypad-api.onrender.com}"
OUTPUT_FORMAT="${OUTPUT_FORMAT:-json}"

if [ -z "$CONTRACT_PATH" ]; then
  echo "Usage: $0 <contract.sol | contract_directory>"
  echo ""
  echo "Environment variables:"
  echo "  SECURITYPAD_API_URL  - API endpoint (default: https://securitypad-api.onrender.com)"
  echo "  OUTPUT_FORMAT        - Output format: json, markdown, sarif (default: json)"
  exit 1
fi

if [ ! -f "$CONTRACT_PATH" ] && [ ! -d "$CONTRACT_PATH" ]; then
  echo "Error: '$CONTRACT_PATH' not found"
  exit 1
fi

echo "🔍 SecurityPad — Auditing: $CONTRACT_PATH"
echo "   API: $API_URL"
echo "   Format: $OUTPUT_FORMAT"
echo ""

# Read contract source
if [ -d "$CONTRACT_PATH" ]; then
  # Zip directory for multi-file audit
  PAYLOAD=$(tar -czf - -C "$CONTRACT_PATH" . | base64)
  ENDPOINT="$API_URL/api/audit/directory"
else
  PAYLOAD=$(cat "$CONTRACT_PATH")
  ENDPOINT="$API_URL/api/audit"
fi

# Submit audit request
RESPONSE=$(curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{\"source\": \"$PAYLOAD\", \"format\": \"$OUTPUT_FORMAT\"}" \
  --max-time 120)

if [ $? -ne 0 ]; then
  echo "❌ Audit request failed — ensure API is running at $API_URL"
  exit 1
fi

# Output results
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
