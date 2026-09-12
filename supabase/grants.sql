-- ===========================================================================
-- MONARQ Imóveis & Investimentos — Permissões de Acesso (Grants)
-- Execute este comando no SQL Editor do Supabase para liberar os acessos.
-- ===========================================================================

grant usage on schema public, storage to postgres, anon, authenticated, service_role;
grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all functions in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;

-- O storage-api (buckets/objects) roda com o mesmo mecanismo de troca de role
-- (anon/authenticated/service_role) que o PostgREST. USAGE no schema por si só
-- não é suficiente — cada role também precisa de GRANT nas tabelas; RLS/
-- BYPASSRLS não substitui essa permissão.
grant all privileges on all tables in schema storage to postgres, anon, authenticated, service_role;
grant all privileges on all functions in schema storage to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema storage to postgres, anon, authenticated, service_role;

alter default privileges in schema storage grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema storage grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges in schema storage grant all on sequences to postgres, anon, authenticated, service_role;
