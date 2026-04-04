-- Add value columns to agents table
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS install_command text;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS capabilities text[];
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS requirements text[];
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS platforms text[];
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS use_cases text[];
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS pricing_tier_free jsonb DEFAULT '{"features": [], "limits": "Basic usage"}'::jsonb;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS pricing_tier_paid jsonb DEFAULT NULL;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS demo_url text;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS rating_avg numeric DEFAULT 0;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS weekly_views integer DEFAULT 0;
