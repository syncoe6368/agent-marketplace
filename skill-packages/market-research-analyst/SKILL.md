# Market Research Analyst

> AI-powered agent for comprehensive market research, competitor analysis, and trend identification

## Overview

The Market Research Analyst is an autonomous agent designed to conduct thorough market research, analyze competitors, identify market trends, and generate actionable insights for business strategy. It combines web scraping, data analysis, and report generation to deliver comprehensive market intelligence.

## Features

- **Automated Web Research** — Gathers data from multiple sources including news sites, industry reports, and social media
- **Competitor Analysis** — Analyzes competitor strategies, strengths, weaknesses, and market positioning
- **Trend Identification** — Identifies emerging market trends and predicts future market directions
- **Data Visualization** — Generates charts and graphs to illustrate key findings
- **Report Generation** — Creates professional market research reports with executive summaries
- **Customizable Templates** — Supports various report formats for different industries and use cases
- **Multi-language Support** — Can research and report in multiple languages
- **Scheduled Monitoring** — Can be configured for ongoing market monitoring

## Installation

\`\`\`bash
# Clone or download this skill package
git clone https://github.com/syncoe/agent-mr-analyst.git
cd market-research-analyst

# Install dependencies
pip install -r requirements.txt

# Configure API keys (if needed for external services)
cp config.example.yaml config.yaml
# Edit config.yaml with your API keys
\`\`\`

## Usage

\`\`\`bash
# Run a basic market research analysis
./scripts/main.sh --query "electric vehicle market Malaysia" --depth comprehensive

# Run competitor analysis
./scripts/main.sh --competitors "CompanyA,CompanyB,CompanyC" --analysis-type competitive

# Generate trend report
./scripts/main.sh --topic "renewable energy" --timeframe "2024-2026" --output-format pdf

# Run continuous monitoring
./scripts/main.sh --monitor --interval 24h --alert-threshold 0.7
\`\`\`

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `RESEARCH_DEPTH` | Level of research detail (basic, standard, comprehensive) | standard |
| `OUTPUT_FORMAT` | Report format (markdown, html, pdf, json) | markdown |
| `MAX_SOURCES` | Maximum number of sources to analyze | 20 |
| `CACHE_DURATION` | How long to cache research results (hours) | 6 |
| `LANGUAGE` | Language for research and reporting | en |
| `GEO_FOCUS` | Geographic focus for research | global |

## API Endpoints

If deployed as a service:
- POST `/analyze` - Run market analysis
- GET `/report/{id}` - Retrieve generated report
- GET `/trends/{topic}` - Get trend analysis for topic
- POST `/monitor` - Set up continuous monitoring

## Examples

See `docs/examples.md` for detailed usage examples.

## License

MIT

## Contributing

Contributions are welcome! Please read `CONTRIBUTING.md` for details.

## Support

For support, please open an issue on the GitHub repository or contact the maintainers.

---
*Skill ID: market-research-analyst-v1.0*
*Compatible with Agent Marketplace platform*