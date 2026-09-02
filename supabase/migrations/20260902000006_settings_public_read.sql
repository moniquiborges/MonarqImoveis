-- MONARQ — Permite leitura pública da tabela settings.
--
-- Necessário para o layout raiz do site injetar os scripts de
-- Analytics/GTM/Meta Pixel para QUALQUER visitante (não só a equipe
-- logada). Escrita continua restrita à equipe via a policy
-- "settings_staff_all" já existente (não removida por este script).
--
-- Script IDEMPOTENTE: seguro de rodar mais de uma vez.
--
-- Como aplicar: Supabase Dashboard → seu projeto → SQL Editor → cole este
-- arquivo inteiro → Run.

drop policy if exists "settings_public_select" on public.settings;
create policy "settings_public_select"
  on public.settings for select
  using (true);
