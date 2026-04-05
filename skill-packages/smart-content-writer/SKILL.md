# Smart Content Writer

> AI-powered multilingual content creation for blogs, social media, and ad copy with SEO optimization.

## What It Does

Smart Content Writer generates high-quality, on-brand content at scale for the Malaysian and Southeast Asian markets. It supports BM/EN bilingual output with automatic SEO optimization and multi-platform formatting.

## Features

- **Bilingual Content** — Generate blog posts, social media copy, and ad content in both Bahasa Malaysia and English
- **SEO Optimization** — Automatic keyword insertion, meta descriptions, and structured data suggestions
- **Multi-Platform** — Format output for WordPress, Twitter/X, Instagram, TikTok, and email
- **A/B Testing** — Generate headline variants with predicted CTR based on historical data
- **Brand Voice** — Train the writer on your existing content for consistent tone
- **Bulk Calendar** — Generate weeks of content in one batch for scheduling

## Quick Start

```bash
# Install via OpenClaw
openclaw skill install smart-content-writer

# Or manual install
git clone https://github.com/syncoe6368/affiliate-creator-silo
cd affiliate-creator-silo
npm install
```

## Usage

```bash
# Generate a blog post
npx content-writer blog --topic "best VPN Malaysia 2026" --lang bm --seo

# Create social media batch
npx content-writer social --platform instagram --count 7 --lang en

# A/B headline test
npx content-writer headlines --topic "web hosting comparison" --variants 5
```

## Configuration

Set these environment variables:

```env
CONTENT_WRITER_API_KEY=your-key-here
CONTENT_WRITER_MODEL=gemini-2.5-flash
CONTENT_WRITER_DEFAULT_LANG=en
```

## Pricing

| Tier | Price | Words/Month | Features |
|------|-------|-------------|----------|
| Free | $0 | 5,000 | EN only, basic SEO |
| Pro | $19/mo | Unlimited | BM/EN/中文, advanced SEO, A/B, bulk |
| Enterprise | Custom | Unlimited | Custom training, API priority, SLA |

## Support

- 📧 Email: ops@syncoe.com
- 🐛 Issues: [GitHub](https://github.com/syncoe6368/affiliate-creator-silo/issues)

## License

MIT © Syncoe
