-- MONARQ Imóveis & Investimentos — schema inicial
-- Esta migration é local e NÃO foi aplicada a nenhum projeto Supabase remoto.
-- Aplique com `supabase db push` (ou via dashboard) somente após revisão.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------------

create type public.user_role as enum ('admin', 'editor');

create type public.listing_status as enum ('draft', 'published', 'archived', 'sold');

create type public.development_stage as enum ('lancamento', 'em-obras', 'pronto', 'vendido');

create type public.unit_status as enum ('disponivel', 'reservado', 'vendido');

create type public.rural_activity as enum ('agricultura', 'pecuaria', 'investimento');

create type public.property_badge as enum (
  'exclusivo',
  'lancamento',
  'em-obras',
  'pronto',
  'frente-mar',
  'novo',
  'oportunidade',
  'alto-padrao',
  'vendido'
);

create type public.sc_city as enum ('porto-belo', 'itapema', 'balneario-camboriu');

create type public.rural_state as enum ('MS', 'MT');

create type public.image_entity_type as enum ('development', 'urban_property', 'rural_property');

create type public.lead_interest as enum (
  'porto-belo',
  'itapema',
  'balneario-camboriu',
  'campo-grande',
  'rural',
  'investimento'
);

create type public.lead_status as enum (
  'novo',
  'contatado',
  'qualificado',
  'negociacao',
  'convertido',
  'perdido'
);

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- PROFILES (usuários administrativos)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role public.user_role not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Cria automaticamente um profile ao registrar um novo usuário no Supabase Auth.
-- Não há cadastro público: contas só são criadas manualmente pela equipe MONARQ.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- AGENTS (corretores) — vazio até cadastro real via /admin
-- ---------------------------------------------------------------------------

create table public.agents (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  creci text,
  photo_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_agents_updated_at
  before update on public.agents
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- DEVELOPMENTS (empreendimentos SC)
-- ---------------------------------------------------------------------------

create table public.developments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  city public.sc_city not null,
  neighborhood text,
  address text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  builder text,
  agent_id uuid references public.agents (id) on delete set null,
  short_description text,
  description text,
  status public.listing_status not null default 'draft',
  stage public.development_stage not null default 'lancamento',
  delivery_forecast text,
  towers int,
  total_units int,
  bedrooms_min int,
  bedrooms_max int,
  suites_min int,
  suites_max int,
  parking_min int,
  parking_max int,
  area_min numeric(10, 2),
  area_max numeric(10, 2),
  distance_to_sea text,
  price_from numeric(14, 2),
  down_payment_terms text,
  amenities text[] not null default '{}',
  badges public.property_badge[] not null default '{}',
  video_url text,
  tour_url text,
  brochure_url text,
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index developments_city_idx on public.developments (city);
create index developments_status_idx on public.developments (status);

create trigger set_developments_updated_at
  before update on public.developments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- DEVELOPMENT UNITS (unidades de um empreendimento)
-- ---------------------------------------------------------------------------

create table public.development_units (
  id uuid primary key default gen_random_uuid(),
  development_id uuid not null references public.developments (id) on delete cascade,
  unit_number text,
  floor int,
  tower text,
  position text,
  area numeric(10, 2),
  bedrooms int,
  suites int,
  parking int,
  price numeric(14, 2),
  status public.unit_status not null default 'disponivel',
  floor_plan_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index development_units_development_id_idx on public.development_units (development_id);
create index development_units_status_idx on public.development_units (status);

create trigger set_development_units_updated_at
  before update on public.development_units
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- URBAN PROPERTIES (Campo Grande/MS)
-- ---------------------------------------------------------------------------

create table public.urban_properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  code text not null unique,
  title text not null,
  property_type text not null,
  neighborhood text not null,
  city text not null default 'Campo Grande',
  address text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  agent_id uuid references public.agents (id) on delete set null,
  description text,
  status public.listing_status not null default 'draft',
  price numeric(14, 2),
  condo_fee numeric(10, 2),
  bedrooms int,
  suites int,
  parking int,
  area numeric(10, 2),
  features text[] not null default '{}',
  badges public.property_badge[] not null default '{}',
  video_url text,
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index urban_properties_status_idx on public.urban_properties (status);
create index urban_properties_neighborhood_idx on public.urban_properties (neighborhood);

create trigger set_urban_properties_updated_at
  before update on public.urban_properties
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RURAL PROPERTIES (MS e MT)
-- ---------------------------------------------------------------------------

create table public.rural_properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  code text not null unique,
  title text not null,
  state public.rural_state not null,
  municipality text not null,
  access_description text,
  distance_to_city text,
  -- coordenadas aproximadas por padrão; exibição exata é opt-in (ver display_precise_location)
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  display_precise_location boolean not null default false,
  agent_id uuid references public.agents (id) on delete set null,
  description text,
  status public.listing_status not null default 'draft',
  total_hectares numeric(12, 2) not null,
  total_alqueires numeric(12, 2),
  productive_area numeric(12, 2),
  reserve_area numeric(12, 2),
  activity public.rural_activity[] not null default '{}',
  soil_type text,
  topography text,
  water_sources text[] not null default '{}',
  has_electricity boolean,
  has_main_house boolean,
  has_worker_housing boolean,
  has_corral boolean,
  has_barn boolean,
  has_silo boolean,
  has_warehouse boolean,
  documentation_notes text,
  car_registration text,
  georeferenced boolean not null default false,
  approximate_capacity text,
  price numeric(14, 2),
  price_per_hectare numeric(14, 2),
  badges public.property_badge[] not null default '{}',
  video_url text,
  drone_video_url text,
  brochure_url text,
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index rural_properties_state_idx on public.rural_properties (state);
create index rural_properties_status_idx on public.rural_properties (status);

create trigger set_rural_properties_updated_at
  before update on public.rural_properties
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- PROPERTY IMAGES (galeria polimórfica)
-- ---------------------------------------------------------------------------

create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  entity_type public.image_entity_type not null,
  entity_id uuid not null,
  url text not null,
  alt text not null default '',
  is_cover boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index property_images_entity_idx on public.property_images (entity_type, entity_id);

-- ---------------------------------------------------------------------------
-- BLOG (conteúdo editorial)
-- ---------------------------------------------------------------------------

create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  category_id uuid references public.blog_categories (id) on delete set null,
  cover_image_url text,
  cover_image_alt text,
  author_id uuid references public.profiles (id) on delete set null,
  status public.listing_status not null default 'draft',
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_status_idx on public.blog_posts (status);
create index blog_posts_category_id_idx on public.blog_posts (category_id);

create trigger set_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- LEADS
-- ---------------------------------------------------------------------------

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  message text,
  interest public.lead_interest,
  development_id uuid references public.developments (id) on delete set null,
  urban_property_id uuid references public.urban_properties (id) on delete set null,
  rural_property_id uuid references public.rural_properties (id) on delete set null,
  origin_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  status public.lead_status not null default 'novo',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_status_idx on public.leads (status);
create index leads_created_at_idx on public.leads (created_at desc);

create trigger set_leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- FAVORITES (usuários autenticados)
-- ---------------------------------------------------------------------------

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entity_type public.image_entity_type not null,
  entity_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, entity_type, entity_id)
);

-- ---------------------------------------------------------------------------
-- SETTINGS (configurações administrativas simples chave/valor)
-- ---------------------------------------------------------------------------

create table public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create trigger set_settings_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();
