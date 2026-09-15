-- MONARQ — Expansão do enum rural_state para todos os estados brasileiros (UFs)
--
-- Motivo: Originalmente o banco aceitava apenas 'MS' e 'MT'. Ao cadastrar imóveis
-- em outros estados (como 'PR', 'GO', 'SP', 'MG', 'BA', etc.), o PostgreSQL
-- rejeitava com o erro: invalid input value for enum rural_state: "PR".
--
-- Script IDEMPOTENTE: seguro de rodar mais de uma vez.
--
-- Como aplicar:
-- Supabase Dashboard → seu projeto (gxnqfrmwjobvgcrdguay) → SQL Editor → Cole este arquivo → Run.

ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'AC';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'AL';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'AP';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'AM';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'BA';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'CE';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'DF';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'ES';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'GO';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'MA';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'MG';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'PA';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'PB';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'PR';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'PE';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'PI';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'RJ';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'RN';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'RS';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'RO';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'RR';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'SC';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'SP';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'SE';
ALTER TYPE public.rural_state ADD VALUE IF NOT EXISTS 'TO';
