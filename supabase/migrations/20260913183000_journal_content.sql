--IDEMPOTENT
-- Writing tables for the public journal. Owner writes are limited to the
-- seeded site owner (python_seeds SEED_USER_ID).

-- Placeholder until 20260913190000_site_settings.sql. After that migration,
-- this function reads public.site_settings where key = 'owner_id'.
create or replace function public.site_owner_id()
returns uuid
language sql
immutable
parallel safe
as $$
  select '00000000-0000-0000-0000-000000000001'::uuid;
$$;

create or replace function public.set_journal_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  body text not null default '',
  excerpt text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  key text primary key,
  body text not null default '',
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_at_idx
  on public.posts (published_at desc nulls last);

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row
  execute function public.set_journal_updated_at();

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before update on public.site_content
  for each row
  execute function public.set_journal_updated_at();

alter table public.posts enable row level security;
alter table public.site_content enable row level security;

drop policy if exists "Anyone can read published posts" on public.posts;
create policy "Anyone can read published posts"
  on public.posts
  for select
  using (published = true);

drop policy if exists "Owner can read all posts" on public.posts;
create policy "Owner can read all posts"
  on public.posts
  for select
  using (auth.uid() = public.site_owner_id());

drop policy if exists "Owner can insert posts" on public.posts;
create policy "Owner can insert posts"
  on public.posts
  for insert
  with check (auth.uid() = public.site_owner_id());

drop policy if exists "Owner can update posts" on public.posts;
create policy "Owner can update posts"
  on public.posts
  for update
  using (auth.uid() = public.site_owner_id())
  with check (auth.uid() = public.site_owner_id());

drop policy if exists "Owner can delete posts" on public.posts;
create policy "Owner can delete posts"
  on public.posts
  for delete
  using (auth.uid() = public.site_owner_id());

drop policy if exists "Anyone can read site content" on public.site_content;
create policy "Anyone can read site content"
  on public.site_content
  for select
  using (true);

drop policy if exists "Owner can insert site content" on public.site_content;
create policy "Owner can insert site content"
  on public.site_content
  for insert
  with check (auth.uid() = public.site_owner_id());

drop policy if exists "Owner can update site content" on public.site_content;
create policy "Owner can update site content"
  on public.site_content
  for update
  using (auth.uid() = public.site_owner_id())
  with check (auth.uid() = public.site_owner_id());

drop policy if exists "Owner can delete site content" on public.site_content;
create policy "Owner can delete site content"
  on public.site_content
  for delete
  using (auth.uid() = public.site_owner_id());

grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
