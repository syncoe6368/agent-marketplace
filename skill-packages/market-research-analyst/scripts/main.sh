#!/bin/bash
# Market Research Analyst - Main Entry Point

set -euo pipefail

# Default values
QUERY=""
DEPTH="standard"
OUTPUT_FORMAT="markdown"
MAX_SOURCES=20
CACHE_DURATION=6
LANGUAGE="en"
GEO_FOCUS="global"
ANALYSIS_TYPE="general"
COMPETITORS=""
TOPIC=""
TIMEFRAME=""
MONITOR=false
INTERVAL="24h"
ALERT_THRESHOLD=0.7

# Load configuration if exists
CONFIG_FILE="config.yaml"
if [[ -f "$CONFIG_FILE" ]]; then
    source <(python3 -c "
import yaml, sys
with open('$CONFIG_FILE', 'r') as f:
    config = yaml.safe_load(f)
for k, v in config.items():
    if v is not None:
        print(f'export {k.upper()}={v}')
    ")
fi

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --query)
            QUERY="$2"
            shift 2
            ;;
        --depth)
            DEPTH="$2"
            shift 2
            ;;
        --output-format)
            OUTPUT_FORMAT="$2"
            shift 2
            ;;
        --max-sources)
            MAX_SOURCES="$2"
            shift 2
            ;;
        --cache-duration)
            CACHE_DURATION="$2"
            shift 2
            ;;
        --language)
            LANGUAGE="$2"
            shift 2
            ;;
        --geo-focus)
            GEO_FOCUS="$2"
            shift 2
            ;;
        --analysis-type)
            ANALYSIS_TYPE="$2"
            shift 2
            ;;
        --competitors)
            COMPETITORS="$2"
            shift 2
            ;;
        --topic)
            TOPIC="$2"
            shift 2
            ;;
        --timeframe)
            TIMEFRAME="$2"
            shift 2
            ;;
        --monitor)
            MONITOR=true
            shift
            ;;
        --interval)
            INTERVAL="$2"
            shift 2
            ;;
        --alert-threshold)
            ALERT_THRESHOLD="$2"
            shift 2
            ;;
        --help)
            echo "Market Research Analyst"
            echo ""
            echo "Usage:"
            echo "  $0 --query \"market query\" [options]"
            echo ""
            echo "Options:"
            echo "  --query <text>              Market research query (required for general analysis)"
            echo "  --depth <level>             Research depth: basic, standard, comprehensive (default: standard)"
            echo "  --output-format <format>    Output format: markdown, html, pdf, json (default: markdown)"
            echo "  --max-sources <num>         Maximum number of sources to analyze (default: 20)"
            echo "  --cache-duration <hours>    Cache duration in hours (default: 6)"
            echo "  --language <code>           Language for research (default: en)"
            echo "  --geo-focus <region>        Geographic focus (default: global)"
            echo "  --analysis-type <type>      Analysis type: general, competitive, trend, consumer (default: general)"
            echo "  --competitors <list>        Comma-separated list of competitors for competitive analysis"
            echo "  --topic <text>              Topic for trend analysis"
            echo "  --timeframe <period>        Timeframe for analysis (e.g., '2024-2026', 'last 6 months')"
            echo "  --monitor                   Enable continuous monitoring mode"
            echo "  --interval <duration>       Monitoring interval (default: 24h)"
            echo "  --alert-threshold <value>   Threshold for alerts (0.0-1.0, default: 0.7)"
            echo "  --help                      Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Validate required arguments
if [[ -z "$QUERY" && -z "$TOPIC" && "$ANALYSIS_TYPE" != "monitor" ]]; then
    echo "Error: Either --query or --topic must be specified"
    exit 1
fi

# Create necessary directories
mkdir -p logs outputs cache

# Run the Python script
python3 scripts/research.py \
    --query "$QUERY" \
    --depth "$DEPTH" \
    --output-format "$OUTPUT_FORMAT" \
    --max-sources "$MAX_SOURCES" \
    --cache-duration "$CACHE_DURATION" \
    --language "$LANGUAGE" \
    --geo-focus "$GEO_FOCUS" \
    --analysis-type "$ANALYSIS_TYPE" \
    --competitors "$COMPETITORS" \
    --topic "$TOPIC" \
    --timeframe "$TIMEFRAME" \
    --monitor "$MONITOR" \
    --interval "$INTERVAL" \
    --alert-threshold "$ALERT_THRESHOLD" \
    --log-level "INFO"