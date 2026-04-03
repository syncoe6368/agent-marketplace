-- =============================================================
-- AgentHub Seed Data — 5 Demo Agent Listings
-- Run AFTER the main migration. Assumes categories already seeded.
-- Run: supabase db push or paste into SQL Editor
-- =============================================================

-- =============================================================
-- 1. AutoPilot Research Agent
-- =============================================================
INSERT INTO public.agents (
  creator_id, category_id, name, slug, description, long_description,
  pricing_model, price_amount, currency, website_url, github_url, api_docs_url,
  tags, is_featured, is_verified, status, views_count
)
SELECT
  p.id,
  (SELECT id FROM public.categories WHERE slug = 'research-analysis'),
  'AutoPilot Research',
  'autopilot-research',
  'AI-powered research assistant that gathers, summarizes, and cites sources automatically. Perfect for market research and competitive analysis.',
  'AutoPilot Research automates the tedious parts of research: finding sources, extracting key data, cross-referencing claims, and generating structured reports with proper citations. Built on a RAG pipeline with real-time web access.\n\n## Key Features\n- Multi-source aggregation with deduplication\n- Citation tracking with confidence scores\n- Export to PDF, Markdown, or JSON\n- Scheduled monitoring for ongoing topics\n- API-first design for integration into your workflow',
  'freemium',
  2900, -- $29/mo
  'USD',
  'https://autopilot-research.example.com',
  'https://github.com/example/autopilot-research',
  'https://docs.autopilot-research.example.com/api',
  ARRAY['research', 'automation', 'RAG', 'citations', 'market-analysis'],
  true,
  true,
  'active',
  1247;

-- =============================================================
-- 2. SupportBee AI
-- =============================================================
INSERT INTO public.agents (
  creator_id, category_id, name, slug, description, long_description,
  pricing_model, price_amount, currency, website_url, github_url, api_docs_url,
  tags, is_featured, is_verified, status, views_count
)
SELECT
  p.id,
  (SELECT id FROM public.categories WHERE slug = 'customer-support'),
  'SupportBee AI',
  'supportbee-ai',
  'Multilingual customer support agent that handles tickets, live chat, and email with context-aware responses in 40+ languages.',
  'SupportBee AI understands your product documentation, past tickets, and brand voice to deliver support that feels human. It triages incoming requests, suggests resolutions, and escalates only when necessary.\n\n## Key Features\n- 40+ language support with automatic detection\n- Learns from your knowledge base and past tickets\n- Sentiment analysis for priority routing\n- Integrates with Zendesk, Intercom, Freshdesk\n- Dashboard with resolution metrics and CSAT tracking',
  'subscription',
  4900, -- $49/mo
  'USD',
  'https://supportbee-ai.example.com',
  NULL,
  'https://docs.supportbee-ai.example.com',
  ARRAY['customer-support', 'chatbot', 'multilingual', 'ticketing', 'NLP'],
  true,
  false,
  'active',
  892;

-- =============================================================
-- 3. CodeForge
-- =============================================================
INSERT INTO public.agents (
  creator_id, category_id, name, slug, description, long_description,
  pricing_model, price_amount, currency, website_url, github_url, api_docs_url,
  tags, is_featured, is_verified, status, views_count
)
SELECT
  p.id,
  (SELECT id FROM public.categories WHERE slug = 'development'),
  'CodeForge',
  'codeforge',
  'AI code generation agent that writes, reviews, and refactors code across 20+ languages. Integrates with your IDE and CI/CD pipeline.',
  'CodeForge goes beyond code completion. It understands your entire codebase, enforces your style guide, writes tests, and even generates documentation.\n\n## Key Features\n- 20+ programming languages\n- Context-aware suggestions using repo-level analysis\n- Automated PR reviews with actionable feedback\n- Test generation with coverage targeting\n- Security vulnerability scanning built-in\n- Works with VS Code, JetBrains, Neovim',
  'freemium',
  1900, -- $19/mo
  'USD',
  'https://codeforge.example.com',
  'https://github.com/example/codeforge',
  'https://docs.codeforge.example.com/api',
  ARRAY['code-generation', 'code-review', 'testing', 'CI/CD', 'developer-tools'],
  false,
  true,
  'active',
  2103;

