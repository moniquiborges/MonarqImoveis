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
  Edit2,
  X,
  BedDouble,
  Bath,
  Car,
  Ruler,
  CheckCircle2,
} from "lucide-react";
import { mockUrbanProperties } from "@/lib/mock/properties";
import { mockImages } from "@/lib/mock/images";
import { formatBRL, formatArea } from "@/lib/utils";
import { CurrencyInput } from "@/components/admin/CurrencyInput";
import { ImageUpload, ImageData } from "@/components/admin/ImageUpload";
import type { UrbanProperty } from "@/types";

export default function AdminImoveisPage() {
  const [items, setItems] = useState<UrbanProperty[]>(mockUrbanProperties);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    type: string;
    neighborhood: string;
    price: number | null;
    bedrooms: number;
    suites: number;
    parking: number;
    area: number;
    coverImage: ImageData;
    gallery: ImageData[];
  }>({
    title: "",
    type: "Apartamento",
    neighborhood: "Jardim dos Estados",
    price: 1250000,
    bedrooms: 3,
    suites: 2,
    parking: 2,
    area: 140,
    coverImage: {
      url: mockImages.livingRoom1,
      alt: "Living de Alto Padrão",
    },
    gallery: [],
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

  const handleOpenCreate = () => {
    setEditingSlug(null);
    setFormData({
      title: "",
      type: "Apartamento",
      neighborhood: "Jardim dos Estados",
      price: 1250000,
      bedrooms: 3,
      suites: 2,
      parking: 2,
      area: 140,
      coverImage: {
        url: mockImages.livingRoom1,
        alt: "Foto de Capa",
      },
      gallery: [],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prop: UrbanProperty) => {
    setEditingSlug(prop.slug);
    setFormData({
      title: prop.title,
      type: prop.type,
      neighborhood: prop.neighborhood,
      price: prop.price,
      bedrooms: prop.bedrooms,
      suites: prop.suites,
      parking: prop.parking,
      area: prop.area,
      coverImage: prop.coverImage || { url: mockImages.livingRoom1, alt: prop.title },
      gallery: prop.gallery || [],
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSlug) {
      // Edição
      setItems((prev) =>
        prev.map((item) => {
          if (item.slug === editingSlug) {
            return {
              ...item,
              title: formData.title,
              type: formData.type,
              neighborhood: formData.neighborhood,
              price: formData.price,
              bedrooms: Number(formData.bedrooms) || 0,
              suites: Number(formData.suites) || 0,
              parking: Number(formData.parking) || 0,
              area: Number(formData.area) || 0,
              coverImage: {
                url: formData.coverImage.url || mockImages.livingRoom1,
                alt: formData.coverImage.alt || formData.title,
              },
              gallery: formData.gallery.map((g) => ({
                url: g.url,
                alt: g.alt || formData.title,
              })),
            };
          }
          return item;
        })
      );
    } else {
      // Criação
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-") || `imovel-${Date.now()}`;

      const created: UrbanProperty = {
        slug,
        code: `MRQ-U${100 + items.length + 1}`,
        title: formData.title,
        type: formData.type,
        neighborhood: formData.neighborhood,
        city: "Campo Grande",
        price: formData.price,
        bedrooms: Number(formData.bedrooms) || 3,
        suites: Number(formData.suites) || 2,
        parking: Number(formData.parking) || 2,
        area: Number(formData.area) || 120,
        badges: ["novo", "alto-padrao"],
        coverImage: {
          url: formData.coverImage.url || mockImages.livingRoom1,
          alt: formData.coverImage.alt || formData.title,
        },
        gallery: formData.gallery.map((g) => ({
          url: g.url,
          alt: g.alt || formData.title,
        })),
      };

      setItems([created, ...items]);
    }

    setModalOpen(false);
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
          onClick={handleOpenCreate}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xs bg-mineral px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Novo Imóvel Urbano
        </button>
      </div>

      {/* Busca e Resumo */}
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
                      <div className="relative h-12 w-16 overflow-hidden rounded-xs bg-areia/40 shrink-0 border border-areia/60">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.coverImage.url}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-graphite text-sm">{item.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[11px] text-graphite/50">{item.code}</span>
                          {item.gallery && item.gallery.length > 0 && (
                            <span className="text-[10px] bg-areia/40 text-graphite/70 px-1.5 py-0.2 rounded-xs">
                              +{item.gallery.length} fotos
                            </span>
                          )}
                        </div>
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
                  <td className="p-4 font-semibold text-mineral text-sm">
                    {item.price ? formatBRL(item.price) : "Sob Consulta"}
                  </td>

                  {/* Ações */}
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        title="Editar imóvel"
                        className="rounded-xs p-1.5 text-graphite/60 hover:bg-areia/50 hover:text-mineral transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
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

      {/* Modal de Criação / Edição de Imóvel */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/60 backdrop-blur-xs p-4 animate-fade-in"
        >
          <div className="relative w-full max-w-2xl rounded-sm bg-white p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-areia/40 pb-4 mb-6">
              <div>
                <h3 className="font-display text-xl text-graphite font-medium">
                  {editingSlug ? "Editar Imóvel Urbano" : "Novo Imóvel Urbano (Campo Grande)"}
                </h3>
                <p className="text-xs text-graphite/60">
                  Preencha os detalhes, fotografias e valor comercial do imóvel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1.5 text-graphite/50 hover:bg-offwhite hover:text-graphite transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Título do Anúncio */}
              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Título do Anúncio *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cobertura duplex com vista panorâmica no Jardim dos Estados"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
              </div>

              {/* Upload de Fotografias (Galeria & Seleção de Capa por Estrela) */}
              <ImageUpload
                label="Fotografias do Imóvel"
                helperText="Envie várias fotos de uma vez. A 1ª foto se torna a capa automaticamente ou clique na estrela (★) para escolher a capa."
                category="urban"
                coverImage={formData.coverImage}
                gallery={formData.gallery}
                onChangeImages={(cover, gal) =>
                  setFormData((prev) => ({
                    ...prev,
                    coverImage: cover,
                    gallery: gal,
                  }))
                }
                allowGallery={true}
              />

              {/* Tipo e Bairro */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Tipo de Imóvel *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  >
                    <option value="Apartamento">Apartamento</option>
                    <option value="Cobertura">Cobertura</option>
                    <option value="Casa em condomínio">Casa em condomínio</option>
                    <option value="Casa">Casa</option>
                    <option value="Sobrado">Sobrado</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Comercial">Comercial</option>
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
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              {/* Configurações (Quartos, Suítes, Vagas, Área) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Dormitórios</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) || 0 })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Suítes</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.suites}
                    onChange={(e) => setFormData({ ...formData, suites: Number(e.target.value) || 0 })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Vagas</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.parking}
                    onChange={(e) => setFormData({ ...formData, parking: Number(e.target.value) || 0 })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Área Útil (m²)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) || 0 })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              {/* Valor de Venda com CurrencyInput inteligente */}
              <CurrencyInput
                label="Valor de Venda"
                value={formData.price ?? 0}
                onChange={(numVal) => setFormData({ ...formData, price: numVal === 0 ? null : numVal })}
                placeholder="Ex: 1.250.000 ou 1,5 milhão"
                helperText="Aceita pontuação livre (ex: 1.000.000, 1500000, 1,5 mi) ou opção Sob Consulta."
                allowSobConsulta={true}
              />

              {/* Botões de Ação */}
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
                  className="rounded-xs bg-mineral px-6 py-2 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs"
                >
                  {editingSlug ? "Atualizar Imóvel" : "Salvar Imóvel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
