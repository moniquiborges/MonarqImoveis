"use client";

import { useState } from "react";
import {
  Layers,
  Plus,
  Building2,
  CheckCircle2,
  Clock,
  Ban,
  Search,
  Filter,
  Trash2,
  Edit2,
  ExternalLink,
} from "lucide-react";
import { formatBRL } from "@/lib/utils";
import { CurrencyInput } from "@/components/admin/CurrencyInput";
import { mockDevelopments } from "@/lib/mock/developments";

interface Unit {
  id: string;
  developmentSlug: string;
  developmentName: string;
  unitNumber: string;
  tower: string;
  floor: number;
  area: number;
  bedrooms: number;
  suites: number;
  parking: number;
  price: number;
  status: "disponivel" | "reservado" | "vendido";
}

const initialUnits: Unit[] = [
  {
    id: "un-101",
    developmentSlug: "essenza-porto-belo",
    developmentName: "Essenza Porto Belo",
    unitNumber: "101",
    tower: "Torre A",
    floor: 1,
    area: 165,
    bedrooms: 3,
    suites: 3,
    parking: 2,
    price: 1890000,
    status: "disponivel",
  },
  {
    id: "un-102",
    developmentSlug: "essenza-porto-belo",
    developmentName: "Essenza Porto Belo",
    unitNumber: "102",
    tower: "Torre A",
    floor: 1,
    area: 198,
    bedrooms: 4,
    suites: 4,
    parking: 3,
    price: 2450000,
    status: "reservado",
  },
  {
    id: "un-1201",
    developmentSlug: "essenza-porto-belo",
    developmentName: "Essenza Porto Belo",
    unitNumber: "1201 (Cobertura)",
    tower: "Torre A",
    floor: 12,
    area: 280,
    bedrooms: 4,
    suites: 4,
    parking: 4,
    price: 3950000,
    status: "vendido",
  },
  {
    id: "un-201",
    developmentSlug: "vista-itapema",
    developmentName: "Vista Itapema",
    unitNumber: "201",
    tower: "Torre Sol",
    floor: 2,
    area: 142,
    bedrooms: 3,
    suites: 3,
    parking: 2,
    price: 1650000,
    status: "disponivel",
  },
  {
    id: "un-802",
    developmentSlug: "alto-camboriu-residence",
    developmentName: "Alto Camboriú Residence",
    unitNumber: "802",
    tower: "Torre Única",
    floor: 8,
    area: 215,
    bedrooms: 4,
    suites: 4,
    parking: 3,
    price: 3200000,
    status: "disponivel",
  },
];

