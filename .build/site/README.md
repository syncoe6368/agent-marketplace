# Agent Marketplace — Static Site Build

Generated: 2026-03-29T22:19:59Z

## Directory Structure

```
site/
├── index.html              # Landing page
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Crawler directives
├── api/v1/                 # Static API responses
│   ├── index.json          # Full agent index
│   ├── categories.json     # Category listing
│   ├── api-manifest.json   # Distribution manifest
│   ├── health.json         # Health check
│   └── agents/             # Per-agent detail JSON
├── skill-packages/         # Downloadable skill packages
│   └── <slug>/
│       ├── skill.json      # Package metadata
│       ├── SKILL.md        # Documentation
│       ├── icon.svg        # Icon
│       ├── scripts/        # Helper scripts
│       └── examples/       # Usage examples
└── _index/                 # Raw index data
```

## Deployment

This directory can be deployed to any static hosting:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop or CLI
- **GitHub Pages**: Push to `gh-pages` branch
- **Cloudflare Pages**: Connect repo
- **AWS S3 + CloudFront**: Upload with `aws s3 sync`

## API Endpoints (Static)

All responses are pre-generated JSON files.

| Endpoint | Description |
|----------|-------------|
| `/api/v1/index.json` | Full marketplace index |
| `/api/v1/categories.json` | All categories |
| `/api/v1/api-manifest.json` | Distribution manifest |
| `/api/v1/agents/{slug}.json` | Single agent detail |
| `/api/v1/health.json` | Health check |

