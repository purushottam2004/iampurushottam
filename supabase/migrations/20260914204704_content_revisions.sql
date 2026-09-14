--IDEMPOTENT
-- Keep the previous intro / about / post whenever it changes or a post is deleted.
-- No restore UI; rows live in public.content_revisions for Studio / SQL.

create table if not exists public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  entity text not null check (entity in ('post', 'site_content')),
  entity_id text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists content_revisions_entity_created_at_idx
  on public.content_revisions (entity, entity_id, created_at desc);

alter table public.content_revisions enable row level security;

drop policy if exists "Owner can read content revisions" on public.content_revisions;
create policy "Owner can read content revisions"
  on public.content_revisions
  for select
  using (auth.uid() = public.site_owner_id());

grant select on public.content_revisions to authenticated;

create or replace function public.save_post_revision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    insert into public.content_revisions (entity, entity_id, payload)
    values ('post', old.id::text, to_jsonb(old));
    return old;
  end if;

  if (old.slug, old.title, old.body, old.excerpt, old.published, old.published_at, old.kind)
     is distinct from
     (new.slug, new.title, new.body, new.excerpt, new.published, new.published_at, new.kind)
  then
    insert into public.content_revisions (entity, entity_id, payload)
    values ('post', old.id::text, to_jsonb(old));
  end if;

  return new;
end;
$$;

drop trigger if exists posts_save_revision on public.posts;
create trigger posts_save_revision
  after update or delete on public.posts
  for each row
  execute function public.save_post_revision();

create or replace function public.save_site_content_revision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    insert into public.content_revisions (entity, entity_id, payload)
    values ('site_content', old.key, to_jsonb(old));
    return old;
  end if;

  if old.body is distinct from new.body then
    insert into public.content_revisions (entity, entity_id, payload)
    values ('site_content', old.key, to_jsonb(old));
  end if;

  return new;
end;
$$;

drop trigger if exists site_content_save_revision on public.site_content;
create trigger site_content_save_revision
  after update or delete on public.site_content
  for each row
  execute function public.save_site_content_revision();