export default function AdminUnidadesPage() {
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [selectedDev, setSelectedDev] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newUnit, setNewUnit] = useState({
    developmentSlug: mockDevelopments[0].slug,
    unitNumber: "",
    tower: "Torre A",
    floor: "1",
    area: "",
    bedrooms: "3",
    suites: "3",
    parking: "2",
    price: "",
    status: "disponivel" as "disponivel" | "reservado" | "vendido",
  });

  const filteredUnits = units.filter((u) => {
    if (selectedDev !== "all" && u.developmentSlug !== selectedDev) return false;
    if (selectedStatus !== "all" && u.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.unitNumber.toLowerCase().includes(q) ||
        u.developmentName.toLowerCase().includes(q) ||
        u.tower.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalVGV = filteredUnits.reduce((acc, u) => acc + u.price, 0);

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    const dev = mockDevelopments.find((d) => d.slug === newUnit.developmentSlug);
    const created: Unit = {
      id: `un-${Date.now()}`,
      developmentSlug: newUnit.developmentSlug,
      developmentName: dev?.name || "Empreendimento",
      unitNumber: newUnit.unitNumber,
      tower: newUnit.tower,
      floor: Number(newUnit.floor),
      area: Number(newUnit.area),
      bedrooms: Number(newUnit.bedrooms),
      suites: Number(newUnit.suites),
      parking: Number(newUnit.parking),
      price: Number(newUnit.price),
      status: newUnit.status,
    };
    setUnits([created, ...units]);
    setNewUnit({
      developmentSlug: mockDevelopments[0].slug,
      unitNumber: "",
      tower: "Torre A",
      floor: "1",
      area: "",
      bedrooms: "3",
      suites: "3",
      parking: "2",
      price: "",
      status: "disponivel",
    });
    setIsModalOpen(false);
  };

  const handleChangeStatus = (id: string, newStatus: "disponivel" | "reservado" | "vendido") => {
    setUnits(units.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
  };

  const handleDeleteUnit = (id: string) => {
    if (confirm("Deseja realmente remover esta unidade da espelho de vendas?")) {
      setUnits(units.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Topo da Página */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-terracota">
            Espelho de Vendas &amp; Estoque
          </span>
          <h1 className="font-display text-2xl md:text-3xl text-mineral">
            Gestão de Unidades
          </h1>
          <p className="text-xs md:text-sm text-graphite/70 mt-1">
            Controle de disponibilidade, metragens, valores e reservas por torre e andar.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xs bg-mineral px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Nova Unidade
        </button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-sm border border-areia/60 bg-white p-5 shadow-2xs">
          <span className="text-xs uppercase tracking-wider font-semibold text-graphite/60 block mb-1">
            Total de Unidades
          </span>
          <p className="font-display text-3xl font-semibold text-mineral">{filteredUnits.length}</p>
          <p className="text-[11px] text-graphite/50 mt-1">Cadastradas no sistema</p>
        </div>

        <div className="rounded-sm border border-areia/60 bg-white p-5 shadow-2xs">
          <span className="text-xs uppercase tracking-wider font-semibold text-graphite/60 block mb-1">
            Disponíveis
          </span>
          <p className="font-display text-3xl font-semibold text-emerald-600">
            {filteredUnits.filter((u) => u.status === "disponivel").length}
          </p>
          <p className="text-[11px] text-graphite/50 mt-1">Prontas para comercialização</p>
        </div>

        <div className="rounded-sm border border-areia/60 bg-white p-5 shadow-2xs">
          <span className="text-xs uppercase tracking-wider font-semibold text-graphite/60 block mb-1">
            Reservadas
          </span>
          <p className="font-display text-3xl font-semibold text-amber-600">
            {filteredUnits.filter((u) => u.status === "reservado").length}
          </p>
          <p className="text-[11px] text-graphite/50 mt-1">Em proposta ou análise</p>
        </div>

        <div className="rounded-sm border border-areia/60 bg-white p-5 shadow-2xs">
          <span className="text-xs uppercase tracking-wider font-semibold text-graphite/60 block mb-1">
            VGV Filtrado
          </span>
          <p className="font-display text-2xl font-semibold text-graphite">
            {formatBRL(totalVGV)}
          </p>
          <p className="text-[11px] text-graphite/50 mt-1">Valor Geral de Vendas</p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-sm border border-areia/60 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-graphite/40" />
          <input
            type="text"
            placeholder="Buscar por unidade, torre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 pl-9 pr-3 py-2 text-xs text-graphite placeholder:text-graphite/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDev}
            onChange={(e) => setSelectedDev(e.target.value)}
            className="focus-ring rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
          >
            <option value="all">Todos os Empreendimentos</option>
            {mockDevelopments.map((dev) => (
              <option key={dev.slug} value={dev.slug}>
                {dev.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="focus-ring rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
          >
            <option value="all">Todos os Status</option>
            <option value="disponivel">Disponíveis</option>
            <option value="reservado">Reservadas</option>
            <option value="vendido">Vendidas</option>
          </select>
        </div>
      </div>

      {/* Tabela de Unidades */}
      <div className="overflow-x-auto rounded-sm border border-areia/60 bg-white shadow-2xs">
        <table className="w-full text-left text-xs text-graphite">
          <thead className="border-b border-areia/60 bg-offwhite/60 text-[11px] font-semibold uppercase tracking-wider text-graphite/60">
            <tr>
              <th className="p-4">Empreendimento</th>
              <th className="p-4">Unidade / Torre</th>
              <th className="p-4">Tipologia</th>
              <th className="p-4">Área Privativa</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-areia/40">
            {filteredUnits.length > 0 ? (
              filteredUnits.map((u) => (
                <tr key={u.id} className="hover:bg-offwhite/40 transition-colors">
                  <td className="p-4">
                    <strong className="text-graphite font-semibold block">{u.developmentName}</strong>
                    <span className="text-[11px] text-graphite/50">{u.tower} · {u.floor}° Andar</span>
                  </td>

                  <td className="p-4 font-mono font-medium text-graphite">
                    {u.unitNumber}
                  </td>

                  <td className="p-4 text-graphite/80">
                    {u.bedrooms} dorms ({u.suites} suítes) · {u.parking} vagas
                  </td>

                  <td className="p-4 font-semibold text-graphite">
                    {u.area} m²
                  </td>

                  <td className="p-4 font-semibold text-mineral text-sm">
                    {formatBRL(u.price)}
                  </td>

                  <td className="p-4">
                    <select
                      value={u.status}
                      onChange={(e) =>
                        handleChangeStatus(
                          u.id,
                          e.target.value as "disponivel" | "reservado" | "vendido"
                        )
                      }
                      className={`focus-ring rounded-xs px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${
                        u.status === "disponivel"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : u.status === "reservado"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                    >
                      <option value="disponivel">Disponível</option>
                      <option value="reservado">Reservada</option>
                      <option value="vendido">Vendida</option>
                    </select>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteUnit(u.id)}
                      className="rounded-xs p-1.5 text-graphite/40 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Excluir unidade"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-graphite/50 text-xs">
                  Nenhuma unidade encontrada para os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Nova Unidade */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/60 backdrop-blur-xs p-4 animate-fade-in"
        >
          <div className="w-full max-w-lg rounded-sm border border-areia/60 bg-white p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-areia/40 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-mineral" />
                <h3 className="font-display text-lg font-medium text-graphite">
                  Cadastrar Nova Unidade
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

            <form onSubmit={handleCreateUnit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Empreendimento Vinculado *
                </label>
                <select
                  value={newUnit.developmentSlug}
                  onChange={(e) =>
                    setNewUnit({ ...newUnit, developmentSlug: e.target.value })
                  }
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite cursor-pointer"
                >
                  {mockDevelopments.map((dev) => (
                    <option key={dev.slug} value={dev.slug}>
                      {dev.name} ({dev.cityLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Número / Identificação *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 501, Cobertura 01"
                    value={newUnit.unitNumber}
                    onChange={(e) => setNewUnit({ ...newUnit, unitNumber: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Torre / Bloco
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Torre A"
                    value={newUnit.tower}
                    onChange={(e) => setNewUnit({ ...newUnit, tower: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Andar
                  </label>
                  <input
                    type="number"
                    value={newUnit.floor}
                    onChange={(e) => setNewUnit({ ...newUnit, floor: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Área Priv. (m²) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="150"
                    value={newUnit.area}
                    onChange={(e) => setNewUnit({ ...newUnit, area: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Dormitórios
                  </label>
                  <input
                    type="number"
                    value={newUnit.bedrooms}
                    onChange={(e) => setNewUnit({ ...newUnit, bedrooms: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Suítes
                  </label>
                  <input
                    type="number"
                    value={newUnit.suites}
                    onChange={(e) => setNewUnit({ ...newUnit, suites: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Vagas
                  </label>
                  <input
                    type="number"
                    value={newUnit.parking}
                    onChange={(e) => setNewUnit({ ...newUnit, parking: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <CurrencyInput
                    label="Valor da Unidade (R$)"
                    required
                    value={newUnit.price}
                    onChange={(numVal) => setNewUnit({ ...newUnit, price: String(numVal) })}
                    placeholder="Ex: 1.850.000 ou 1,8 milhão"
                    allowSobConsulta={false}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Status Inicial
                  </label>
                  <select
                    value={newUnit.status}
                    onChange={(e) =>
                      setNewUnit({
                        ...newUnit,
                        status: e.target.value as "disponivel" | "reservado" | "vendido",
                      })
                    }
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite cursor-pointer"
                  >
                    <option value="disponivel">Disponível</option>
                    <option value="reservado">Reservada</option>
                    <option value="vendido">Vendida</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-areia/40">
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
                  Salvar Unidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
