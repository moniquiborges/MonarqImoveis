-- MONARQ — Distingue leads de COMPRA (interesse em adquirir um imóvel,
-- vindos do formulário de contato ou do "Solicitar Dossiê" nas páginas de
-- imóvel) de leads de VENDA (proprietário querendo anunciar/vender através
-- da MONARQ, formulário /venda-seu-imovel).
--
-- Script IDEMPOTENTE: seguro de rodar mais de uma vez.
--
-- Como aplicar: Supabase Dashboard → seu projeto → SQL Editor → cole este
-- arquivo inteiro → Run.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_type') then
    create type public.lead_type as enum ('compra', 'venda');
  end if;
end $$;

alter table public.leads
  add column if not exists lead_type public.lead_type not null default 'compra';
