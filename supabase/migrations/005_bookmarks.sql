-- Bookmarks / Favorites table
-- Users can save agents they're interested in

create table public.bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  agent_id uuid references public.agents(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, agent_id)
);

alter table public.bookmarks enable row level security;

-- Anyone can see bookmark counts (for display on cards)
create policy "Bookmarks are viewable by everyone"
  on public.bookmarks for select
  using (true);

-- Authenticated users can create bookmarks
create policy "Authenticated users can create bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

-- Users can delete own bookmarks
create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Indexes
create index idx_bookmarks_user on public.bookmarks(user_id);
create index idx_bookmarks_agent on public.bookmarks(agent_id);
create unique index idx_bookmarks_unique on public.bookmarks(user_id, agent_id);
