-- Seed data for AgentHub -- run in Supabase SQL Editor after initial schema migration
-- This creates 5 realistic agent listings to populate the marketplace at launch

-- Note: Categories are already seeded by the initial migration (001_initial_schema.sql)

-- Create a temporary "anonymous" creator profile using a placeholder UUID
-- In production, real users create profiles via Auth. This is for demo/seed only.

-- Get or create a demo user profile
-- IMPORTANT: Replace with real user IDs after real users sign up
DO $$
DECLARE
  demo_user_id uuid;
  automation_cat_id uuid;
  research_cat_id uuid;
  support_cat_id uuid;
  dev_cat_id uuid;
  finance_cat_id uuid;
BEGIN
  -- Find the anonymous creator ID from existing profiles, or use a fixed demo ID
  SELECT id INTO demo_user_id FROM public.profiles LIMIT 1;

  -- Fallback: use a fixed UUID for seed data (will fail if no profile exists)
  IF demo_user_id IS NULL THEN
    RAISE EXCEPTION 'No profiles found. Please create at least one user account before seeding agents.';
  END IF;

  -- Get category IDs
  SELECT id INTO automation_cat_id FROM public.categories WHERE slug = 'automation';
  SELECT id INTO research_cat_id FROM public.categories WHERE slug = 'research-analysis';
  SELECT id INTO support_cat_id FROM public.categories WHERE slug = 'customer-support';
  SELECT id INTO dev_cat_id FROM public.categories WHERE slug = 'development';
  SELECT id INTO finance_cat_id FROM public.categories WHERE slug = 'finance';

  -- Agent 1: SynthMind Pro (Automation)
  INSERT INTO public.agents (
    creator_id, category_id, name, slug, description, long_description,
    pricing_model, price_amount, currency,
    website_url, github_url, api_docs_url,
    tags, is_featured, is_verified, status, views_count
  ) VALUES (
    demo_user_id, automation_cat_id,
    'SynthMind Pro', 'synthmind-pro',
    'Autonomous workflow agent for enterprise automation. Builds complex multi-step pipelines from natural language descriptions.',
    'SynthMind Pro transforms natural language instructions into multi-step automation pipelines. Supports 50+ integrations including Slack, Notion, Gmail, Airtable, and custom APIs. Ideal for operations teams looking to replace manual processes with reliable AI-driven workflows.',
    'freemium', 29, 'USD',
    'https://synthmind.dev', 'https://github.com/synco/synthmind', 'https://docs.synthmind.dev',
    ARRAY['automation', 'workflow', 'enterprise', 'AI'],
    TRUE, TRUE, 'active', 1247
  );

  -- Agent 2: CodeWeaver AI (Development)
  INSERT INTO public.agents (
    creator_id, category_id, name, slug, description, long_description,
    pricing_model, price_amount, currency,
    website_url, github_url, api_docs_url,
    tags, is_featured, is_verified, status, views_count
  ) VALUES (
    demo_user_id, dev_cat_id,
    'CodeWeaver AI', 'codeweaver-ai',
    'AI code review and refactoring agent with deep codebase understanding. Integrates into CI/CD pipeline.',
    'CodeWeaver AI provides comprehensive code reviews at PR time. Understands architecture patterns, detects security vulnerabilities, suggests performance optimizations, and enforces team conventions. Integrates with GitHub, GitLab, and Bitbucket.',
    'subscription', 15, 'USD',
    'https://codeweaver.ai', 'https://github.com/synco/codeweaver', 'https://docs.codeweaver.ai',
    ARRAY['code-review', 'CI/CD', 'security', 'developer-tools'],
    TRUE, TRUE, 'active', 893
  );

  -- Agent 3: SentimentPulse (Research & Analysis)
  INSERT INTO public.agents (
    creator_id, category_id, name, slug, description, long_description,
    pricing_model, price_amount, currency,
    website_url, api_docs_url,
    tags, is_featured, is_verified, status, views_count
  ) VALUES (
    demo_user_id, research_cat_id,
    'SentimentPulse', 'sentiment-pulse',
    'Real-time market and social sentiment analysis agent. Track brand mentions, monitor trends, generate intelligence reports.',
    'SentimentPulse crawls 50+ news sources, social platforms, and financial APIs to deliver real-time sentiment intelligence. Used by PR agencies, investment teams, and brand managers. Exports reports as PDF, CSV, or API feed.',
    'paid', 49, 'USD',
    'https://sentimentpulse.com', 'https://api.sentimentpulse.com/docs',
    ARRAY['sentiment', 'market-intelligence', 'monitoring', 'brand-tracking'],
    FALSE, TRUE, 'active', 654
  );

  -- Agent 4: SupportBot Zero (Customer Support)
  INSERT INTO public.agents (
    creator_id, category_id, name, slug, description, long_description,
    pricing_model, price_amount, currency,
    website_url, github_url, api_docs_url,
    tags, is_featured, is_verified, status, views_count
  ) VALUES (
    demo_user_id, support_cat_id,
    'SupportBot Zero', 'supportbot-zero',
    'Multilingual customer support agent. Handles tickets in 12 languages, escalates to humans when confidence is low.',
    'SupportBot Zero handles Tier 1 tickets across email, chat, and social media. Trained on your knowledge base in under 10 minutes. Supports 12 languages with native-level fluency. Auto-escalates to human agents when confidence thresholds aren''t met.',
    'free', NULL, 'USD',
    'https://supportbot.zero', 'https://github.com/synco/supportbot-zero', 'https://docs.supportbot.zero',
    ARRAY['customer-support', 'multilingual', 'ticket-handling', 'chatbot'],
    FALSE, FALSE, 'active', 432
  );

  -- Agent 5: TradeSage (Finance)
  INSERT INTO public.agents (
    creator_id, category_id, name, slug, description, long_description,
    pricing_model, price_amount, currency,
    website_url, api_docs_url,
    tags, is_featured, is_verified, status, views_count
  ) VALUES (
    demo_user_id, finance_cat_id,
    'TradeSage', 'tradesage',
    'AI trading assistant. Technical analysis, portfolio monitoring, and market alerts with RSI, MACD, and ML signals.',
    'TradeSage monitors 200+ technical indicators across stocks, crypto, and forex. Generates buy/sell signals with confidence scores. Sends real-time alerts via Discord, Telegram, or email. Paper trading mode included for validation.',
    'subscription', 19, 'USD',
    'https://tradesage.io', 'https://api.tradesage.io/docs',
    ARRAY['trading', 'technical-analysis', 'signals', 'portfolio'],
    TRUE, FALSE, 'active', 376
  );

  RAISE NOTICE 'Seed data inserted: 5 agent listings created';
END $$;
