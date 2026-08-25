"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LandPlot,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  X,
  Sprout,
} from "lucide-react";
import { mockRuralProperties } from "@/lib/mock/rural";
import { ruralActivityLabels } from "@/lib/labels";
import { formatBRL } from "@/lib/utils";
import type { RuralProperty, RuralActivity } from "@/types";

export default function AdminRuralPage() {
  const [items, setItems] = useState<RuralProperty[]>(mockRuralProperties);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [newRural, setNewRural] = useState({
    title: "",
    state: "MS" as "MS" | "MT",
    municipality: "Ribas do Rio Pardo",
    totalHectares: "1500",
    activity: "pecuaria" as RuralActivity,
    price: "",
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchMun = item.municipality.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        if (!matchTitle && !matchMun && !matchCode) return false;
      }
      return true;
    });
  }, [items, searchQuery]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newRural.title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");

    const ha = Number(newRural.totalHectares) || 1000;
    const price = Number(newRural.price) || 15000000;

    const created: RuralProperty = {
      slug,
      code: `MRQ-R${200 + items.length + 1}`,
      title: newRural.title,
      state: newRural.state,
      municipality: newRural.municipality,
      totalHectares: ha,
      activity: [newRural.activity],
      price,
      pricePerHectare: Math.round(price / ha),
      badges: ["oportunidade"],
      coverImage: {
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
        alt: newRural.title,
      },
      gallery: [],
    };

    setItems([created, ...items]);
    setModalOpen(false);
    setNewRural({
      title: "",
      state: "MS",
      municipality: "Ribas do Rio Pardo",
      totalHectares: "1500",
      activity: "pecuaria",
      price: "",
    });
  };

  const handleDelete = (slug: string) => {
    if (confirm("Tem certeza que deseja remover esta propriedade rural?")) {
      setItems((prev) => prev.filter((i) => i.slug !== slug));
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold">
            Agronegócio Centro-Oeste
          </span>
          <h1 className="font-display text-2xl md:text-3xl text-graphite font-normal">
            Propriedades Rurais
          </h1>
          <p className="text-xs md:text-sm text-graphite/60 mt-0.5">
            Gestão de fazendas para agricultura, pecuária e investimentos em MS e MT.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xs bg-mineral px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Nova Propriedade Rural
        </button>
      </div>

      {/* Busca */}
      <div className="rounded-sm border border-areia/60 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-graphite/40" />
          <input
            type="text"
            placeholder="Buscar por nome da fazenda, município ou código (ex: MRQ-R201)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 py-1.5 pl-9 pr-3 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
          />
        </div>

        <div className="text-xs text-graphite/60 font-medium">
          Total: {filteredItems.length} fazendas catalogadas
        </div>
      </div>

      {/* Tabela de Propriedades Rurais */}
      <div className="rounded-sm border border-areia/60 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-graphite">
            <thead>
              <tr className="border-b border-areia/40 bg-offwhite/50 text-graphite/60 uppercase tracking-wider text-[11px]">
                <th className="p-4 font-semibold">Fazenda &amp; Código</th>
                <th className="p-4 font-semibold">Município / Estado</th>
                <th className="p-4 font-semibold">Área Total</th>
                <th className="p-4 font-semibold">Aptidão</th>
                <th className="p-4 font-semibold">Valor Total &amp; /ha</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-areia/30">
              {filteredItems.map((item) => (
                <tr key={item.slug} className="hover:bg-offwhite/30 transition-colors">
                  {/* Foto e Nome */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded-xs bg-areia/40 shrink-0">
                        <Image
                          src={item.coverImage.url}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-graphite text-sm">{item.title}</div>
                        <span className="font-mono text-[11px] text-graphite/50">{item.code}</span>
                      </div>
                    </div>
                  </td>

                  {/* Município / Estado */}
                  <td className="p-4">
                    <div className="font-medium text-graphite">{item.municipality}</div>
                    <div className="text-graphite/50 text-[11px] font-semibold">{item.state}</div>
                  </td>

                  {/* Área */}
                  <td className="p-4">
                    <strong className="text-graphite font-semibold">
                      {item.totalHectares.toLocaleString("pt-BR")} ha
                    </strong>
                    <div className="text-[11px] text-graphite/50">
                      ~{(item.totalHectares / 2.42).toFixed(0)} alqueires
                    </div>
                  </td>

                  {/* Aptidão */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {item.activity.map((act) => (
                        <span
                          key={act}
                          className="rounded-xs bg-mineral/10 px-2 py-0.5 text-[10px] font-semibold text-mineral"
                        >
                          {ruralActivityLabels[act]}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Preço */}
                  <td className="p-4">
                    <div className="font-semibold text-mineral text-sm">
                      {item.price ? formatBRL(item.price) : "Sob Consulta"}
                    </div>
                    {item.pricePerHectare && (
                      <div className="text-[11px] text-graphite/50">
                        {formatBRL(item.pricePerHectare)} / ha
                      </div>
                    )}
                  </td>

                  {/* Ações */}
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/rural/${item.slug}`}
                        target="_blank"
                        title="Ver no site público"
                        className="rounded-xs p-1.5 text-graphite/60 hover:bg-areia/40 hover:text-mineral transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.slug)}
                        title="Remover"
                        className="rounded-xs p-1.5 text-graphite/60 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nova Propriedade Rural */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/60 backdrop-blur-xs p-4 animate-fade-in"
        >
          <div className="relative w-full max-w-xl rounded-sm bg-white p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-areia/40 pb-4 mb-6">
              <div>
                <h3 className="font-display text-xl text-graphite font-medium">
                  Nova Propriedade Rural
                </h3>
                <p className="text-xs text-graphite/60">Cadastre uma fazenda ou área para agronegócio.</p>
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
                  Nome da Fazenda / Propriedade *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fazenda Santa Helena"
                  value={newRural.title}
                  onChange={(e) => setNewRural({ ...newRural, title: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Estado *
                  </label>
                  <select
                    value={newRural.state}
                    onChange={(e) => setNewRural({ ...newRural, state: e.target.value as "MS" | "MT" })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  >
                    <option value="MS">Mato Grosso do Sul (MS)</option>
                    <option value="MT">Mato Grosso (MT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Município *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ribas do Rio Pardo, Rondonópolis..."
                    value={newRural.municipality}
                    onChange={(e) => setNewRural({ ...newRural, municipality: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Área Total (Hectares) *</label>
                  <input
                    type="number"
                    required
                    value={newRural.totalHectares}
                    onChange={(e) => setNewRural({ ...newRural, totalHectares: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Aptidão Principal</label>
                  <select
                    value={newRural.activity}
                    onChange={(e) =>
                      setNewRural({ ...newRural, activity: e.target.value as RuralActivity })
                    }
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  >
                    <option value="pecuaria">Pecuária</option>
                    <option value="agricultura">Agricultura / Soja</option>
                    <option value="investimento">Investimento / Eucalipto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Valor Total (R$) *</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 22000000"
                    value={newRural.price}
                    onChange={(e) => setNewRural({ ...newRural, price: e.target.value })}
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
                  Salvar Propriedade Rural
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
