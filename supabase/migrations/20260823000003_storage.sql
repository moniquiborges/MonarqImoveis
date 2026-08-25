-- MONARQ — Storage buckets e políticas
-- Esta migration é local e NÃO foi aplicada a nenhum projeto Supabase remoto.

insert into storage.buckets (id, name, public)
values
  ('development-images', 'development-images', true),
  ('urban-property-images', 'urban-property-images', true),
  ('rural-property-images', 'rural-property-images', true),
  ('blog-images', 'blog-images', true),
  ('documents', 'documents', false)
on conflict (id) do nothing;

-- Leitura pública nos buckets de imagem (galeria do site).
create policy "public_read_development_images"
  on storage.objects for select
  using (bucket_id = 'development-images');

create policy "public_read_urban_property_images"
  on storage.objects for select
  using (bucket_id = 'urban-property-images');

create policy "public_read_rural_property_images"
  on storage.objects for select
  using (bucket_id = 'rural-property-images');

create policy "public_read_blog_images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

-- Escrita (upload/update/delete) restrita à equipe (admin/editor) em todos os buckets.
create policy "staff_write_development_images"
  on storage.objects for all
  using (bucket_id = 'development-images' and public.is_staff())
  with check (bucket_id = 'development-images' and public.is_staff());

create policy "staff_write_urban_property_images"
  on storage.objects for all
  using (bucket_id = 'urban-property-images' and public.is_staff())
  with check (bucket_id = 'urban-property-images' and public.is_staff());

create policy "staff_write_rural_property_images"
  on storage.objects for all
  using (bucket_id = 'rural-property-images' and public.is_staff())
  with check (bucket_id = 'rural-property-images' and public.is_staff());

create policy "staff_write_blog_images"
  on storage.objects for all
  using (bucket_id = 'blog-images' and public.is_staff())
  with check (bucket_id = 'blog-images' and public.is_staff());

-- Bucket "documents" (PDFs, memoriais, documentação rural) é privado:
-- somente a equipe acessa leitura e escrita.
create policy "staff_all_documents"
  on storage.objects for all
  using (bucket_id = 'documents' and public.is_staff())
  with check (bucket_id = 'documents' and public.is_staff());