-- =============================================================
-- 4. MarketPulse
-- =============================================================
INSERT INTO public.agents (
  creator_id, category_id, name, slug, description, long_description,
  pricing_model, price_amount, currency, website_url, github_url, api_docs_url,
  tags, is_featured, is_verified, status, views_count
)
SELECT
  p.id,
  (SELECT id FROM public.categories WHERE slug = 'finance'),
  'MarketPulse',
  'marketpulse',
  'Real-time market analysis agent that monitors stocks, crypto, and forex. Generates signals with risk scoring and portfolio insights.',
  'MarketPulse combines technical analysis, sentiment tracking, and macro indicators into a unified signal engine. Built for traders who want data-driven decisions without information overload.\n\n## Key Features\n- Multi-asset coverage (stocks, crypto, forex, commodities)\n- RSI, MACD, Bollinger, and custom indicator support\n- Sentiment analysis from social media and news\n- Risk-adjusted signal scoring (1-10 scale)\n- Portfolio correlation analysis\n- Webhook alerts to Telegram, Discord, or Slack',
  'paid',
  9900, -- $99 one-time
  'USD',
  'https://marketpulse.example.com',
  NULL,
  'https://docs.marketpulse.example.com/api',
  ARRAY['trading', 'finance', 'crypto', 'signals', 'portfolio'],
  false,
  false,
  'active',
  567;

-- =============================================================
-- 5. ContentSpark
-- =============================================================
INSERT INTO public.agents (
  creator_id, category_id, name, slug, description, long_description,
  pricing_model, price_amount, currency, website_url, github_url, api_docs_url,
  tags, is_featured, is_verified, status, views_count
)
SELECT
  p.id,
  (SELECT id FROM public.categories WHERE slug = 'marketing'),
  'ContentSpark',
  'contentspark',
  'AI content marketing agent that plans, writes, and schedules social media posts, blog articles, and email campaigns. Bilingual EN/BM support.',
  'ContentSpark is built for Southeast Asian marketers who need bilingual content at scale. It understands local cultural context, slang, and compliance requirements.\n\n## Key Features\n- Bilingual content generation (English & Bahasa Malaysia)\n- Social media scheduling (Instagram, TikTok, X, LinkedIn)\n- Blog post generation with SEO optimization\n- Email campaign builder with A/B testing\n- Brand voice learning from your existing content\n- Halal-compliant content guidelines built-in\n- ROI tracking dashboard',
  'free',
  NULL,
  'USD',
  'https://contentspark.example.com',
  NULL,
  NULL,
  ARRAY['content', 'marketing', 'social-media', 'bilingual', 'SEO'],
  false,
  false,
  'active',
  334;

-- =============================================================
-- Sample reviews for top agents
-- =============================================================
INSERT INTO public.reviews (agent_id, user_id, rating, comment)
SELECT
  a.id,
  (SELECT id FROM public.profiles LIMIT 1),
  5,
  'Incredibly useful — saves our team 10+ hours per week on research tasks.'
FROM public.agents a WHERE a.slug = 'autopilot-research';

INSERT INTO public.reviews (agent_id, user_id, rating, comment)
SELECT
  a.id,
  (SELECT id FROM public.profiles LIMIT 1),
  4,
  'Great multilingual support. Bahasa Malaysia responses are surprisingly natural.'
FROM public.agents a WHERE a.slug = 'supportbee-ai';

INSERT INTO public.reviews (agent_id, user_id, rating, comment)
SELECT
  a.id,
  (SELECT id FROM public.profiles LIMIT 1),
  5,
  'Best code review agent I have used. Catches bugs I would have missed.'
FROM public.agents a WHERE a.slug = 'codeforge';

INSERT INTO public.reviews (agent_id, user_id, rating, comment)
SELECT
  a.id,
  (SELECT id FROM public.profiles LIMIT 1),
  4,
  'Good signals but wish it had more forex pairs. Crypto coverage is excellent.'
FROM public.agents a WHERE a.slug = 'marketpulse';

INSERT INTO public.reviews (agent_id, user_id, rating, comment)
SELECT
  a.id,
  (SELECT id FROM public.profiles LIMIT 1),
  5,
  'Finally a content tool that understands Malaysian context! BM content quality is top-notch.'
FROM public.agents a WHERE a.slug = 'contentspark';
