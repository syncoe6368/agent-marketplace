-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Categories
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  created_at timestamptz default now() not null
);

alter table public.categories enable row level security;

create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

-- Pricing model enum
create type pricing_model as enum ('free', 'paid', 'freemium', 'subscription');
create type agent_status as enum ('pending', 'active', 'suspended');

-- Agents
create table public.agents (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null,
  long_description text,
  pricing_model pricing_model default 'free' not null,
  price_amount integer,
  currency text default 'USD',
  website_url text,
  github_url text,
  api_docs_url text,
  logo_url text,
  tags text[] default '{}',
  is_featured boolean default false,
  is_verified boolean default false,
  status agent_status default 'pending' not null,
  views_count integer default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.agents enable row level security;

create policy "Active agents are viewable by everyone"
  on public.agents for select
  using (status = 'active');

create policy "Creators can view own agents"
  on public.agents for select
  using (auth.uid() = creator_id);

create policy "Authenticated users can create agents"
  on public.agents for insert
  with check (auth.uid() = creator_id);

create policy "Creators can update own agents"
  on public.agents for update
  using (auth.uid() = creator_id);

create policy "Creators can delete own agents"
  on public.agents for delete
  using (auth.uid() = creator_id);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger agents_updated_at
  before update on public.agents
  for each row execute procedure public.update_updated_at();

-- Generate unique slug
create or replace function public.generate_unique_slug(p_name text)
returns text as $$
declare
  v_slug text;
  v_count integer;
begin
  v_slug := lower(regexp_replace(p_name, '[^a-z0-9]+', '-', 'gi'));
  v_slug := regexp_replace(v_slug, '(^-|-$)', '', 'g');
  
  select count(*) into v_count from public.agents where slug = v_slug;
  
  if v_count > 0 then
    v_slug := v_slug || '-' || (v_count + 1)::text;
  end if;
  
  return v_slug;
end;
$$ language plpgsql;

-- Reviews
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid references public.agents(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now() not null,
  unique(agent_id, user_id)
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

create policy "Authenticated users can create reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- Full-text search index
create index idx_agents_search on public.agents
  using gin (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(array_to_string(tags, ' '), ''))
  );

-- Index for category lookups
create index idx_agents_category on public.agents(category_id);
create index idx_agents_status on public.agents(status);
create index idx_agents_creator on public.agents(creator_id);
create index idx_agents_featured on public.agents(is_featured) where is_featured = true;

-- Index for reviews
create index idx_reviews_agent on public.reviews(agent_id);
create index idx_reviews_user on public.reviews(user_id);

-- Seed categories
insert into public.categories (name, slug, description, icon) values
  ('Automation', 'automation', 'Agents that automate workflows, tasks, and business processes', 'Zap'),
  ('Research & Analysis', 'research-analysis', 'AI agents for data gathering, research, and analytical tasks', 'Search'),
  ('Customer Support', 'customer-support', 'Chatbots and agents for customer service and ticket handling', 'MessageSquare'),
  ('Development', 'development', 'Code generation, debugging, and software development agents', 'Code'),
  ('Marketing', 'marketing', 'Content creation, social media, and marketing automation agents', 'Megaphone'),
  ('Finance', 'finance', 'Trading, budgeting, and financial analysis agents', 'TrendingUp');

-- Enable realtime for agents
alter publication supabase_realtime add table public.agents;
