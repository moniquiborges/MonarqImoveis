-- MONARQ — Garante profiles + trigger de auth + RLS necessários para o
-- login administrativo e a Gestão de Usuários funcionarem.
--
-- Script IDEMPOTENTE: seguro de rodar mais de uma vez e mesmo que parte
-- disso já exista no projeto (não derruba nem altera as tabelas de imóveis
-- que já estão em produção).
--
-- Como aplicar: Supabase Dashboard → seu projeto → SQL Editor → cole este
-- arquivo inteiro → Run.

-- 1. Extensão necessária para gen_random_uuid()
create extension if not exists "pgcrypto";

-- 2. Enum de papéis (só cria se ainda não existir)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'editor');
  end if;
end $$;

-- 3. Função utilitária de updated_at (create or replace é seguro mesmo se
-- outras tabelas já a usam)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 4. Tabela profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role public.user_role not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 5. Cria automaticamente um profile ao registrar um novo usuário no Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. RLS de profiles
alter table public.profiles enable row level security;

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

drop policy if exists "profiles_select_own_or_staff" on public.profiles;
create policy "profiles_select_own_or_staff"
  on public.profiles for select
  using (id = auth.uid() or public.is_staff());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid());

-- 7. Backfill: cria um profile (role = admin) para qualquer usuário do Auth
-- que já exista hoje e ainda não tenha um — cobre o(s) usuário(s) criado(s)
-- manualmente antes deste script existir.
insert into public.profiles (id, full_name, role)
select u.id, u.raw_user_meta_data->>'full_name', 'admin'
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);
