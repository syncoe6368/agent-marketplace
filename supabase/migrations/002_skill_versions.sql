-- Ensure uuid extension exists (may already be present from 001)
create extension if not exists "uuid-ossp";

-- Skill Package Version Tracking
-- Tracks version history for marketplace skill packages

-- Skill versions table
create table public.skill_versions (
  id uuid primary key default uuid_generate_v4(),
  slug text not null,
  version text not null,
  previous_version text,
  changelog text,
  manifest_snapshot jsonb not null,
  file_list text[] default '{}',
  total_size_bytes integer default 0,
  uploader_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now() not null,
  
  unique(slug, version)
);

alter table public.skill_versions enable row level security;

create policy "Skill versions are viewable by everyone"
  on public.skill_versions for select
  using (true);

create policy "Authenticated users can create skill versions"
  on public.skill_versions for insert
  with check (auth.uid() = uploader_id);

-- Index for fast slug lookups
create index idx_skill_versions_slug on public.skill_versions(slug);
create index idx_skill_versions_slug_created on public.skill_versions(slug, created_at desc);

-- Update subscriptions table
-- Users can subscribe to get notified when a skill package is updated
create table public.skill_update_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  slug text not null,
  current_version text not null,
  notify_via text default 'email' check (notify_via in ('email', 'webhook', 'in-app')),
  webhook_url text,
  is_active boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  unique(user_id, slug)
);

alter table public.skill_update_subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on public.skill_update_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can create own subscriptions"
  on public.skill_update_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own subscriptions"
  on public.skill_update_subscriptions for update
  using (auth.uid() = user_id);

create policy "Users can delete own subscriptions"
  on public.skill_update_subscriptions for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at
create trigger skill_subscriptions_updated_at
  before update on public.skill_update_subscriptions
  for each row execute procedure public.update_updated_at();

-- Function to get latest version for a slug
create or replace function public.get_latest_skill_version(p_slug text)
returns text as $$
  select version from public.skill_versions
  where slug = p_slug
  order by created_at desc
  limit 1;
$$ language sql security definer;

-- Function to get version count for a slug
create or replace function public.get_skill_version_count(p_slug text)
returns integer as $$
  select count(*)::integer from public.skill_versions
  where slug = p_slug;
$$ language sql security definer;

-- Enable realtime for skill versions (so subscribers can listen)
alter publication supabase_realtime add table public.skill_versions;
