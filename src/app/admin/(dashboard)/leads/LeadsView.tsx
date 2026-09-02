"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, MessageCircle, Calendar } from "lucide-react";
import { updateLeadStatus, type LeadListItem } from "./actions";
import type { LeadStatusDb, LeadTypeDb } from "@/types/database";

interface LeadsViewProps {
  initialLeads: LeadListItem[];
  initialError: string | null;
}

const typeOptions: { value: LeadTypeDb | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "compra", label: "Interesse em Compra" },
  { value: "venda", label: "Interesse em Venda" },
];

const typeBadge: Record<LeadTypeDb, string> = {
  compra: "bg-sky-500/15 text-sky-700 border-sky-500/30",
  venda: "bg-orange-500/15 text-orange-700 border-orange-500/30",
};

const typeLabel: Record<LeadTypeDb, string> = {
  compra: "Compra",
  venda: "Venda",
};

const statusOptions: { value: LeadStatusDb | "all"; label: string; color: string }[] = [
  { value: "all", label: "Todos os Leads", color: "" },
  { value: "novo", label: "Novo", color: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" },
  { value: "contatado", label: "Contatado", color: "bg-blue-500/15 text-blue-700 border-blue-500/30" },
  { value: "qualificado", label: "Qualificado", color: "bg-purple-500/15 text-purple-700 border-purple-500/30" },
  { value: "negociacao", label: "Em Negociação", color: "bg-amber-500/15 text-amber-700 border-amber-500/30" },
  { value: "convertido", label: "Convertido", color: "bg-teal-500/15 text-teal-700 border-teal-500/30" },
  { value: "perdido", label: "Perdido", color: "bg-rose-500/15 text-rose-700 border-rose-500/30" },
];

const INTEREST_LABELS: Record<string, string> = {
  "porto-belo": "Porto Belo - SC",
  itapema: "Itapema - SC",
  "balneario-camboriu": "Balneário Camboriú - SC",
  "campo-grande": "Campo Grande - MS",
  rural: "Rural (MS/MT)",
  investimento: "Investimento",
};

export function LeadsView({ initialLeads, initialError }: LeadsViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedStatus, setSelectedStatus] = useState<LeadStatusDb | "all">("all");
  const [selectedType, setSelectedType] = useState<LeadTypeDb | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const handleStatusChange = (id: string, newStatus: LeadStatusDb) => {
    setActionError(null);
    startTransition(async () => {
      const result = await updateLeadStatus(id, newStatus);
      if (result.success) {
        router.refresh();
      } else {
        setActionError(result.error ?? "Não foi possível atualizar o status.");
      }
    });
  };

  const filteredLeads = useMemo(() => {
    return initialLeads.filter((lead) => {
      if (selectedStatus !== "all" && lead.status !== selectedStatus) return false;
      if (selectedType !== "all" && lead.leadType !== selectedType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = lead.name.toLowerCase().includes(q);
        const matchPhone = lead.phone.includes(q);
        const matchEmail = lead.email.toLowerCase().includes(q);
        const matchMessage = (lead.message ?? "").toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchEmail && !matchMessage) return false;
      }
      return true;
    });
  }, [initialLeads, selectedStatus, selectedType, searchQuery]);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold">
            Funil Comercial
          </span>
          <h1 className="font-display text-2xl md:text-3xl text-graphite font-normal">
            Gestão de Leads &amp; Atendimento
          </h1>
          <p className="text-xs md:text-sm text-graphite/60 mt-0.5">
            Gerencie e converta contatos gerados no portal e campanhas digitais.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="rounded-xs bg-emerald-50 border border-emerald-500/30 px-3 py-1.5 text-emerald-800 font-semibold">
            {initialLeads.filter((l) => l.status === "novo").length} novos leads
          </div>
          <div className="rounded-xs bg-white border border-areia/60 px-3 py-1.5 text-graphite font-medium">
            Total: {initialLeads.length} leads
          </div>
        </div>
      </div>

      {initialError && (
        <div className="rounded-xs border border-rose-300 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {initialError}
        </div>
      )}
      {actionError && (
        <div className="rounded-xs border border-rose-300 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {actionError}
        </div>
      )}

      {/* Filtro por tipo de lead */}
      <div className="rounded-sm border border-areia/60 bg-white p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-graphite/50">
            Tipo de Lead
          </span>
          <div className="flex flex-wrap gap-1.5">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedType(opt.value)}
                className={`rounded-xs px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedType === opt.value
                    ? "bg-graphite text-offwhite"
                    : "bg-offwhite/50 text-graphite/70 hover:bg-areia/30 border border-areia/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-graphite/60">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            Compra: {initialLeads.filter((l) => l.leadType === "compra").length}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Venda: {initialLeads.filter((l) => l.leadType === "venda").length}
          </span>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="rounded-sm border border-areia/60 bg-white p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedStatus(opt.value)}
              className={`rounded-xs px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedStatus === opt.value
                  ? "bg-mineral text-offwhite"
                  : "bg-offwhite/50 text-graphite/70 hover:bg-areia/30 border border-areia/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-graphite/40" />
          <input
            type="text"
            placeholder="Buscar por nome, fone, e-mail ou mensagem..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 py-1.5 pl-9 pr-3 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
          />
        </div>
      </div>

      {/* Tabela de Leads */}
      <div className="rounded-sm border border-areia/60 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-graphite">
            <thead>
              <tr className="border-b border-areia/40 bg-offwhite/50 text-graphite/60 uppercase tracking-wider text-[11px]">
                <th className="p-4 font-semibold">Cliente &amp; Contato</th>
                <th className="p-4 font-semibold">Mensagem / Interesse</th>
                <th className="p-4 font-semibold">Data / Hora</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ação Direta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-areia/30">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => {
                  const statusOpt =
                    statusOptions.find((s) => s.value === lead.status) || statusOptions[1];

                  return (
                    <tr key={lead.id} className="hover:bg-offwhite/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-graphite text-sm">{lead.name}</span>
                          <span
                            className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${typeBadge[lead.leadType]}`}
                          >
                            {typeLabel[lead.leadType]}
                          </span>
                        </div>
                        <div className="text-graphite/70 text-xs mt-0.5">{lead.email}</div>
                        <div className="font-mono text-graphite/50 text-[11px] mt-0.5">{lead.phone}</div>
                      </td>

                      <td className="p-4 max-w-xs">
                        {lead.message && (
                          <p className="text-graphite/80 line-clamp-2">{lead.message}</p>
                        )}
                        {lead.interest && (
                          <span className="text-[10px] uppercase tracking-wider text-graphite/50 bg-offwhite px-2 py-0.5 rounded-xs border border-areia/50 inline-block mt-1">
                            {INTEREST_LABELS[lead.interest] ?? lead.interest}
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-graphite/60 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-graphite/40" />
                          <span>{lead.createdAt}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <select
                          value={lead.status}
                          disabled={isPending}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatusDb)}
                          className={`focus-ring appearance-none cursor-pointer rounded-full px-3 py-1 text-[11px] font-semibold border disabled:opacity-50 ${statusOpt.color}`}
                        >
                          <option value="novo">Novo</option>
                          <option value="contatado">Contatado</option>
                          <option value="qualificado">Qualificado</option>
                          <option value="negociacao">Em Negociação</option>
                          <option value="convertido">Convertido</option>
                          <option value="perdido">Perdido</option>
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <a
                          href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Olá ${lead.name}, sou da MONARQ Imóveis. Recebi seu contato.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#25D366] text-white hover:brightness-105 transition-all font-semibold text-xs shadow-xs"
                        >
                          <MessageCircle className="h-3.5 w-3.5 fill-current" />
                          WhatsApp
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-graphite/50">
                    Nenhum lead encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
