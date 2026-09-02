-- MONARQ — Categorias padrão do blog, usadas pelo painel Artigos & Notícias.
--
-- Script IDEMPOTENTE: seguro de rodar mais de uma vez (on conflict do
-- nothing na coluna `slug`, que já é UNIQUE).
--
-- Como aplicar: Supabase Dashboard → seu projeto → SQL Editor → cole este
-- arquivo inteiro → Run.

insert into public.blog_categories (slug, name) values
  ('mercado-imobiliario', 'Mercado imobiliário'),
  ('campo-grande', 'Campo Grande'),
  ('mercado-rural', 'Mercado rural'),
  ('investimentos', 'Investimentos')
on conflict (slug) do nothing;
