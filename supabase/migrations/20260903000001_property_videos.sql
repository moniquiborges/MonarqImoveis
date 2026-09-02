-- MONARQ — Vídeos de anúncios (upload interno + link externo)
-- Espelha o padrão polimórfico de public.property_images.
-- Rodar no SQL Editor do projeto Supabase (Dashboard → SQL Editor → Run).
-- Idempotente: seguro rodar mais de uma vez.

create table if not exists public.property_videos (
  id uuid primary key default gen_random_uuid(),
  entity_type public.image_entity_type not null,
  entity_id uuid not null,
  kind text not null default 'external' check (kind in ('upload', 'external')),
  url text not null,
  alt text not null default '',
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists property_videos_entity_idx on public.property_videos (entity_type, entity_id);

-- ---------------------------------------------------------------------------
-- RLS — mesmo padrão de public.property_images.
-- ---------------------------------------------------------------------------

alter table public.property_videos enable row level security;

drop policy if exists "property_videos_public_select" on public.property_videos;
create policy "property_videos_public_select"
  on public.property_videos for select
  using (
    public.is_staff()
    or (entity_type = 'development' and exists (
      select 1 from public.developments d where d.id = entity_id and d.status = 'published'
    ))
    or (entity_type = 'urban_property' and exists (
      select 1 from public.urban_properties p where p.id = entity_id and p.status = 'published'
    ))
    or (entity_type = 'rural_property' and exists (
      select 1 from public.rural_properties r where r.id = entity_id and r.status = 'published'
    ))
  );

drop policy if exists "property_videos_staff_write" on public.property_videos;
create policy "property_videos_staff_write"
  on public.property_videos for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- STORAGE — bucket para vídeos enviados diretamente (upload interno).
-- Vídeos "externos" (YouTube/Vimeo/link direto) não usam este bucket, apenas
-- gravam a URL informada pelo admin em property_videos.url.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('property-videos', 'property-videos', true)
on conflict (id) do nothing;

drop policy if exists "public_read_property_videos" on storage.objects;
create policy "public_read_property_videos"
  on storage.objects for select
  using (bucket_id = 'property-videos');

drop policy if exists "staff_write_property_videos" on storage.objects;
create policy "staff_write_property_videos"
  on storage.objects for all
  using (bucket_id = 'property-videos' and public.is_staff())
  with check (bucket_id = 'property-videos' and public.is_staff());
