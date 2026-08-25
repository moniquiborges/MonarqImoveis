"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  X,
  Edit2,
  Trash2,
  ShieldCheck,
  Award,
} from "lucide-react";

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
    phone: "(67) 98213-3789",
    active: true,
    role: "Diretoria & Agronegócio",
  },
  {
    id: "ag-2",
    name: "Consultor Litoral SC",
    creci: "CRECI 45.678-F/SC",
    email: "sc@monarqimoveis.com.br",
    phone: "(47) 99976-1982",
    active: true,
    role: "Especialista Porto Belo & Itapema",
  },
  {
    id: "ag-3",
    name: "Consultor Campo Grande",
    creci: "CRECI 98.765-F/MS",
    email: "cg@monarqimoveis.com.br",
    phone: "(67) 98213-3789",
    active: true,
    role: "Alto Padrão Urbano",
  },
  {
    id: "ag-4",
    name: "Éder Toledo",
    creci: "CRECI 12.345-F/MS",
    email: "edertoledo@monarqimoveis.com.br",
    phone: "(67) 99999-9999",
    active: true,
    role: "Consultor Imobiliário",
  },
];

export default function AdminCorretoresPage() {
  const [agents, setAgents] = useState<AgentItem[]>(initialAgents);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
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
        a.email.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenCreate = () => {
    setEditingAgent(null);
    setFormData({
      name: "",
      creci: "",
      email: "",
      phone: "",
      role: "Consultor Imobiliário",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (ag: AgentItem) => {
    setEditingAgent(ag);
    setFormData({
      name: ag.name,
      creci: ag.creci,
      email: ag.email,
      phone: ag.phone,
      role: ag.role,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAgent) {
      // Atualizar existente
      setAgents(
        agents.map((a) =>
          a.id === editingAgent.id
            ? {
                ...a,
                name: formData.name,
                creci: formData.creci,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
              }
            : a
        )
      );
    } else {
      // Criar novo
      const created: AgentItem = {
        id: `ag-${Date.now()}`,
        name: formData.name,
        creci: formData.creci,
        email: formData.email,
        phone: formData.phone,
        active: true,
        role: formData.role,
      };
      setAgents([created, ...agents]);
    }
    setModalOpen(false);
  };

  const toggleActive = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o corretor/consultor "${name}"?`)) {
      setAgents((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold">
            Equipe Comercial
          </span>
          <h1 className="font-display text-2xl md:text-3xl text-mineral font-normal">
            Corretores &amp; Consultores
          </h1>
          <p className="text-xs md:text-sm text-graphite/60 mt-0.5">
            Cadastro e edição de corretores credenciados para vinculação aos imóveis e atendimento.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xs bg-mineral px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Novo Corretor
        </button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-areia/60 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-graphite/60 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Total de Profissionais</span>
            <Users className="h-4 w-4 text-mineral" />
          </div>
          <p className="font-display text-3xl font-semibold text-mineral">{agents.length}</p>
          <p className="text-[11px] text-graphite/50 mt-1">Corretores e consultores cadastrados</p>
        </div>

        <div className="rounded-sm border border-areia/60 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-graphite/60 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Ativos</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="font-display text-3xl font-semibold text-emerald-600">
            {agents.filter((a) => a.active).length}
          </p>
          <p className="text-[11px] text-graphite/50 mt-1">Disponíveis para vinculação e contato</p>
        </div>

        <div className="rounded-sm border border-areia/60 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-graphite/60 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Credenciamento</span>
            <Award className="h-4 w-4 text-terracota" />
          </div>
          <p className="font-display text-3xl font-semibold text-terracota">100%</p>
          <p className="text-[11px] text-graphite/50 mt-1">Com registro CRECI informado</p>
        </div>
      </div>

      {/* Busca */}
      <div className="flex items-center justify-between bg-white p-4 rounded-sm border border-areia/60 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-graphite/40" />
          <input
            type="text"
            placeholder="Buscar por nome, cargo, CRECI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 pl-9 pr-3 py-2 text-xs text-graphite placeholder:text-graphite/40"
          />
        </div>
      </div>

      {/* Tabela de Corretores */}
      <div className="rounded-sm border border-areia/60 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-graphite">
            <thead>
              <tr className="border-b border-areia/40 bg-offwhite/50 text-graphite/60 uppercase tracking-wider text-[11px]">
                <th className="p-4 font-semibold">Corretor / Nome</th>
                <th className="p-4 font-semibold">Registro CRECI</th>
                <th className="p-4 font-semibold">Especialidade / Cargo</th>
                <th className="p-4 font-semibold">Contato</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-areia/30">
              {filteredAgents.map((ag) => (
                <tr key={ag.id} className="hover:bg-offwhite/30 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-graphite text-sm">{ag.name}</div>
                  </td>
                  <td className="p-4 font-mono text-graphite/70">{ag.creci}</td>
                  <td className="p-4 text-mineral font-medium">
                    <span className="rounded-xs bg-mineral/10 px-2.5 py-1 text-[11px] font-semibold text-mineral">
                      {ag.role}
                    </span>
                  </td>
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
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(ag)}
                        className="focus-ring inline-flex items-center gap-1 rounded-xs border border-areia/70 bg-offwhite/50 px-2.5 py-1 text-[11px] font-medium text-graphite hover:bg-offwhite hover:text-mineral transition-colors cursor-pointer"
                        title="Editar cargo e dados do corretor"
                      >
                        <Edit2 className="h-3 w-3" />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleActive(ag.id)}
                        className="rounded-xs border border-areia/70 bg-offwhite/50 px-2.5 py-1 text-[11px] font-medium text-graphite hover:bg-offwhite transition-colors cursor-pointer"
                        title={ag.active ? "Desativar" : "Ativar"}
                      >
                        {ag.active ? "Desativar" : "Ativar"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(ag.id, ag.name)}
                        className="rounded-xs p-1.5 text-graphite/40 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Excluir corretor"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar / Editar Corretor */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/60 backdrop-blur-xs p-4 animate-fade-in"
        >
          <div className="relative w-full max-w-md rounded-sm bg-white p-6 md:p-8 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-areia/40 pb-4">
              <div>
                <h3 className="font-display text-xl text-graphite font-medium">
                  {editingAgent ? "Editar Corretor / Cargo" : "Novo Corretor"}
                </h3>
                <p className="text-xs text-graphite/60">
                  {editingAgent
                    ? "Atualize o cargo, especialidade e dados de contato."
                    : "Cadastre um novo profissional da equipe comercial."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1 text-graphite/50 hover:bg-offwhite hover:text-graphite transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Juliana Vasconcelos"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Cargo / Especialidade / Foco *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Consultor Imobiliário, Especialista Litoral SC, Agronegócio..."
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                  placeholder="Ex: CRECI 12.345-F/MS"
                  value={formData.creci}
                  onChange={(e) => setFormData({ ...formData, creci: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="(67) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="email@monarqimoveis.com.br"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-areia/40">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xs border border-areia/60 px-4 py-2 text-xs font-medium text-graphite hover:bg-offwhite transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xs bg-mineral px-5 py-2 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs"
                >
                  {editingAgent ? "Salvar Alterações" : "Cadastrar Corretor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
