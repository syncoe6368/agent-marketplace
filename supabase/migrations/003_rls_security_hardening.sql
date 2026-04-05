-- Migration 003: RLS Security Hardening
-- Addresses audit findings from 2026-04-05

-- ═══════════════════════════════════════════════════════════════
-- 1. Categories table: Restrict INSERT/UPDATE/DELETE to admins
-- ═══════════════════════════════════════════════════════════════
-- Currently anyone can INSERT/UPDATE/DELETE categories because no
-- write policies exist (only SELECT is allowed). This is fine for
-- MVP with RLS enabled and no public write, but let's be explicit.

-- No change needed: categories already have RLS enabled with only a
-- SELECT policy. INSERT/UPDATE/DELETE are denied by default.
-- However, add an explicit admin-only policy for future use:

-- First, create an is_admin helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Admin-only category management
CREATE POLICY "Admins can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE
  USING (public.is_admin());

-- ═══════════════════════════════════════════════════════════════
-- 2. Agents table: Prevent status manipulation by creators
-- ═══════════════════════════════════════════════════════════════
-- Issue: Creators can update their own agents, including changing
-- status from 'pending' to 'active' — bypassing moderation.
-- Fix: Split update policy so creators can't set status to 'active'.

-- Drop existing permissive update policy
DROP POLICY IF EXISTS "Creators can update own agents" ON public.agents;

-- Replace with restrictive version: creators can edit everything
-- EXCEPT status (which must go through admin moderation)
CREATE POLICY "Creators can update own agents (non-status fields)"
  ON public.agents FOR UPDATE
  USING (auth.uid() = creator_id)
  WITH CHECK (
    auth.uid() = creator_id
    AND status IN ('pending', 'suspended')  -- Can only edit non-active agents
  );

-- Admin-only policy for status changes
CREATE POLICY "Admins can update any agent"
  ON public.agents FOR UPDATE
  USING (public.is_admin());

-- ═══════════════════════════════════════════════════════════════
-- 3. Reviews table: Add trigger to update agent rating aggregates
-- ═══════════════════════════════════════════════════════════════
-- The rating_avg and review_count columns on agents exist but
-- aren't auto-maintained. Add a trigger.

CREATE OR REPLACE FUNCTION public.update_agent_rating()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.agents
    SET rating_avg = (
        SELECT ROUND(AVG(rating)::numeric, 2)
        FROM public.reviews WHERE agent_id = NEW.agent_id
      ),
      review_count = (
        SELECT COUNT(*)
        FROM public.reviews WHERE agent_id = NEW.agent_id
      )
    WHERE id = NEW.agent_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.agents
    SET rating_avg = (
        SELECT ROUND(AVG(rating)::numeric, 2)
        FROM public.reviews WHERE agent_id = NEW.agent_id
      ),
      review_count = (
        SELECT COUNT(*)
        FROM public.reviews WHERE agent_id = NEW.agent_id
      )
    WHERE id = NEW.agent_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.agents
    SET rating_avg = (
        SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0)
        FROM public.reviews WHERE agent_id = OLD.agent_id
      ),
      review_count = (
        SELECT COUNT(*)
        FROM public.reviews WHERE agent_id = OLD.agent_id
      )
    WHERE id = OLD.agent_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_agent_rating_trigger ON public.reviews;
CREATE TRIGGER update_agent_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_agent_rating();

-- ═══════════════════════════════════════════════════════════════
-- 4. Profiles: Restrict DELETE to self or admin
-- ═══════════════════════════════════════════════════════════════
-- No DELETE policy exists — add explicit self-delete + admin
CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id OR public.is_admin());

-- ═══════════════════════════════════════════════════════════════
-- 5. Weekly views tracking function
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.increment_agent_view(agent_uuid uuid)
RETURNS void AS $$
  UPDATE public.agents
  SET views_count = views_count + 1,
      weekly_views = weekly_views + 1
  WHERE id = agent_uuid AND status = 'active';
$$ LANGUAGE sql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════════════════
-- 6. Add weekly_views_reset cron (requires pg_cron extension)
-- ═══════════════════════════════════════════════════════════════
-- Note: pg_cron may not be available on Supabase free tier.
-- Application-level weekly reset should be implemented as fallback.
-- This is documented for manual setup via Supabase dashboard.
