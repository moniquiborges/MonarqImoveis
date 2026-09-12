#!/usr/bin/env bash
# ==============================================================================
# Script de Deploy / Atualização do Monarq Imóveis
# ==============================================================================

set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
    echo "ERRO: Arquivo .env não encontrado!"
    echo "Copie o arquivo .env.production.example para .env e configure os valores:"
    echo "  cp .env.production.example .env"
    echo "  nano .env"
    exit 1
fi

echo "===> 1. Carregando variáveis de ambiente..."
# Exporta variáveis do .env para o docker compose
set -a
# shellcheck disable=SC1091
source .env
set +a

echo "===> 2. Construindo e iniciando os serviços do sistema..."
docker compose build --pull app
docker compose up -d --remove-orphans

echo "===> 3. Aguardando banco de dados ficar pronto..."
docker compose exec -T db sh -c 'until pg_isready -U postgres; do sleep 1; done'

echo "===> 4. Executando schema inicial e permissões..."
if [ -f "supabase/schema_completo.sql" ]; then
    docker compose exec -T db psql -U postgres -d "${POSTGRES_DB:-postgres}" -f "/opt/monarq/supabase/schema_completo.sql" || true
fi
if [ -f "supabase/grants.sql" ]; then
    docker compose exec -T db psql -U postgres -d "${POSTGRES_DB:-postgres}" -f "/opt/monarq/supabase/grants.sql" || true
fi

echo "===> 5. Executando migrações adicionais se necessário..."
if [ -d "supabase/migrations" ]; then
    for migration in $(ls supabase/migrations/*.sql 2>/dev/null | sort); do
        echo "Verificando migração: $migration"
        docker compose exec -T db psql -U postgres -d "${POSTGRES_DB:-postgres}" -f "/opt/monarq/$migration" || true
    done
fi

echo "===> 6. Limpando imagens antigas e não utilizadas para poupar disco..."
docker image prune -f

echo "=========================================================================="
echo " Deploy concluído com sucesso!"
echo " Status dos containers:"
echo "=========================================================================="
docker compose ps
