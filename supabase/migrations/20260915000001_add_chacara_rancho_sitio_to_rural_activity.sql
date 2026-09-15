-- MONARQ — Expansão do enum rural_activity para incluir chácara, rancho e sítio
--
-- Motivo: Permitir o cadastro de propriedades rurais categorizadas como
-- chácara, rancho ou sítio diretamente na aptidão principal / atividade.
--
-- Script IDEMPOTENTE: seguro de rodar mais de uma vez.
--
-- Como aplicar:
-- Supabase Dashboard → seu projeto → SQL Editor → Cole este arquivo → Run.

ALTER TYPE public.rural_activity ADD VALUE IF NOT EXISTS 'chacara';
ALTER TYPE public.rural_activity ADD VALUE IF NOT EXISTS 'rancho';
ALTER TYPE public.rural_activity ADD VALUE IF NOT EXISTS 'sitio';
