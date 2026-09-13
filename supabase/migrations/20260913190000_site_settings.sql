--IDEMPOTENT
-- Owner id lives in site_settings so local seed and hosted Studio can differ
-- without rewriting this function in git.

create table if not exists public.site_settings (
  key text primary key,
  value text not null
);

alter table public.site_settings enable row level security;

create or replace function public.site_owner_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select value::uuid
  from public.site_settings
  where key = 'owner_id'
  limit 1;
$$;

drop policy if exists "Anyone can read site settings" on public.site_settings;
create policy "Anyone can read site settings"
  on public.site_settings
  for select
  using (true);

drop policy if exists "Owner can insert site settings" on public.site_settings;
create policy "Owner can insert site settings"
  on public.site_settings
  for insert
  with check (auth.uid() = public.site_owner_id());

drop policy if exists "Owner can update site settings" on public.site_settings;
create policy "Owner can update site settings"
  on public.site_settings
  for update
  using (auth.uid() = public.site_owner_id())
  with check (auth.uid() = public.site_owner_id());

drop policy if exists "Owner can delete site settings" on public.site_settings;
create policy "Owner can delete site settings"
  on public.site_settings
  for delete
  using (auth.uid() = public.site_owner_id());

grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
