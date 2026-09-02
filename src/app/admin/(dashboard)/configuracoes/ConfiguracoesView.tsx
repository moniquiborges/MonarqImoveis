"use client";

import { useState } from "react";
import { Save, CheckCircle2, Globe, Share2, BarChart3 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { saveSettings, type AnalyticsSettingsInput, type SiteConfigSettings } from "./actions";

interface ConfiguracoesViewProps {
  initialSiteConfig: SiteConfigSettings | null;
  initialAnalytics: AnalyticsSettingsInput | null;
  initialError: string | null;
}

const defaultSiteConfig = (): SiteConfigSettings => ({
  name: siteConfig.name,
  tagline: siteConfig.tagline,
  whatsappNumber: siteConfig.whatsappNumber || "",
  whatsappDisplay: siteConfig.whatsappDisplay || "",
  contactEmail: siteConfig.contactEmail || "",
  contactPhone: siteConfig.contactPhone || "",
  cnpj: siteConfig.cnpj || "",
  instagramUrl: siteConfig.instagramUrl || "",
  facebookUrl: siteConfig.facebookUrl || "",
});

const emptyAnalytics: AnalyticsSettingsInput = { gtmId: "", ga4Id: "", metaPixelId: "" };

export function ConfiguracoesView({
  initialSiteConfig,
  initialAnalytics,
  initialError,
}: ConfiguracoesViewProps) {
  const [config, setConfig] = useState<SiteConfigSettings>(initialSiteConfig ?? defaultSiteConfig());
  const [analytics, setAnalytics] = useState<AnalyticsSettingsInput>(
    initialAnalytics ?? emptyAnalytics
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setSaved(false);

    const result = await saveSettings({ siteConfig: config, analytics });

    setIsSubmitting(false);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setFormError(result.error ?? "Não foi possível salvar as configurações.");
    }
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

      {initialError && (
        <div className="rounded-xs border border-rose-300 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {initialError}
        </div>
      )}

      <div className="rounded-xs border border-mineral/20 bg-mineral/5 px-4 py-3 text-xs text-graphite/70">
        Os dados institucionais abaixo (WhatsApp, e-mail, redes sociais) ficam salvos aqui para
        referência da equipe. O site público continua usando os valores publicados em código até
        que essa reflexão seja conectada.
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {formError && (
          <div className="rounded-xs border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
            {formError}
          </div>
        )}

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
              <label className="block text-xs font-medium text-graphite mb-1">
                WhatsApp (Número Completo)
              </label>
              <input
                type="text"
                placeholder="5567999998888"
                value={config.whatsappNumber}
                onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-graphite mb-1">
                WhatsApp (Exibição Formatada)
              </label>
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
              <label className="block text-xs font-medium text-graphite mb-1">
                Telefone Fixo / Comercial
              </label>
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
          <p className="text-[11px] text-graphite/50 -mt-2">
            Preenchendo e salvando um ID abaixo, o script correspondente passa a carregar em toda
            página do site para todo visitante.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-graphite mb-1">
                Google Tag Manager (GTM)
              </label>
              <input
                type="text"
                placeholder="GTM-XXXXXX"
                value={analytics.gtmId}
                onChange={(e) => setAnalytics({ ...analytics, gtmId: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-graphite mb-1">
                Google Analytics 4 (GA4)
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={analytics.ga4Id}
                onChange={(e) => setAnalytics({ ...analytics, ga4Id: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-graphite mb-1">Meta Pixel ID</label>
              <input
                type="text"
                placeholder="000000000000"
                value={analytics.metaPixelId}
                onChange={(e) => setAnalytics({ ...analytics, metaPixelId: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite font-mono"
              />
            </div>
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="focus-ring inline-flex items-center gap-2 rounded-xs bg-mineral px-6 py-3 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-sm disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Salvando…" : "Salvar Todas as Configurações"}
          </button>
        </div>
      </form>
    </div>
  );
}
