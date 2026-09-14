--IDEMPOTENT
-- Public Storage bucket for journal photos. Anyone with the object URL can
-- read; only the site owner can upload, replace, or delete. No SELECT policy
-- on storage.objects — a public bucket already serves files by URL, and a
-- broad SELECT would let clients list every object.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos',
  'photos',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can read photos" on storage.objects;

drop policy if exists "Owner can upload photos" on storage.objects;
create policy "Owner can upload photos"
  on storage.objects
  for insert
  with check (bucket_id = 'photos' and auth.uid() = public.site_owner_id());

drop policy if exists "Owner can update photos" on storage.objects;
create policy "Owner can update photos"
  on storage.objects
  for update
  using (bucket_id = 'photos' and auth.uid() = public.site_owner_id())
  with check (bucket_id = 'photos' and auth.uid() = public.site_owner_id());

drop policy if exists "Owner can delete photos" on storage.objects;
create policy "Owner can delete photos"
  on storage.objects
  for delete
  using (bucket_id = 'photos' and auth.uid() = public.site_owner_id());
