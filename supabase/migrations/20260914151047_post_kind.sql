--IDEMPOTENT
-- Same posts table for writing and projects; default keeps existing rows as writing.

alter table public.posts
  add column if not exists kind text not null default 'writing';

alter table public.posts drop constraint if exists posts_kind_check;
alter table public.posts
  add constraint posts_kind_check check (kind in ('writing', 'project'));

create index if not exists posts_kind_published_at_idx
  on public.posts (kind, published_at desc nulls last);
