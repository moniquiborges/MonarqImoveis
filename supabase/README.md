# Banco de dados MONARQ — Supabase

Migrations locais, ainda **não aplicadas** a nenhum projeto Supabase remoto.

## Arquivos

- `migrations/20260823000001_init_schema.sql` — tabelas, enums e triggers.
- `migrations/20260823000002_rls.sql` — Row Level Security (leitura pública de conteúdo publicado; escrita restrita à equipe via `profiles.role`).
- `migrations/20260823000003_storage.sql` — buckets de imagens/documentos e políticas de acesso.

## Como aplicar (quando houver um projeto Supabase real)

1. Criar o projeto em supabase.com (ou `supabase projects create`, requer login).
2. `supabase link --project-ref <ref>`
3. Revisar as migrations acima.
4. `supabase db push`
5. Criar o primeiro usuário administrador (Dashboard → Authentication → Add user, ou `supabase auth admin create-user`). Um `profile` com `role = 'admin'` é criado automaticamente pelo trigger `handle_new_user`.
6. Preencher `.env.local` com `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` (este último nunca é exposto ao navegador).

Nenhum destes passos foi executado por não haver credenciais reais fornecidas.
