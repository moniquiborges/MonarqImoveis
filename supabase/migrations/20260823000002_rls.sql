-- MONARQ — Row Level Security
-- Regra geral: leitura pública somente do que está "published"; escrita
-- restrita a usuários com profile role = 'admin' ou 'editor'.
-- Esta migration é local e NÃO foi aplicada a nenhum projeto Supabase remoto.

create or replace function public.is_staff()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

-- ---------------------------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;

create policy "profiles_select_own_or_staff"
  on public.profiles for select
  using (id = auth.uid() or public.is_staff());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid());

-- ---------------------------------------------------------------------------
-- AGENTS
-- ---------------------------------------------------------------------------

alter table public.agents enable row level security;

create policy "agents_public_select_active"
  on public.agents for select
  using (active = true or public.is_staff());

create policy "agents_staff_write"
  on public.agents for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- DEVELOPMENTS
-- ---------------------------------------------------------------------------

alter table public.developments enable row level security;

create policy "developments_public_select_published"
  on public.developments for select
  using (status = 'published' or public.is_staff());

create policy "developments_staff_write"
  on public.developments for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- DEVELOPMENT UNITS
-- ---------------------------------------------------------------------------

alter table public.development_units enable row level security;

create policy "development_units_public_select"
  on public.development_units for select
  using (
    public.is_staff()
    or exists (
      select 1 from public.developments d
      where d.id = development_id and d.status = 'published'
    )
  );

create policy "development_units_staff_write"
  on public.development_units for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- URBAN PROPERTIES
-- ---------------------------------------------------------------------------

alter table public.urban_properties enable row level security;

create policy "urban_properties_public_select_published"
  on public.urban_properties for select
  using (status = 'published' or public.is_staff());

create policy "urban_properties_staff_write"
  on public.urban_properties for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- RURAL PROPERTIES
-- ---------------------------------------------------------------------------

alter table public.rural_properties enable row level security;

create policy "rural_properties_public_select_published"
  on public.rural_properties for select
  using (status = 'published' or public.is_staff());

create policy "rural_properties_staff_write"
  on public.rural_properties for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- PROPERTY IMAGES
-- ---------------------------------------------------------------------------

alter table public.property_images enable row level security;

create policy "property_images_public_select"
  on public.property_images for select
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

create policy "property_images_staff_write"
  on public.property_images for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- BLOG
-- ---------------------------------------------------------------------------

alter table public.blog_categories enable row level security;

create policy "blog_categories_public_select"
  on public.blog_categories for select
  using (true);

create policy "blog_categories_staff_write"
  on public.blog_categories for all
  using (public.is_staff())
  with check (public.is_staff());

alter table public.blog_posts enable row level security;

create policy "blog_posts_public_select_published"
  on public.blog_posts for select
  using (status = 'published' or public.is_staff());

create policy "blog_posts_staff_write"
  on public.blog_posts for all
  using (public.is_staff())
  with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- LEADS — qualquer visitante pode criar (formulário público); leitura/gestão
-- restrita à equipe.
-- ---------------------------------------------------------------------------

alter table public.leads enable row level security;

create policy "leads_public_insert"
  on public.leads for insert
  with check (true);

create policy "leads_staff_select"
  on public.leads for select
  using (public.is_staff());

create policy "leads_staff_update"
  on public.leads for update
  using (public.is_staff())
  with check (public.is_staff());

create policy "leads_staff_delete"
  on public.leads for delete
  using (public.is_staff());

-- ---------------------------------------------------------------------------
-- FAVORITES — cada usuário autenticado gerencia somente os próprios registros.
-- ---------------------------------------------------------------------------

alter table public.favorites enable row level security;

create policy "favorites_owner_all"
  on public.favorites for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- SETTINGS — somente equipe.
-- ---------------------------------------------------------------------------

alter table public.settings enable row level security;

create policy "settings_staff_all"
  on public.settings for all
  using (public.is_staff())
  with check (public.is_staff());
