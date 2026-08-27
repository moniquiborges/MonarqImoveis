"use client";

import { useState } from "react";
import { Settings, Save, CheckCircle2, ShieldCheck, Globe, Share2, BarChart3 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function AdminConfiguracoesPage() {
  const [config, setConfig] = useState({
    name: siteConfig.name,
    tagline: siteConfig.tagline,
    whatsappNumber: siteConfig.whatsappNumber || "5567999998888",
    whatsappDisplay: siteConfig.whatsappDisplay || "(67) 99999-8888",
    contactEmail: siteConfig.contactEmail || "contatomonarqimoveis@gmail.com",
    contactPhone: siteConfig.contactPhone || "(47) 99976-1982",
    cnpj: siteConfig.cnpj || "65.640.045/0001-76",
    instagramUrl: siteConfig.instagramUrl || "https://instagram.com/monarqimoveis",
    facebookUrl: siteConfig.facebookUrl || "https://facebook.com/monarqimoveis",
    gtmId: "GTM-XXXXXX",
    ga4Id: "G-XXXXXXXXXX",
    metaPixelId: "000000000000",
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold">
            Sistema &amp; Integrações
          </span>
          <h1 className="font-display text-2xl md:text-3xl text-graphite font-normal">
            Configurações Gerais
          </h1>
          <p className="text-xs md:text-sm text-graphite/60 mt-0.5">
            Gerenciamento de dados institucionais, WhatsApp, redes e tags de monitoramento.
          </p>
        </div>

        {saved && (
          <div className="inline-flex items-center gap-1.5 rounded-xs bg-emerald-50 border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-800 font-semibold animate-fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Configurações salvas!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Bloco 1: Dados Institucionais */}
        <div className="rounded-sm border border-areia/60 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-display text-lg text-graphite font-medium border-b border-areia/30 pb-3 flex items-center gap-2">
            <Globe className="h-4 w-4 text-mineral" />
            Dados Institucionais &amp; Contato
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-graphite mb-1">Nome da Empresa</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-graphite mb-1">Slogan / Tagline</label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-graphite mb-1">WhatsApp (Número Completo)</label>
              <input
                type="text"
                placeholder="5567999998888"
                value={config.whatsappNumber}
                onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-graphite mb-1">WhatsApp (Exibição Formatada)</label>
              <input
                type="text"
                placeholder="(67) 99999-8888"
                value={config.whatsappDisplay}
                onChange={(e) => setConfig({ ...config, whatsappDisplay: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-graphite mb-1">E-mail de Contato</label>
              <input
                type="email"
                value={config.contactEmail}
                onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-graphite mb-1">Telefone Fixo / Comercial</label>
              <input
                type="text"
                value={config.contactPhone}
                onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-graphite mb-1">CNPJ</label>
              <input
                type="text"
                value={config.cnpj}
                onChange={(e) => setConfig({ ...config, cnpj: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Redes Sociais */}
        <div className="rounded-sm border border-areia/60 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-display text-lg text-graphite font-medium border-b border-areia/30 pb-3 flex items-center gap-2">
            <Share2 className="h-4 w-4 text-mineral" />
            Redes Sociais Oficiais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-graphite mb-1">Instagram URL</label>
              <input
                type="url"
                value={config.instagramUrl}
                onChange={(e) => setConfig({ ...config, instagramUrl: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-graphite mb-1">Facebook URL</label>
              <input
                type="url"
                value={config.facebookUrl}
                onChange={(e) => setConfig({ ...config, facebookUrl: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
              />
            </div>
          </div>
        </div>

        {/* Bloco 3: Analytics e Pixel */}
        <div className="rounded-sm border border-areia/60 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-display text-lg text-graphite font-medium border-b border-areia/30 pb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-mineral" />
            Métricas, Rastreamento &amp; Pixels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-graphite mb-1">Google Tag Manager (GTM)</label>
              <input
                type="text"
                placeholder="GTM-XXXXXX"
                value={config.gtmId}
                onChange={(e) => setConfig({ ...config, gtmId: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-graphite mb-1">Google Analytics 4 (GA4)</label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={config.ga4Id}
                onChange={(e) => setConfig({ ...config, ga4Id: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-graphite mb-1">Meta Pixel ID</label>
              <input
                type="text"
                placeholder="000000000000"
                value={config.metaPixelId}
                onChange={(e) => setConfig({ ...config, metaPixelId: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite font-mono"
              />
            </div>
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="focus-ring inline-flex items-center gap-2 rounded-xs bg-mineral px-6 py-3 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-sm"
          >
            <Save className="h-4 w-4" />
            Salvar Todas as Configurações
          </button>
        </div>
      </form>
    </div>
  );
}
