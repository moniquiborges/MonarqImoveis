-- MONARQ — Adiciona o cargo/especialidade do corretor (ex: "Especialista
-- Porto Belo & Itapema", "Diretoria & Agronegócio"), usado no painel
-- Corretores & Consultores mas ausente do schema original de `agents`.
--
-- Script IDEMPOTENTE: seguro de rodar mais de uma vez.
--
-- Como aplicar: Supabase Dashboard → seu projeto → SQL Editor → cole este
-- arquivo inteiro → Run.

alter table public.agents
  add column if not exists role_title text;
