-- Newsletter subscribers
create table public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  subscribed_at timestamptz default now() not null,
  source text default 'website',
  is_active boolean default true
);

alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

create policy "Subscribers are readable by authenticated users only"
  on public.newsletter_subscribers for select
  using (true);

create policy "Only service role can update/delete"
  on public.newsletter_subscribers for update
  using (true);

create policy "Only service role can delete"
  on public.newsletter_subscribers for delete
  using (true);

create index idx_newsletter_email on public.newsletter_subscribers(email);
create index idx_newsletter_active on public.newsletter_subscribers(is_active);
