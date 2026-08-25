"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  KeyRound,
  Mail,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Edit2,
  Search,
  Filter,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  createdAt: string;
}

const initialUsers: AdminUser[] = [
  {
    id: "usr-1",
    name: "Administrador MONARQ",
    email: "admin@monarqimoveis.com.br",
    role: "admin",
    status: "active",
    lastLogin: "Hoje às 23:25",
    createdAt: "2026-08-20",
  },
  {
    id: "usr-2",
    name: "Moniqui Borges",
    email: "moniqui@monarqimoveis.com.br",
    role: "admin",
    status: "active",
    lastLogin: "Hoje às 22:40",
    createdAt: "2026-08-20",
  },
  {
    id: "usr-3",
    name: "Consultor Comercial Agro",
    email: "agro@monarqimoveis.com.br",
    role: "editor",
    status: "active",
    lastLogin: "Ontem às 16:15",
    createdAt: "2026-08-22",
  },
  {
    id: "usr-4",
    name: "Atendimento Litoral SC",
    email: "litoral@monarqimoveis.com.br",
    role: "editor",
    status: "pending",
    lastLogin: "Nunca acessou",
    createdAt: "2026-08-24",
  },
];

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "editor" as "admin" | "editor",
    password: "",
  });

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AdminUser = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "active",
      lastLogin: "Recém criado",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers([created, ...users]);
    setNewUser({ name: "", email: "", role: "editor", password: "" });
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          return {
            ...u,
            status: u.status === "active" ? "inactive" : "active",
          };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Tem certeza que deseja remover este usuário administrativo?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-terracota">
            Segurança &amp; Acesso
          </span>
          <h1 className="font-display text-2xl md:text-3xl text-mineral">
            Gestão de Usuários
          </h1>
          <p className="text-xs md:text-sm text-graphite/70 mt-1">
            Controle quem tem acesso ao painel de controle e defina permissões de Administrador ou Editor.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xs bg-mineral px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors shadow-xs cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          Novo Usuário
        </button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-areia/60 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-graphite/60 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Total de Usuários</span>
            <Users className="h-4 w-4 text-mineral" />
          </div>
          <p className="font-display text-3xl font-semibold text-mineral">{users.length}</p>
          <p className="text-[11px] text-graphite/50 mt-1">Equipe administrativa</p>
        </div>

        <div className="rounded-sm border border-areia/60 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-graphite/60 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Administradores</span>
            <ShieldCheck className="h-4 w-4 text-mineral" />
          </div>
          <p className="font-display text-3xl font-semibold text-graphite">
            {users.filter((u) => u.role === "admin").length}
          </p>
          <p className="text-[11px] text-graphite/50 mt-1">Acesso irrestrito a configurações</p>
        </div>

        <div className="rounded-sm border border-areia/60 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-graphite/60 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Editores &amp; Corretores</span>
            <KeyRound className="h-4 w-4 text-terracota" />
          </div>
          <p className="font-display text-3xl font-semibold text-terracota">
            {users.filter((u) => u.role === "editor").length}
          </p>
          <p className="text-[11px] text-graphite/50 mt-1">Gestão de imóveis, leads e blog</p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-sm border border-areia/60 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-graphite/40" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 pl-9 pr-3 py-2 text-xs text-graphite placeholder:text-graphite/40"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-3.5 w-3.5 text-graphite/50" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="focus-ring rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
          >
            <option value="all">Todos os Cargos</option>
            <option value="admin">Apenas Administradores</option>
            <option value="editor">Apenas Editores</option>
          </select>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="overflow-x-auto rounded-sm border border-areia/60 bg-white shadow-2xs">
        <table className="w-full text-left text-xs text-graphite">
          <thead className="border-b border-areia/60 bg-offwhite/60 text-[11px] font-semibold uppercase tracking-wider text-graphite/60">
            <tr>
              <th className="p-4">Usuário</th>
              <th className="p-4">Papel / Acesso</th>
              <th className="p-4">Status</th>
              <th className="p-4">Último Acesso</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-areia/40">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => {
                const initials = u.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <tr key={u.id} className="hover:bg-offwhite/40 transition-colors">
                    {/* Nome e E-mail */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mineral text-xs font-bold text-offwhite shadow-xs">
                          {initials}
                        </div>
                        <div>
                          <strong className="text-graphite font-semibold block">{u.name}</strong>
                          <span className="text-[11px] text-graphite/60 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Papel */}
                    <td className="p-4">
                      {u.role === "admin" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-xs bg-mineral/10 px-2.5 py-1 text-[11px] font-semibold text-mineral">
                          <Shield className="h-3 w-3" />
                          Administrador
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-xs bg-terracota/10 px-2.5 py-1 text-[11px] font-semibold text-terracota">
                          <KeyRound className="h-3 w-3" />
                          Editor / Corretor
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {u.status === "active" && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Ativo
                        </span>
                      )}
                      {u.status === "inactive" && (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                          <XCircle className="h-3.5 w-3.5" />
                          Inativo
                        </span>
                      )}
                      {u.status === "pending" && (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          Convite Pendente
                        </span>
                      )}
                    </td>

                    {/* Último Acesso */}
                    <td className="p-4 text-graphite/60 text-[11px]">{u.lastLogin}</td>

                    {/* Ações */}
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u.id)}
                          className="rounded-xs border border-areia/70 bg-offwhite/50 px-2.5 py-1 text-[11px] font-medium text-graphite hover:bg-offwhite transition-colors cursor-pointer"
                          title={u.status === "active" ? "Desativar acesso" : "Ativar acesso"}
                        >
                          {u.status === "active" ? "Desativar" : "Ativar"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id)}
                          className="rounded-xs p-1.5 text-graphite/40 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Excluir usuário"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-graphite/50 text-xs">
                  Nenhum usuário encontrado com os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Novo Usuário */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/60 backdrop-blur-xs p-4 animate-fade-in"
        >
          <div className="w-full max-w-md rounded-sm border border-areia/60 bg-white p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-areia/40 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-mineral" />
                <h3 className="font-display text-lg font-medium text-graphite">
                  Convidar Novo Usuário
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-graphite/40 hover:text-graphite text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  E-mail de Acesso *
                </label>
                <input
                  type="email"
                  required
                  placeholder="usuario@monarqimoveis.com.br"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Nível de Permissão *
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value as "admin" | "editor" })
                  }
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite cursor-pointer"
                >
                  <option value="editor">Editor (Imóveis, Leads e Blog)</option>
                  <option value="admin">Administrador (Acesso Total + Configurações)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Senha Provisória *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-areia/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xs border border-areia/70 px-4 py-2 text-xs font-medium text-graphite hover:bg-offwhite cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xs bg-mineral px-4 py-2 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light cursor-pointer shadow-xs"
                >
                  Cadastrar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
