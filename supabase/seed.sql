-- AgentHub Seed Data
-- Run via: supabase db query --linked -f supabase/seed.sql
--
-- Temporarily drops the profiles FK to insert seed data, then restores it.

-- Step 1: Temporarily drop the FK constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Step 2: Insert showcase profile
INSERT INTO public.profiles (id, full_name, avatar_url, bio)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'AgentHub Team',
  null,
  'Official showcase account for featured agents'
) ON CONFLICT (id) DO NOTHING;

-- Step 3: Insert 5 sample agents
INSERT INTO public.agents (creator_id, name, slug, description, long_description, category_id, pricing_model, price_amount, currency, status, is_featured, is_verified, logo_url, website_url, tags)
VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'AutoFlow Pro', 'autoflow-pro',
 'Intelligent workflow automation that learns your patterns',
 'AutoFlow Pro observes your daily workflows and creates intelligent automations. Integrates with 50+ tools including Slack, GitHub, Jira, and Google Workspace. Set it up once and watch your productivity soar.',
 '6fd53966-ff95-400a-9ae3-f9693e0b93ed', 'freemium', 0, 'USD', 'active', true, true,
 null, null, ARRAY['automation', 'workflow', 'productivity']),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'DeepSearch AI', 'deepsearch-ai',
 'AI research assistant that digs deeper than any search engine',
 'DeepSearch AI goes beyond simple web searches. It reads papers, cross-references sources, synthesizes findings, and delivers comprehensive research reports with citations. Perfect for academics, analysts, and curious minds.',
 '13825685-48a0-447b-9046-01d4f9ec4f52', 'paid', 29, 'USD', 'active', true, true,
 null, null, ARRAY['research', 'analysis', 'academic', 'reports']),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'SupportBot 360', 'supportbot-360',
 '24/7 AI customer support that actually resolves issues',
 'SupportBot 360 handles customer inquiries with human-like understanding. It can troubleshoot issues, process refunds, escalate complex cases, and learn from every interaction to improve over time.',
 'e486b847-ed1f-4c87-a596-154899ab9cf8', 'subscription', 49, 'USD', 'active', true, false,
 null, null, ARRAY['support', 'chatbot', 'customer-service']),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CodePilot', 'codepilot',
 'Your AI pair programmer that writes, reviews, and debugs code',
 'CodePilot understands your codebase context and provides intelligent code suggestions, automatic bug fixes, and comprehensive code reviews. Supports 40+ programming languages and integrates with VS Code, JetBrains, and GitHub.',
 '68e5cd19-6a44-4d67-9444-9dbd3ab437bd', 'freemium', 0, 'USD', 'active', true, true,
 null, null, ARRAY['coding', 'developer-tools', 'code-review']),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'ContentForge', 'contentforge',
 'AI content creation engine for blogs, social media, and ads',
 'ContentForge generates high-quality, on-brand content at scale. From blog posts to Twitter threads to ad copy, it adapts to your brand voice and audience. Built-in SEO optimization and A/B testing for headlines.',
 '5f12f9f0-7e11-4323-bd34-8281d4b2e6f3', 'paid', 19, 'USD', 'active', false, true,
 null, null, ARRAY['marketing', 'content', 'seo', 'social-media'])
ON CONFLICT (slug) DO NOTHING;

-- Step 4: Insert sample reviews (5 per agent)
INSERT INTO public.reviews (agent_id, user_id, rating, comment)
SELECT a.id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', v.rating, v.comment
FROM public.agents a
CROSS JOIN (VALUES
  (5, 'Absolutely game-changing for our team. Set up in minutes and it paid for itself in the first week.'),
  (4, 'Great agent, very intuitive. Would love more integrations in future updates.'),
  (5, 'Best AI agent I have used. The quality of output is consistently impressive.'),
  (4, 'Solid product with excellent documentation. Support team is responsive.'),
  (3, 'Good concept, needs some polish on the UI side. Core functionality is strong.')
) AS v(rating, comment)
WHERE a.creator_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
ON CONFLICT DO NOTHING;

-- Step 5: Restore the FK constraint
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
