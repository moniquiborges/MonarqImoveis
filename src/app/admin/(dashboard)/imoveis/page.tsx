"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  X,
  BedDouble,
  Bath,
  Car,
  Ruler,
} from "lucide-react";
import { mockUrbanProperties } from "@/lib/mock/properties";
import { formatBRL, formatArea } from "@/lib/utils";
import type { UrbanProperty } from "@/types";

export default function AdminImoveisPage() {
  const [items, setItems] = useState<UrbanProperty[]>(mockUrbanProperties);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [newProp, setNewProp] = useState({
    title: "",
    type: "Apartamento",
    neighborhood: "Jardim dos Estados",
    price: "",
    bedrooms: "3",
    suites: "2",
    parking: "2",
    area: "140",
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchNeigh = item.neighborhood.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        if (!matchTitle && !matchNeigh && !matchCode) return false;
      }
      return true;
    });
  }, [items, searchQuery]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newProp.title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");

    const created: UrbanProperty = {
      slug,
      code: `MRQ-U${100 + items.length + 1}`,
      title: newProp.title,
      type: newProp.type,
      neighborhood: newProp.neighborhood,
      city: "Campo Grande",
      price: Number(newProp.price) || 850000,
      bedrooms: Number(newProp.bedrooms) || 3,
      suites: Number(newProp.suites) || 2,
      parking: Number(newProp.parking) || 2,
      area: Number(newProp.area) || 120,
      badges: ["novo", "alto-padrao"],
      coverImage: {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        alt: newProp.title,
      },
      gallery: [],
    };

    setItems([created, ...items]);
    setModalOpen(false);
    setNewProp({
      title: "",
      type: "Apartamento",
      neighborhood: "Jardim dos Estados",
      price: "",
      bedrooms: "3",
      suites: "2",
      parking: "2",
      area: "140",
    });
  };

  const handleDelete = (slug: string) => {
    if (confirm("Tem certeza que deseja remover este imóvel?")) {
      setItems((prev) => prev.filter((i) => i.slug !== slug));
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold">
            Campo Grande / MS
          </span>
          <h1 className="font-display text-2xl md:text-3xl text-graphite font-normal">
            Imóveis Urbanos
          </h1>
          <p className="text-xs md:text-sm text-graphite/60 mt-0.5">
            Gestão de apartamentos, casas em condomínio e coberturas em Campo Grande.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xs bg-mineral px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Novo Imóvel Urbano
        </button>
      </div>

      {/* Busca */}
      <div className="rounded-sm border border-areia/60 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-graphite/40" />
          <input
            type="text"
            placeholder="Buscar por título, bairro ou código (ex: MRQ-U101)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 py-1.5 pl-9 pr-3 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
          />
        </div>

        <div className="text-xs text-graphite/60 font-medium">
          Total: {filteredItems.length} imóveis cadastrados
        </div>
      </div>

      {/* Tabela de Imóveis Urbanos */}
      <div className="rounded-sm border border-areia/60 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-graphite">
            <thead>
              <tr className="border-b border-areia/40 bg-offwhite/50 text-graphite/60 uppercase tracking-wider text-[11px]">
                <th className="p-4 font-semibold">Imóvel &amp; Código</th>
                <th className="p-4 font-semibold">Tipo &amp; Bairro</th>
                <th className="p-4 font-semibold">Configuração</th>
                <th className="p-4 font-semibold">Valor de Venda</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-areia/30">
              {filteredItems.map((item) => (
                <tr key={item.slug} className="hover:bg-offwhite/30 transition-colors">
                  {/* Foto e Título */}
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

                  {/* Tipo e Bairro */}
                  <td className="p-4">
                    <div className="font-medium text-graphite">{item.type}</div>
                    <div className="text-graphite/50 text-[11px]">{item.neighborhood}</div>
                  </td>

                  {/* Quartos / Área */}
                  <td className="p-4 text-graphite/70">
                    <div>{item.bedrooms} dorms ({item.suites} suítes) &bull; {item.parking} vagas</div>
                    <div className="text-[11px] text-graphite/50">{formatArea(item.area)}</div>
                  </td>

                  {/* Valor */}
                  <td className="p-4 font-medium text-mineral text-sm">
                    {item.price ? formatBRL(item.price) : "Sob Consulta"}
                  </td>

                  {/* Ações */}
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/imoveis/campo-grande/${item.slug}`}
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

      {/* Modal de Novo Imóvel */}
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
                  Novo Imóvel Urbano (Campo Grande)
                </h3>
                <p className="text-xs text-graphite/60">Cadastre um imóvel residencial ou comercial.</p>
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
                  Título do Anúncio *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cobertura duplex com vista panorâmica"
                  value={newProp.title}
                  onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Tipo de Imóvel *
                  </label>
                  <select
                    value={newProp.type}
                    onChange={(e) => setNewProp({ ...newProp, type: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  >
                    <option value="Apartamento">Apartamento</option>
                    <option value="Cobertura">Cobertura</option>
                    <option value="Casa em condomínio">Casa em condomínio</option>
                    <option value="Casa">Casa</option>
                    <option value="Terreno">Terreno</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Bairro em Campo Grande *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Jardim dos Estados, Alphaville, Carandá..."
                    value={newProp.neighborhood}
                    onChange={(e) => setNewProp({ ...newProp, neighborhood: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Dormitórios</label>
                  <input
                    type="number"
                    value={newProp.bedrooms}
                    onChange={(e) => setNewProp({ ...newProp, bedrooms: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Suítes</label>
                  <input
                    type="number"
                    value={newProp.suites}
                    onChange={(e) => setNewProp({ ...newProp, suites: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Vagas</label>
                  <input
                    type="number"
                    value={newProp.parking}
                    onChange={(e) => setNewProp({ ...newProp, parking: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Área (m²)</label>
                  <input
                    type="number"
                    value={newProp.area}
                    onChange={(e) => setNewProp({ ...newProp, area: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Valor de Venda (R$) *
                </label>
                <input
                  type="number"
                  placeholder="Ex: 1250000"
                  value={newProp.price}
                  onChange={(e) => setNewProp({ ...newProp, price: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
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
                  Salvar Imóvel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
