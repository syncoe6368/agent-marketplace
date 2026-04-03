-- AgentHub Seed Data
-- Run this in Supabase SQL Editor (postgres role)
-- This creates a showcase user + 5 sample agents + reviews

-- Step 1: Create the showcase auth user
SELECT auth.admin.create_user(
  email := 'admin@agenthub.show',
  password := 'ShowcaseOnly!42',
  email_confirmed_at := now(),
  raw_user_meta_data := '{"full_name":"AgentHub Team"}'::jsonb
);

-- Step 2: Insert agents and reviews using the new user's ID
DO $$
DECLARE
  showcase_id uuid;
  automation_id uuid;
  research_id uuid;
  support_id uuid;
  dev_id uuid;
  marketing_id uuid;
BEGIN
  SELECT id INTO showcase_id FROM auth.users WHERE email = 'admin@agenthub.show' LIMIT 1;
  SELECT id INTO automation_id FROM public.categories WHERE slug = 'automation' LIMIT 1;
  SELECT id INTO research_id FROM public.categories WHERE slug = 'research-analysis' LIMIT 1;
  SELECT id INTO support_id FROM public.categories WHERE slug = 'customer-support' LIMIT 1;
  SELECT id INTO dev_id FROM public.categories WHERE slug = 'development' LIMIT 1;
  SELECT id INTO marketing_id FROM public.categories WHERE slug = 'marketing' LIMIT 1;

  -- Insert 5 agents
  INSERT INTO public.agents (creator_id, name, slug, description, long_description, category_id, pricing_model, price_amount, currency, status, is_featured, is_verified, logo_url, website_url, tags, capabilities, requirements)
  VALUES
  (showcase_id, 'AutoFlow Pro', 'autoflow-pro',
   'Intelligent workflow automation that learns your patterns',
   'AutoFlow Pro observes your daily workflows and creates intelligent automations. Integrates with 50+ tools including Slack, GitHub, Jira, and Google Workspace. Set it up once and watch your productivity soar.',
   automation_id, 'freemium', 0, 'USD', 'active', true, true,
   null, null, ARRAY['automation', 'workflow', 'productivity'],
   ARRAY['Workflow Builder', 'Smart Scheduling', 'Cross-app Integration', 'Analytics Dashboard'],
   ARRAY['OpenAI API Key']),

  (showcase_id, 'DeepSearch AI', 'deepsearch-ai',
   'AI research assistant that digs deeper than any search engine',
   'DeepSearch AI goes beyond simple web searches. It reads papers, cross-references sources, synthesizes findings, and delivers comprehensive research reports with citations. Perfect for academics, analysts, and curious minds.',
   research_id, 'paid', 29, 'USD', 'active', true, true,
   null, null, ARRAY['research', 'analysis', 'academic', 'reports'],
   ARRAY['Source Synthesis', 'Citation Generation', 'Paper Analysis', 'Trend Detection'],
   ARRAY['OpenAI API Key']),

  (showcase_id, 'SupportBot 360', 'supportbot-360',
   '24/7 AI customer support that actually resolves issues',
   'SupportBot 360 handles customer inquiries with human-like understanding. It can troubleshoot issues, process refunds, escalate complex cases, and learn from every interaction to improve over time.',
   support_id, 'subscription', 49, 'USD', 'active', true, false,
   null, null, ARRAY['support', 'chatbot', 'customer-service'],
   ARRAY['Natural Language Understanding', 'Ticket Management', 'Escalation Routing', 'Multilingual'],
   ARRAY['Anthropic API Key']),

  (showcase_id, 'CodePilot', 'codepilot',
   'Your AI pair programmer that writes, reviews, and debugs code',
   'CodePilot understands your codebase context and provides intelligent code suggestions, automatic bug fixes, and comprehensive code reviews. Supports 40+ programming languages and integrates with VS Code, JetBrains, and GitHub.',
   dev_id, 'freemium', 0, 'USD', 'active', true, true,
   null, null, ARRAY['coding', 'developer-tools', 'code-review'],
   ARRAY['Code Generation', 'Bug Detection', 'Code Review', 'Refactoring'],
   ARRAY['Anthropic API Key']),

  (showcase_id, 'ContentForge', 'contentforge',
   'AI content creation engine for blogs, social media, and ads',
   'ContentForge generates high-quality, on-brand content at scale. From blog posts to Twitter threads to ad copy, it adapts to your brand voice and audience. Built-in SEO optimization and A/B testing for headlines.',
   marketing_id, 'paid', 19, 'USD', 'active', false, true,
   null, null, ARRAY['marketing', 'content', 'seo', 'social-media'],
   ARRAY['Blog Writing', 'Social Media Posts', 'Ad Copy', 'SEO Optimization'],
   ARRAY['OpenAI API Key'])
  ON CONFLICT (slug) DO NOTHING;

  -- Insert sample reviews (5 per agent)
  INSERT INTO public.reviews (agent_id, user_id, rating, comment)
  SELECT a.id, showcase_id, v.rating, v.comment
  FROM public.agents a
  CROSS JOIN (VALUES
    (5, 'Absolutely game-changing for our team. Set up in minutes and it paid for itself in the first week.'),
    (4, 'Great agent, very intuitive. Would love more integrations in future updates.'),
    (5, 'Best AI agent I''ve used. The quality of output is consistently impressive.'),
    (4, 'Solid product with excellent documentation. Support team is responsive.'),
    (3, 'Good concept, needs some polish on the UI side. Core functionality is strong.')
  ) AS v(rating, comment)
  WHERE a.creator_id = showcase_id
  ON CONFLICT DO NOTHING;
END $$;
