import Link from "next/link";
import {
  Building2,
  Home,
  LandPlot,
  Contact,
  Users,
  Newspaper,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  MessageCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { createClient } from "@/lib/supabase/server";
import { listLeads } from "../leads/actions";
import { mockDevelopments } from "@/lib/mock/developments";
import { mockUrbanProperties } from "@/lib/mock/properties";
import { mockRuralProperties } from "@/lib/mock/rural";
import { mockBlogPosts } from "@/lib/mock/posts";
import { formatBRL } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  novo: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  contatado: "bg-blue-500/15 text-blue-700 border-blue-500/30",
  qualificado: "bg-purple-500/15 text-purple-700 border-purple-500/30",
  negociacao: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  convertido: "bg-teal-500/15 text-teal-700 border-teal-500/30",
  perdido: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

export default async function AdminDashboardPage() {
  const configured = isSupabaseConfigured();

  const { leads: allLeads } = await listLeads();
  const recentLeads = allLeads.slice(0, 5);

  let counts = {
    developments: mockDevelopments.length,
    urbanProperties: mockUrbanProperties.length,
    ruralProperties: mockRuralProperties.length,
    posts: mockBlogPosts.length,
    newLeads: allLeads.filter((l) => l.status === "novo").length,
  };

  if (configured) {
    try {
      const supabase = await createClient();
      const [developments, urbanProperties, ruralProperties, newLeads, posts] = await Promise.all([
        supabase.from("developments").select("*", { count: "exact", head: true }),
        supabase.from("urban_properties").select("*", { count: "exact", head: true }),
        supabase.from("rural_properties").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "novo"),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
      ]);

      counts = {
        developments: developments.count ?? counts.developments,
        urbanProperties: urbanProperties.count ?? counts.urbanProperties,
        ruralProperties: ruralProperties.count ?? counts.ruralProperties,
        newLeads: newLeads.count ?? counts.newLeads,
        posts: posts.count ?? counts.posts,
      };
    } catch {
      // Mantém fallback de contagem
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold">
            Visão Geral Executiva
          </span>
          <h1 className="font-display text-2xl md:text-3xl text-graphite font-normal">
            Dashboard MONARQ
          </h1>
          <p className="text-xs md:text-sm text-graphite/60 mt-0.5">
            Monitoramento em tempo real do portfólio, leads e desempenho comercial.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="focus-ring inline-flex items-center gap-1.5 rounded-xs border border-areia/70 bg-white px-3.5 py-2 text-xs font-semibold text-graphite hover:bg-offwhite transition-colors"
          >
            Ver Site Público
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-sm border border-areia/60 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-graphite/50">
              Empreendimentos SC
            </span>
            <Building2 className="h-5 w-5 text-mineral" />
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-graphite">
            {counts.developments}
          </p>
          <span className="mt-1 text-[11px] text-graphite/50 block">Porto Belo, Itapema e BC</span>
        </div>

        <div className="rounded-sm border border-areia/60 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-graphite/50">
              Imóveis Campo Grande
            </span>
            <Home className="h-5 w-5 text-mineral" />
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-graphite">
            {counts.urbanProperties}
          </p>
          <span className="mt-1 text-[11px] text-graphite/50 block">Casas, coberturas e aptos</span>
        </div>

        <div className="rounded-sm border border-areia/60 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-graphite/50">
              Propriedades Rurais
            </span>
            <LandPlot className="h-5 w-5 text-mineral" />
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-graphite">
            {counts.ruralProperties}
          </p>
          <span className="mt-1 text-[11px] text-graphite/50 block">Fazendas em MS &amp; MT</span>
        </div>

        <div className="rounded-sm border border-emerald-500/30 bg-emerald-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-800">
              Novos Leads
            </span>
            <Contact className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-emerald-900">
            {counts.newLeads}
          </p>
          <span className="mt-1 text-[11px] text-emerald-700/80 block">Aguardando atendimento</span>
        </div>
      </div>

      {/* Grade Principal: Leads Recentes & Atalhos Rápidos */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Tabela de Leads Recentes */}
        <div className="lg:col-span-8 rounded-sm border border-areia/60 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-areia/30 pb-4 mb-4">
            <div>
              <h2 className="font-display text-lg font-medium text-graphite">
                Últimos Leads Capturados
              </h2>
              <p className="text-xs text-graphite/50">Clientes que solicitaram atendimento ou proposta.</p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-semibold text-mineral hover:text-mineral-light inline-flex items-center gap-1 transition-colors"
            >
              Ver todos os leads &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-graphite">
              <thead>
                <tr className="border-b border-areia/40 text-graphite/50 uppercase tracking-wider text-[11px]">
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Interesse / Imóvel</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-areia/20">
                {recentLeads.length > 0 ? (
                  recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-offwhite/40 transition-colors">
                      <td className="py-3.5 pr-3">
                        <div className="font-medium text-graphite">{lead.name}</div>
                        <div className="text-[11px] text-graphite/50">{lead.createdAt}</div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <div className="text-graphite line-clamp-1">
                          {lead.message || lead.interest || "—"}
                        </div>
                        <div className="text-[11px] text-graphite/50 font-mono">{lead.phone}</div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            statusColors[lead.status] || "bg-graphite/10 text-graphite"
                          }`}
                        >
                          {lead.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <a
                          href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Olá ${lead.name}, sou da MONARQ Imóveis. Recebi seu contato.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all font-semibold text-[11px]"
                        >
                          <MessageCircle className="h-3 w-3" />
                          WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-graphite/50">
                      Nenhum lead capturado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coluna Direita: Atalhos Rápidos & Status de Operação */}
        <div className="lg:col-span-4 space-y-6">
          {/* Atalhos Rápidos */}
          <div className="rounded-sm border border-areia/60 bg-white p-6 shadow-xs">
            <h3 className="font-display text-base font-medium text-graphite mb-4">
              Ações Rápidas
            </h3>
            <div className="space-y-2.5">
              <Link
                href="/admin/empreendimentos"
                className="flex items-center justify-between p-3 rounded-xs border border-areia/40 bg-offwhite/30 hover:bg-offwhite hover:border-mineral/30 transition-all text-xs font-medium text-graphite group"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-4 w-4 text-mineral" />
                  <span>Cadastrar Empreendimento SC</span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-graphite/40 group-hover:text-mineral" />
              </Link>

              <Link
                href="/admin/imoveis"
                className="flex items-center justify-between p-3 rounded-xs border border-areia/40 bg-offwhite/30 hover:bg-offwhite hover:border-mineral/30 transition-all text-xs font-medium text-graphite group"
              >
                <div className="flex items-center gap-2.5">
                  <Home className="h-4 w-4 text-mineral" />
                  <span>Novo Imóvel Campo Grande</span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-graphite/40 group-hover:text-mineral" />
              </Link>

              <Link
                href="/admin/rural"
                className="flex items-center justify-between p-3 rounded-xs border border-areia/40 bg-offwhite/30 hover:bg-offwhite hover:border-mineral/30 transition-all text-xs font-medium text-graphite group"
              >
                <div className="flex items-center gap-2.5">
                  <LandPlot className="h-4 w-4 text-mineral" />
                  <span>Cadastrar Fazenda (MS/MT)</span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-graphite/40 group-hover:text-mineral" />
              </Link>

              <Link
                href="/admin/blog"
                className="flex items-center justify-between p-3 rounded-xs border border-areia/40 bg-offwhite/30 hover:bg-offwhite hover:border-mineral/30 transition-all text-xs font-medium text-graphite group"
              >
                <div className="flex items-center gap-2.5">
                  <Newspaper className="h-4 w-4 text-mineral" />
                  <span>Publicar Artigo no Blog</span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-graphite/40 group-hover:text-mineral" />
              </Link>
            </div>
          </div>

          {/* Status do Ambiente */}
          <div className="rounded-sm border border-areia/60 bg-white p-6 shadow-xs text-xs">
            <h4 className="font-display text-sm font-medium text-graphite mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-mineral" />
              Status do Sistema
            </h4>
            <div className="space-y-2 text-graphite/70">
              <div className="flex items-center justify-between">
                <span>Banco de Dados:</span>
                <strong className={configured ? "text-emerald-700" : "text-amber-700"}>
                  {configured ? "Supabase Conectado" : "Modo Demonstração"}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Versão do Portal:</span>
                <span className="font-mono text-graphite">v1.0.0 (Next.js 16)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Armazenamento:</span>
                <span>4 Buckets Configurados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
