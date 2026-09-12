#!/usr/bin/env bash
# ==============================================================================
# Script de Provisionamento e Otimização para VPS HostGator (Ubuntu 22.04 LTS)
# Projeto: Monarq Imóveis (Next.js + Supabase Lite em 2GB RAM)
# ==============================================================================

set -euo pipefail

echo "===> 1. Atualizando pacotes do sistema..."
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl wget git ufw htop ca-certificates gnupg lsb-release

echo "===> 2. Configurando Swapfile de 3 GB (Proteção contra falta de memória)..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 3G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=3072
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    
    # Otimização de swappiness (usar RAM prioritariamente e recorrer ao swap suavemente)
    echo 'vm.swappiness=15' | sudo tee -a /etc/sysctl.conf
    echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf
    sudo sysctl -p
    echo "Swap de 3 GB ativado com sucesso!"
else
    echo "Swapfile já existente. Pulando..."
fi

echo "===> 3. Instalando Docker Engine e Docker Compose oficial..."
if ! command -v docker &> /dev/null; then
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    sudo systemctl enable docker
    sudo systemctl start docker

    # Permite rodar docker sem sudo se não for root
    sudo usermod -aG docker "$USER" || true
    echo "Docker instalado com sucesso!"
else
    echo "Docker já instalado."
fi

echo "===> 4. Configurando Firewall UFW..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH padrao'
sudo ufw allow 22022/tcp comment 'SSH HostGator'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
sudo ufw --force enable

echo "=========================================================================="
echo " VPS configurada e otimizada com sucesso para 2 GB de RAM!"
echo " Próximo passo: clone seu repositório, preencha o .env e rode ./scripts/deploy.sh"
echo "=========================================================================="
