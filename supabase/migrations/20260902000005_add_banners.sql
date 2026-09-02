-- MONARQ — Tabela de banners promocionais do painel "Banners & Destaques".
-- Esta tabela não existia no schema original; o painel era 100% mock.
--
-- Script IDEMPOTENTE: seguro de rodar mais de uma vez.
--
-- Como aplicar: Supabase Dashboard → seu projeto → SQL Editor → cole este
-- arquivo inteiro → Run.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'banner_location') then
    create type public.banner_location as enum ('hero', 'destaque-sc', 'campo-grande', 'rural');
  end if;
end $$;

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  location public.banner_location not null default 'hero',
  image_url text,
  cta_text text,
  cta_link text,
  active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists banners_location_idx on public.banners (location);

drop trigger if exists set_banners_updated_at on public.banners;
create trigger set_banners_updated_at
  before update on public.banners
  for each row execute function public.set_updated_at();

alter table public.banners enable row level security;

drop policy if exists "banners_public_select_active" on public.banners;
create policy "banners_public_select_active"
  on public.banners for select
  using (active = true or public.is_staff());

drop policy if exists "banners_staff_write" on public.banners;
create policy "banners_staff_write"
  on public.banners for all
  using (public.is_staff())
  with check (public.is_staff());
