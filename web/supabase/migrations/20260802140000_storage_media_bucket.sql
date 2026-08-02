-- Bucket público para Media Manager (Admin → Multimedia).
-- Idempotente: seguro re-ejecutar en SQL Editor.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lectura pública de objetos del bucket
drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
  on storage.objects for select
  using (bucket_id = 'media');

-- Escritura staff (el upload de la app usa service_role; estas policies
-- cubren clientes autenticados por si se sube desde el browser SDK).
drop policy if exists "media_staff_insert" on storage.objects;
create policy "media_staff_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'media'
    and public.can_write_content()
  );

drop policy if exists "media_staff_update" on storage.objects;
create policy "media_staff_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.can_write_content())
  with check (bucket_id = 'media' and public.can_write_content());

drop policy if exists "media_staff_delete" on storage.objects;
create policy "media_staff_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.can_write_content());
