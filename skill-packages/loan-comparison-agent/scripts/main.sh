#!/usr/bin/env bash
# Loan Comparison Agent — Main Script
# Starts the PinjamanCompare application

set -euo pipefail

ACTION="${1:-dev}"

echo "💰 Loan Comparison Agent (PinjamanCompare)"
echo ""

case "$ACTION" in
  dev)
    echo "Starting development server..."
    echo "Visit http://localhost:3000"
    npx next dev
    ;;
  build)
    echo "Building for production..."
    npx next build
    ;;
  calc)
    echo "EMI Calculator"
    echo "Usage: $0 calc <principal> <rate%> <tenure_months>"
    ;;
  *)
    echo "Usage: $0 [dev|build|calc]"
    ;;
esac
