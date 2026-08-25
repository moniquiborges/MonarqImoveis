"use client";

import { useState, useMemo } from "react";
import {
  Contact,
  Search,
  MessageCircle,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  UserCheck,
  Building,
} from "lucide-react";

interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  interest: string;
  property: string;
  status: "novo" | "contatado" | "qualificado" | "negociacao" | "convertido" | "perdido";
  createdAt: string;
  notes?: string;
}

const initialLeads: LeadItem[] = [
  {
    id: "lead-1",
    name: "Dr. Marcelo Arantes",
    phone: "(67) 99988-7766",
    email: "marcelo.arantes@agroinvest.com.br",
    interest: "rural",
    property: "Fazenda Boa Vista (1.240 ha)",
    status: "novo",
    createdAt: "24/02/2026 14:32",
    notes: "Interessado em área para pecuária e plantio de soja.",
  },
  {
    id: "lead-2",
    name: "Dra. Juliana Vasconcelos",
    phone: "(47) 98877-6655",
    email: "juliana.vasc@medicina.com.br",
    interest: "porto-belo",
    property: "Essenza Residence",
    status: "qualificado",
    createdAt: "23/02/2026 18:10",
    notes: "Busca apartamento de 3 suítes frente-mar em Porto Belo para investimento de temporada.",
  },
  {
    id: "lead-3",
    name: "Rodrigo Mendonça",
    phone: "(67) 98112-2334",
    email: "rodrigo.mendonca@adv.com.br",
    interest: "campo-grande",
    property: "Cobertura Jardim dos Estados",
    status: "contatado",
    createdAt: "22/02/2026 09:45",
    notes: "Visita agendada para sexta-feira às 15h.",
  },
  {
    id: "lead-4",
    name: "Camila Guimarães",
    phone: "(47) 99123-4567",
    email: "camila.guimaraes@tech.com.br",
    interest: "balneario-camboriu",
    property: "Alto Camboriú Residence",
    status: "negociacao",
    createdAt: "20/02/2026 11:20",
    notes: "Analisando proposta de pagamento direto com a construtora.",
  },
  {
    id: "lead-5",
    name: "Eduardo Silveira",
    phone: "(65) 99234-5678",
    email: "eduardo@silveiraagro.com.br",
    interest: "rural",
    property: "Fazenda Santa Luzia (2.860 ha)",
    status: "qualificado",
    createdAt: "19/02/2026 16:50",
    notes: "Solicitou o arquivo do CAR e relatório de análise de solo.",
  },
];

const statusOptions: { value: string; label: string; color: string }[] = [
  { value: "all", label: "Todos os Leads", color: "" },
  { value: "novo", label: "Novo", color: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" },
  { value: "contatado", label: "Contatado", color: "bg-blue-500/15 text-blue-700 border-blue-500/30" },
  { value: "qualificado", label: "Qualificado", color: "bg-purple-500/15 text-purple-700 border-purple-500/30" },
  { value: "negociacao", label: "Em Negociação", color: "bg-amber-500/15 text-amber-700 border-amber-500/30" },
  { value: "convertido", label: "Convertido", color: "bg-teal-500/15 text-teal-700 border-teal-500/30" },
  { value: "perdido", label: "Perdido", color: "bg-rose-500/15 text-rose-700 border-rose-500/30" },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleStatusChange = (id: string, newStatus: LeadItem["status"]) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
    );
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (selectedStatus !== "all" && lead.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = lead.name.toLowerCase().includes(q);
        const matchPhone = lead.phone.includes(q);
        const matchEmail = lead.email.toLowerCase().includes(q);
        const matchProp = lead.property.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchEmail && !matchProp) return false;
      }
      return true;
    });
  }, [leads, selectedStatus, searchQuery]);

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
            {leads.filter((l) => l.status === "novo").length} novos leads
          </div>
          <div className="rounded-xs bg-white border border-areia/60 px-3 py-1.5 text-graphite font-medium">
            Total: {leads.length} leads
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="rounded-sm border border-areia/60 bg-white p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Abas de Status */}
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

        {/* Input de Busca */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-graphite/40" />
          <input
            type="text"
            placeholder="Buscar por nome, fone, e-mail ou imóvel..."
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
                <th className="p-4 font-semibold">Imóvel / Interesse</th>
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
                      {/* Cliente */}
                      <td className="p-4">
                        <div className="font-semibold text-graphite text-sm">{lead.name}</div>
                        <div className="text-graphite/70 text-xs mt-0.5">{lead.email}</div>
                        <div className="font-mono text-graphite/50 text-[11px] mt-0.5">{lead.phone}</div>
                        {lead.notes && (
                          <p className="mt-2 text-[11px] text-graphite/60 italic bg-areia/20 p-1.5 rounded-xs border border-areia/40 max-w-xs">
                            &ldquo;{lead.notes}&rdquo;
                          </p>
                        )}
                      </td>

                      {/* Imóvel */}
                      <td className="p-4 max-w-xs">
                        <div className="font-medium text-mineral">{lead.property}</div>
                        <span className="text-[10px] uppercase tracking-wider text-graphite/50 bg-offwhite px-2 py-0.5 rounded-xs border border-areia/50 inline-block mt-1">
                          {lead.interest}
                        </span>
                      </td>

                      {/* Data */}
                      <td className="p-4 text-graphite/60 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-graphite/40" />
                          <span>{lead.createdAt}</span>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-4">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(lead.id, e.target.value as LeadItem["status"])
                          }
                          className={`focus-ring appearance-none cursor-pointer rounded-full px-3 py-1 text-[11px] font-semibold border ${statusOpt.color}`}
                        >
                          <option value="novo">Novo</option>
                          <option value="contatado">Contatado</option>
                          <option value="qualificado">Qualificado</option>
                          <option value="negociacao">Em Negociação</option>
                          <option value="convertido">Convertido</option>
                          <option value="perdido">Perdido</option>
                        </select>
                      </td>

                      {/* Ações */}
                      <td className="p-4 text-right">
                        <a
                          href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}?text=Olá ${encodeURIComponent(
                            lead.name
                          )}, sou da MONARQ Imóveis. Recebi seu interesse no imóvel ${encodeURIComponent(
                            lead.property
                          )}.`}
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
