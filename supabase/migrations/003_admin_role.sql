-- Admin Role & Moderation Policies
-- Addresses RLS audit findings from 2026-04-04

-- Add role column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Admins can update any agent (for moderation: status changes, featuring, verifying)
CREATE POLICY "Admins can update any agent"
  ON public.agents FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can delete any agent
CREATE POLICY "Admins can delete any agent"
  ON public.agents FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can view all agents regardless of status (for moderation queue)
CREATE POLICY "Admins can view all agents"
  ON public.agents FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Prevent creators from self-activating agents (must go through moderation)
CREATE OR REPLACE FUNCTION prevent_self_activation()
RETURNS TRIGGER AS $$
BEGIN
  -- If status is being changed to 'active' from 'pending', check if user is admin
  IF NEW.status = 'active' AND (OLD IS NULL OR OLD.status = 'pending') THEN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
      NEW.status := 'pending';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_moderation_workflow
  BEFORE INSERT OR UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION prevent_self_activation();

-- Index for active subscription lookups
CREATE INDEX IF NOT EXISTS idx_skill_subscriptions_slug
  ON public.skill_update_subscriptions(slug) WHERE is_active = true;
