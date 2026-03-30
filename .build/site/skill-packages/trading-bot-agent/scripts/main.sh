#!/usr/bin/env bash
# Trading Bot Agent — Main Entry Point
set -euo pipefail
echo "🚀 Trading Bot Agent v1.0.0"
echo "   Pair: ${PAIR:-BTC/USDT}"
echo "   Timeframe: ${TIMEFRAME:-4h}"
echo "   RSI Entry: ${RSI_ENTRY:-74} / Exit: ${RSI_EXIT:-24}"
