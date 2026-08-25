"use client";

import { useState } from "react";
import { Users, Plus, Search, Mail, Phone, CheckCircle2, XCircle, X } from "lucide-react";

interface AgentItem {
  id: string;
  name: string;
  creci: string;
  email: string;
  phone: string;
  active: boolean;
  role: string;
}

const initialAgents: AgentItem[] = [
  {
    id: "ag-1",
    name: "Arino — Diretor Comercial",
    creci: "CRECI 12.345-F/MS",
    email: "arino@monarqimoveis.com.br",
    phone: "(67) 99999-8888",
    active: true,
    role: "Diretoria & Agronegócio",
  },
  {
    id: "ag-2",
    name: "Consultor Litoral SC",
    creci: "CRECI 45.678-F/SC",
    email: "sc@monarqimoveis.com.br",
    phone: "(47) 98888-7777",
    active: true,
    role: "Especialista Porto Belo & Itapema",
  },
  {
    id: "ag-3",
    name: "Consultor Campo Grande",
    creci: "CRECI 98.765-F/MS",
    email: "cg@monarqimoveis.com.br",
    phone: "(67) 97777-6666",
    active: true,
    role: "Alto Padrão Urbano",
  },
];

export default function AdminCorretoresPage() {
  const [agents, setAgents] = useState<AgentItem[]>(initialAgents);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [newAgent, setNewAgent] = useState({
    name: "",
    creci: "",
    email: "",
    phone: "",
    role: "Consultor Imobiliário",
  });

  const filteredAgents = agents.filter((a) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.creci.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AgentItem = {
      id: `ag-${agents.length + 1}`,
      name: newAgent.name,
      creci: newAgent.creci,
      email: newAgent.email,
      phone: newAgent.phone,
      active: true,
      role: newAgent.role,
    };
    setAgents([...agents, created]);
    setModalOpen(false);
    setNewAgent({
      name: "",
      creci: "",
      email: "",
      phone: "",
      role: "Consultor Imobiliário",
    });
  };

  const toggleActive = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold">
            Equipe Comercial
          </span>
          <h1 className="font-display text-2xl md:text-3xl text-graphite font-normal">
            Corretores &amp; Consultores
          </h1>
          <p className="text-xs md:text-sm text-graphite/60 mt-0.5">
            Cadastro de corretores credenciados para vinculação aos imóveis e atendimento.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xs bg-mineral px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Novo Corretor
        </button>
      </div>

      {/* Tabela de Corretores */}
      <div className="rounded-sm border border-areia/60 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-graphite">
            <thead>
              <tr className="border-b border-areia/40 bg-offwhite/50 text-graphite/60 uppercase tracking-wider text-[11px]">
                <th className="p-4 font-semibold">Corretor / Nome</th>
                <th className="p-4 font-semibold">Registro CRECI</th>
                <th className="p-4 font-semibold">Especialidade / Foco</th>
                <th className="p-4 font-semibold">Contato</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-areia/30">
              {filteredAgents.map((ag) => (
                <tr key={ag.id} className="hover:bg-offwhite/30 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-graphite text-sm">{ag.name}</div>
                  </td>
                  <td className="p-4 font-mono text-graphite/70">{ag.creci}</td>
                  <td className="p-4 text-mineral font-medium">{ag.role}</td>
                  <td className="p-4 text-graphite/70">
                    <div>{ag.email}</div>
                    <div className="font-mono text-[11px] text-graphite/50">{ag.phone}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        ag.active
                          ? "bg-emerald-500/15 text-emerald-700"
                          : "bg-rose-500/15 text-rose-700"
                      }`}
                    >
                      {ag.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleActive(ag.id)}
                      className="text-xs text-graphite/60 hover:text-mineral underline cursor-pointer"
                    >
                      {ag.active ? "Desativar" : "Ativar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/60 backdrop-blur-xs p-4 animate-fade-in"
        >
          <div className="relative w-full max-w-md rounded-sm bg-white p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-areia/40 pb-4 mb-6">
              <div>
                <h3 className="font-display text-xl text-graphite font-medium">Novo Corretor</h3>
                <p className="text-xs text-graphite/60">Cadastre um profissional da equipe.</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1 text-graphite/50 hover:bg-offwhite hover:text-graphite transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Juliana Vasconcelos"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  CRECI (com Estado) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: CRECI 34.567-F/SC"
                  value={newAgent.creci}
                  onChange={(e) => setNewAgent({ ...newAgent, creci: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Especialidade / Região
                </label>
                <input
                  type="text"
                  placeholder="Ex: Litoral SC ou Fazendas MS"
                  value={newAgent.role}
                  onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Telefone</label>
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={newAgent.phone}
                    onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="email@monarq.com.br"
                    value={newAgent.email}
                    onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-areia/40">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xs border border-areia/60 px-4 py-2 text-xs font-medium text-graphite hover:bg-offwhite transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xs bg-mineral px-5 py-2 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors"
                >
                  Salvar Corretor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
