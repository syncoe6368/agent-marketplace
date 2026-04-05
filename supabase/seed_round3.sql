-- AgentHub Enhanced Seed Data — Round 3
-- Adds 3 new agents with skill package linking + enhanced metadata
-- Run via: supabase db query --linked -f supabase/seed_round3.sql

-- Temporarily drop FK to insert showcase profile
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Ensure showcase profile exists
INSERT INTO public.profiles (id, full_name, avatar_url, bio)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'AgentHub Team',
  null,
  'Official showcase account for featured agents. Curated by the Syncoe team.'
) ON CONFLICT (id) DO UPDATE SET
  bio = 'Official showcase account for featured agents. Curated by the Syncoe team.';

-- ═══════════════════════════════════════════════════════════════
-- Insert 3 new agents with enhanced metadata
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.agents (
  creator_id, name, slug, description, long_description,
  category_id, pricing_model, price_amount, currency,
  status, is_featured, is_verified, tags,
  install_command, capabilities, platforms, use_cases,
  pricing_tier_free, pricing_tier_paid, demo_url
)
VALUES
-- Smart Content Writer
('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
 'Smart Content Writer', 'smart-content-writer',
 'AI-powered multilingual content creation for blogs, social media, and ad copy with SEO optimization',
 'Smart Content Writer generates high-quality, on-brand content at scale for Malaysian and SEA markets. Supports BM/EN bilingual content, automatic SEO optimization, and multi-platform formatting for WordPress, social media, and ad networks. Built-in keyword research integration and A/B headline testing.',
 (SELECT id FROM public.categories WHERE slug = 'marketing'),
 'freemium', 19, 'USD',
 'active', true, true,
 ARRAY['content', 'seo', 'marketing', 'bilingual', 'malaysia', 'blog', 'social-media'],
 'openclaw skill install smart-content-writer',
 ARRAY['blog-writing', 'social-media-posts', 'ad-copy', 'email-sequences', 'seo-optimization', 'keyword-research'],
 ARRAY['web', 'api'],
 ARRAY['Generate weekly blog posts for affiliate sites', 'Create Instagram carousel copy in BM and EN', 'Write email nurture sequences for SaaS', 'Produce SEO-optimized landing page content'],
 '{"features": ["5 posts/month", "EN only", "Basic SEO"], "limits": "5,000 words/month"}'::jsonb,
 '{"features": ["Unlimited posts", "BM/EN/中文", "Advanced SEO", "A/B testing", "Bulk generation", "Priority API"], "price": "$19/month", "limits": "Unlimited"}'::jsonb,
 null
),

-- WhatsApp Support Agent
('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
 'WhatsApp Support Agent', 'whatsapp-support-agent',
 '24/7 AI customer support agent for Malaysian SMEs via WhatsApp Business API',
 'WhatsApp Support Agent handles customer inquiries, appointment bookings, order tracking, and FAQs automatically via WhatsApp Business API. Built for Malaysian SMEs with BM/EN bilingual support, PDPA compliance, and seamless handoff to human agents. Integrates with Supabase for CRM and leads management.',
 (SELECT id FROM public.categories WHERE slug = 'customer-support'),
 'subscription', 49, 'USD',
 'active', true, true,
 ARRAY['whatsapp', 'support', 'chatbot', 'malaysia', 'sme', 'bilingual', 'pdpa'],
 'openclaw skill install whatsapp-support-agent',
 ARRAY['customer-support', 'appointment-booking', 'order-tracking', 'faq-automation', 'lead-capture', 'analytics'],
 ARRAY['whatsapp', 'web', 'api'],
 ARRAY['F&B reservation and menu inquiries', 'Clinic appointment scheduling', 'Professional services lead qualification', 'Retail order status and returns'],
 '{"features": ["100 messages/month", "EN only", "Basic FAQ"], "limits": "1 business number"}'::jsonb,
 '{"features": ["Unlimited messages", "BM/EN", "Full CRM", "Analytics", "Priority support", "Custom training"], "price": "$49/month", "limits": "Up to 5 business numbers"}'::jsonb,
 'https://syncoe.com/servicelink'
),

