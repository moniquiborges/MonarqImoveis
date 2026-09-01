"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { mockDevelopments } from "@/lib/mock/developments";
import { mockImages } from "@/lib/mock/images";
import { stageLabels } from "@/lib/labels";
import { formatBRL } from "@/lib/utils";
import {
  getStoredDevelopments,
  saveStoredDevelopments,
  useLiveStoredData,
} from "@/lib/storage";
import { CurrencyInput } from "@/components/admin/CurrencyInput";
import { ImageUpload, ImageData } from "@/components/admin/ImageUpload";
import type { Development, ScCity, DevelopmentStage } from "@/types";

export default function AdminEmpreendimentosPage() {
  const [items, setItems] = useLiveStoredData<Development[]>(
    getStoredDevelopments,
    mockDevelopments,
    "developments"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    city: ScCity;
    neighborhood: string;
    stage: DevelopmentStage;
    priceFrom: number | null;
    deliveryDate: string;
    shortDescription: string;
    bedroomsMin: number;
    bedroomsMax: number;
    areaMin: number;
    areaMax: number;
    distanceToSea: string;
    coverImage: ImageData;
    gallery: ImageData[];
  }>({
    name: "",
    city: "porto-belo",
    neighborhood: "",
    stage: "lancamento",
    priceFrom: 1200000,
    deliveryDate: "2028",
    shortDescription: "",
    bedroomsMin: 2,
    bedroomsMax: 4,
    areaMin: 80,
    areaMax: 220,
    distanceToSea: "Frente-mar",
    coverImage: {
      url: mockImages.coastalHouse1,
      alt: "Empreendimento no Litoral Catarinense",
    },
    gallery: [],
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCity = item.cityLabel.toLowerCase().includes(q);
        const matchNeigh = item.neighborhood?.toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchNeigh) return false;
      }
      return true;
    });
  }, [items, searchQuery]);

  const handleOpenCreate = () => {
    setEditingSlug(null);
    setFormData({
      name: "",
      city: "porto-belo",
      neighborhood: "",
      stage: "lancamento",
      priceFrom: 1200000,
      deliveryDate: "2028",
      shortDescription: "",
      bedroomsMin: 2,
      bedroomsMax: 4,
      areaMin: 80,
      areaMax: 220,
      distanceToSea: "Frente-mar",
      coverImage: {
        url: mockImages.coastalHouse1,
        alt: "Empreendimento no Litoral Catarinense",
      },
      gallery: [],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (dev: Development) => {
    setEditingSlug(dev.slug);
    setFormData({
      name: dev.name,
      city: dev.city,
      neighborhood: dev.neighborhood || "",
      stage: dev.stage,
      priceFrom: dev.priceFrom ?? null,
      deliveryDate: dev.deliveryDate || "",
      shortDescription: dev.shortDescription,
      bedroomsMin: dev.bedroomsRange[0] || 2,
      bedroomsMax: dev.bedroomsRange[1] || 4,
      areaMin: dev.areaRange[0] || 80,
      areaMax: dev.areaRange[1] || 200,
      distanceToSea: dev.distanceToSea || "Frente-mar",
      coverImage: dev.coverImage || { url: mockImages.coastalHouse1, alt: dev.name },
      gallery: dev.gallery || [],
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const cityLabel =
      formData.city === "porto-belo"
        ? "Porto Belo"
        : formData.city === "itapema"
        ? "Itapema"
        : "Balneário Camboriú";

    let updated: Development[];
    if (editingSlug) {
      updated = items.map((item) => {
        if (item.slug === editingSlug) {
          return {
            ...item,
            name: formData.name,
            city: formData.city,
            cityLabel,
            neighborhood: formData.neighborhood || "Centro",
            stage: formData.stage,
            deliveryDate: formData.deliveryDate,
            shortDescription: formData.shortDescription,
            priceFrom: formData.priceFrom ?? undefined,
            bedroomsRange: [Number(formData.bedroomsMin) || 2, Number(formData.bedroomsMax) || 4],
            areaRange: [Number(formData.areaMin) || 80, Number(formData.areaMax) || 200],
            distanceToSea: formData.distanceToSea,
            coverImage: {
              url: formData.coverImage.url || mockImages.coastalHouse1,
              alt: formData.coverImage.alt || formData.name,
            },
            gallery: formData.gallery.map((g) => ({
              url: g.url,
              alt: g.alt || formData.name,
            })),
          };
        }
        return item;
      });
    } else {
      const slug =
        formData.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w ]+/g, "")
          .replace(/ +/g, "-") || `dev-${Date.now()}`;

      const created: Development = {
        slug,
        name: formData.name,
        city: formData.city,
        cityLabel,
        neighborhood: formData.neighborhood || "Centro",
        stage: formData.stage,
        deliveryDate: formData.deliveryDate,
        shortDescription: formData.shortDescription,
        priceFrom: formData.priceFrom ?? undefined,
        bedroomsRange: [Number(formData.bedroomsMin) || 2, Number(formData.bedroomsMax) || 4],
        areaRange: [Number(formData.areaMin) || 80, Number(formData.areaMax) || 200],
        distanceToSea: formData.distanceToSea,
        badges: ["lancamento", "alto-padrao"],
        coverImage: {
          url: formData.coverImage.url || mockImages.coastalHouse1,
          alt: formData.coverImage.alt || formData.name,
        },
        gallery: formData.gallery.map((g) => ({
          url: g.url,
          alt: g.alt || formData.name,
        })),
      };

      updated = [created, ...items];
    }

    setItems(() => updated);
    saveStoredDevelopments(updated);
    setModalOpen(false);
  };

  const handleDelete = (slug: string) => {
    if (confirm("Tem certeza que deseja remover este empreendimento?")) {
      const updated = items.filter((i) => i.slug !== slug);
      setItems(() => updated);
      saveStoredDevelopments(updated);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold">
            Litoral de Santa Catarina
          </span>
          <h1 className="font-display text-2xl md:text-3xl text-graphite font-normal">
            Empreendimentos
          </h1>
          <p className="text-xs md:text-sm text-graphite/60 mt-0.5">
            Gerenciamento de torres, condomínios verticais e lançamentos em SC.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xs bg-mineral px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Novo Empreendimento
        </button>
      </div>

      {/* Barra de Busca e Métricas */}
      <div className="rounded-sm border border-areia/60 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-graphite/40" />
          <input
            type="text"
            placeholder="Buscar por nome, cidade ou bairro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 py-1.5 pl-9 pr-3 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
          />
        </div>

        <div className="text-xs text-graphite/60 font-medium">
          Total: {filteredItems.length} empreendimentos
        </div>
      </div>

      {/* Tabela de Empreendimentos */}
      <div className="rounded-sm border border-areia/60 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-graphite">
            <thead>
              <tr className="border-b border-areia/40 bg-offwhite/50 text-graphite/60 uppercase tracking-wider text-[11px]">
                <th className="p-4 font-semibold">Empreendimento</th>
                <th className="p-4 font-semibold">Localização (SC)</th>
                <th className="p-4 font-semibold">Estágio</th>
                <th className="p-4 font-semibold">Preço a partir de</th>
                <th className="p-4 font-semibold">Configuração</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-areia/30">
              {filteredItems.map((item) => (
                <tr key={item.slug} className="hover:bg-offwhite/30 transition-colors">
                  {/* Foto e Nome */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded-xs bg-areia/40 shrink-0 border border-areia/60">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.coverImage.url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-graphite text-sm">{item.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-graphite/50">{item.distanceToSea || "Litoral"}</span>
                          {item.gallery && item.gallery.length > 0 && (
                            <span className="text-[10px] bg-areia/40 text-graphite/70 px-1.5 py-0.2 rounded-xs">
                              +{item.gallery.length} fotos
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Localização */}
                  <td className="p-4">
                    <div className="font-medium text-graphite">{item.cityLabel}</div>
                    <div className="text-graphite/50 text-[11px]">{item.neighborhood || "Centro"}</div>
                  </td>

                  {/* Estágio */}
                  <td className="p-4">
                    <span className="inline-flex rounded-full bg-mineral/10 px-2.5 py-0.5 text-[11px] font-semibold text-mineral">
                      {stageLabels[item.stage]}
                    </span>
                  </td>

                  {/* Valor */}
                  <td className="p-4 font-semibold text-mineral text-sm">
                    {item.priceFrom ? formatBRL(item.priceFrom) : "Sob Consulta"}
                  </td>

                  {/* Configuração */}
                  <td className="p-4 text-graphite/70">
                    <div>{item.bedroomsRange[0]} a {item.bedroomsRange[1]} dorms.</div>
                    <div className="text-[11px] text-graphite/50">
                      {item.areaRange[0]} a {item.areaRange[1]} m²
                    </div>
                  </td>

                  {/* Ações */}
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        title="Editar empreendimento"
                        className="rounded-xs p-1.5 text-graphite/60 hover:bg-areia/50 hover:text-mineral transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <Link
                        href={`/empreendimentos/${item.city}/${item.slug}`}
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

      {/* Modal de Cadastro/Edição de Empreendimento */}
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
                  {editingSlug ? "Editar Empreendimento" : "Novo Empreendimento (SC)"}
                </h3>
                <p className="text-xs text-graphite/60">Cadastre um novo lançamento ou torre no litoral catarinense.</p>
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
              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Nome do Empreendimento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Essenza Residence - Frente Mar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
              </div>

              {/* Upload de Imagens */}
              <ImageUpload
                label="Imagens do Empreendimento"
                helperText="Envie várias fotos de uma vez. A 1ª foto se torna a capa automaticamente ou clique na estrela (★) para escolher a capa."
                category="coastal"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Cidade *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value as ScCity })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite cursor-pointer"
                  >
                    <option value="porto-belo">Porto Belo</option>
                    <option value="itapema">Itapema</option>
                    <option value="balneario-camboriu">Balneário Camboriú</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Perequê, Meia Praia, Centro, Barra Sul..."
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Estágio da Obra *
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) =>
                      setFormData({ ...formData, stage: e.target.value as DevelopmentStage })
                    }
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite cursor-pointer"
                  >
                    <option value="lancamento">Lançamento</option>
                    <option value="em-obras">Em Obras</option>
                    <option value="pronto">Pronto para Morar</option>
                    <option value="vendido">Vendido</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Previsão de Entrega
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Dezembro/2027 ou Pronto para morar"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              {/* Preço Inicial com CurrencyInput */}
              <CurrencyInput
                label="Preço a partir de (R$)"
                value={formData.priceFrom ?? 0}
                onChange={(numVal) => setFormData({ ...formData, priceFrom: numVal === 0 ? null : numVal })}
                placeholder="Ex: 1.450.000 ou 1,5 milhão"
                helperText="Aceita pontuação (1.000.000) e atalhos rápidos."
                allowSobConsulta={true}
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Dorms Mín</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.bedroomsMin}
                    onChange={(e) => setFormData({ ...formData, bedroomsMin: Number(e.target.value) || 0 })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Dorms Máx</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.bedroomsMax}
                    onChange={(e) => setFormData({ ...formData, bedroomsMax: Number(e.target.value) || 0 })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Área Mín (m²)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.areaMin}
                    onChange={(e) => setFormData({ ...formData, areaMin: Number(e.target.value) || 0 })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Área Máx (m²)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.areaMax}
                    onChange={(e) => setFormData({ ...formData, areaMax: Number(e.target.value) || 0 })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Descrição Curta do Empreendimento
                </label>
                <textarea
                  rows={3}
                  placeholder="Resumo dos diferenciais, localização e acabamentos..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite resize-none"
                />
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
                  className="rounded-xs bg-mineral px-6 py-2 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs"
                >
                  {editingSlug ? "Atualizar Empreendimento" : "Salvar Empreendimento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