-- Loan Comparison Agent (PinjamanCompare)
('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
 'Loan Comparison Agent', 'loan-comparison-agent',
 'AI-powered personal loan comparison engine for the Malaysian market with EMI calculation',
 'Powers PinjamanCompare (loans.syncoe.com) — a bilingual BM/EN platform matching borrowers with the best personal loan offers from Malaysian banks. Features EMI calculation with reducing balance method, Islamic loan support, and automated lead distribution to partner lenders. CPL revenue model: RM 50-80 per qualified lead.',
 (SELECT id FROM public.categories WHERE slug = 'finance'),
 'free', 0, 'MYR',
 'active', false, true,
 ARRAY['loans', 'finance', 'malaysia', 'comparison', 'emi', 'islamic', 'bilingual'],
 null,
 ARRAY['loan-comparison', 'emi-calculation', 'lead-matching', 'amortization', 'pdpa-compliance'],
 ARRAY['web'],
 ARRAY['Compare personal loans from 10+ lenders', 'Calculate monthly installments for RM 1K-200K', 'Submit applications to multiple lenders', 'Find Shariah-compliant financing'],
 '{"features": ["Full comparison engine", "EMI calculator", "Application submission"], "limits": "Unlimited comparisons"}'::jsonb,
 null,
 'https://loans.syncoe.com'
)
ON CONFLICT (slug) DO UPDATE SET
  long_description = EXCLUDED.long_description,
  capabilities = EXCLUDED.capabilities,
  platforms = EXCLUDED.platforms,
  use_cases = EXCLUDED.use_cases,
  pricing_tier_free = EXCLUDED.pricing_tier_free,
  pricing_tier_paid = EXCLUDED.pricing_tier_paid,
  demo_url = EXCLUDED.demo_url,
  install_command = EXCLUDED.install_command;

-- ═══════════════════════════════════════════════════════════════
-- Add seed reviews for the 3 new agents
-- ═══════════════════════════════════════════════════════════════
INSERT INTO public.reviews (agent_id, user_id, rating, comment)
SELECT a.id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', v.rating, v.comment
FROM public.agents a
CROSS JOIN (VALUES
  (5, 'The bilingual content generation is exactly what we needed for our Malaysian audience. SEO optimization saved us hours of keyword research.'),
  (4, 'Great for batch content creation. The A/B headline testing feature is a nice touch. Would love more template variety.'),
  (5, 'Replaced our entire content workflow. The BM output quality is natural — not the robotic translations we got from other tools.')
) AS v(rating, comment)
WHERE a.slug = 'smart-content-writer'
ON CONFLICT DO NOTHING;

INSERT INTO public.reviews (agent_id, user_id, rating, comment)
SELECT a.id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', v.rating, v.comment
FROM public.agents a
CROSS JOIN (VALUES
  (5, 'Cut our response time from hours to seconds. Customers love the instant replies on WhatsApp.'),
  (4, 'Setup was straightforward. The handoff to human agents works smoothly. PDPA compliance out of the box is a huge plus.'),
  (5, 'Best investment for our clinic. Appointment booking automation reduced no-shows by 40%.')
) AS v(rating, comment)
WHERE a.slug = 'whatsapp-support-agent'
ON CONFLICT DO NOTHING;

INSERT INTO public.reviews (agent_id, user_id, rating, comment)
SELECT a.id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', v.rating, v.comment
FROM public.agents a
CROSS JOIN (VALUES
  (5, 'Found a loan with 2% lower interest rate than my bank offered. The EMI calculator is super accurate.'),
  (4, 'The Islamic loan filtering is great — hard to find elsewhere. Application process was smooth.'),
  (5, 'Compared 10 lenders in 2 minutes. Would have taken me days of bank visits. Highly recommended.')
) AS v(rating, comment)
WHERE a.slug = 'loan-comparison-agent'
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- Enhance existing 5 agents with skill package metadata
-- ═══════════════════════════════════════════════════════════════
UPDATE public.agents SET
  install_command = 'openclaw skill install trading-bot-agent',
  capabilities = ARRAY['rsi-strategy', 'backtesting', 'paper-trading', 'market-analysis', 'risk-management'],
  platforms = ARRAY['api', 'cli'],
  use_cases = ARRAY['Automated BTC/ETH/SOL trading', 'Paper trading validation', 'Market regime detection', 'Strategy performance evaluation']
WHERE slug = 'trading-bot-agent';

-- Restore the FK constraint
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
