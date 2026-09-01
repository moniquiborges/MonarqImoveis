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
  Edit2,
  X,
  Sprout,
  Calculator,
} from "lucide-react";
import { mockRuralProperties } from "@/lib/mock/rural";
import { mockImages } from "@/lib/mock/images";
import { ruralActivityLabels } from "@/lib/labels";
import { formatBRL } from "@/lib/utils";
import { CurrencyInput } from "@/components/admin/CurrencyInput";
import { ImageUpload, ImageData } from "@/components/admin/ImageUpload";
import type { RuralProperty, RuralActivity, RuralState } from "@/types";

export default function AdminRuralPage() {
  const [items, setItems] = useState<RuralProperty[]>(mockRuralProperties);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    state: RuralState;
    municipality: string;
    totalHectares: number;
    activity: RuralActivity;
    price: number | null;
    coverImage: ImageData;
    gallery: ImageData[];
  }>({
    title: "",
    state: "MS",
    municipality: "Ribas do Rio Pardo",
    totalHectares: 1500,
    activity: "pecuaria",
    price: 15000000,
    coverImage: {
      url: mockImages.ruralLandscape1,
      alt: "Foto da Fazenda",
    },
    gallery: [],
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

  const handleOpenCreate = () => {
    setEditingSlug(null);
    setFormData({
      title: "",
      state: "MS",
      municipality: "Ribas do Rio Pardo",
      totalHectares: 1500,
      activity: "pecuaria",
      price: 15000000,
      coverImage: {
        url: mockImages.ruralLandscape1,
        alt: "Foto da Fazenda",
      },
      gallery: [],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prop: RuralProperty) => {
    setEditingSlug(prop.slug);
    setFormData({
      title: prop.title,
      state: (prop.state as RuralState) || "MS",
      municipality: prop.municipality,
      totalHectares: prop.totalHectares,
      activity: prop.activity[0] || "pecuaria",
      price: prop.price,
      coverImage: prop.coverImage || { url: mockImages.ruralLandscape1, alt: prop.title },
      gallery: prop.gallery || [],
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const ha = Number(formData.totalHectares) || 1;
    const price = formData.price;
    const pricePerHectare = price ? Math.round(price / ha) : undefined;

    if (editingSlug) {
      setItems((prev) =>
        prev.map((item) => {
          if (item.slug === editingSlug) {
            return {
              ...item,
              title: formData.title,
              state: formData.state,
              municipality: formData.municipality,
              totalHectares: ha,
              activity: [formData.activity],
              price,
              pricePerHectare,
              coverImage: {
                url: formData.coverImage.url || mockImages.ruralLandscape1,
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
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-") || `rural-${Date.now()}`;

      const created: RuralProperty = {
        slug,
        code: `MRQ-R${200 + items.length + 1}`,
        title: formData.title,
        state: formData.state,
        municipality: formData.municipality,
        totalHectares: ha,
        activity: [formData.activity],
        price,
        pricePerHectare,
        badges: ["oportunidade"],
        coverImage: {
          url: formData.coverImage.url || mockImages.ruralLandscape1,
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
    if (confirm("Tem certeza que deseja remover esta propriedade rural?")) {
      setItems((prev) => prev.filter((i) => i.slug !== slug));
    }
  };

  const calculatedPricePerHa =
    formData.price && formData.totalHectares > 0
      ? Math.round(formData.price / formData.totalHectares)
      : null;

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
          onClick={handleOpenCreate}
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
          Total: {filteredItems.length} fazendas cadastradas
        </div>
      </div>

      {/* Tabela de Propriedades Rurais */}
      <div className="rounded-sm border border-areia/60 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-graphite">
            <thead>
              <tr className="border-b border-areia/40 bg-offwhite/50 text-graphite/60 uppercase tracking-wider text-[11px]">
                <th className="p-4 font-semibold">Propriedade &amp; Código</th>
                <th className="p-4 font-semibold">Município / Estado</th>
                <th className="p-4 font-semibold">Área Total</th>
                <th className="p-4 font-semibold">Aptidão</th>
                <th className="p-4 font-semibold">Valor Total</th>
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
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        title="Editar fazenda"
                        className="rounded-xs p-1.5 text-graphite/60 hover:bg-areia/50 hover:text-mineral transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
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

      {/* Modal de Nova / Editar Propriedade Rural */}
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
                  {editingSlug ? "Editar Propriedade Rural" : "Nova Propriedade Rural"}
                </h3>
                <p className="text-xs text-graphite/60">
                  Cadastre dados de área, aptidão, fotografias e valor total.
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
              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Nome da Fazenda / Propriedade *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fazenda Santa Helena - Dupla Aptidão"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
              </div>

              {/* Upload de Imagens */}
              <ImageUpload
                label="Fotografias da Propriedade Rural"
                helperText="Envie várias fotos de uma vez. A 1ª foto se torna a capa automaticamente ou clique na estrela (★) para escolher a capa."
                category="rural"
                coverImage={formData.coverImage}
                onCoverChange={(img) => setFormData({ ...formData, coverImage: img })}
                gallery={formData.gallery}
                onGalleryChange={(gal) => setFormData({ ...formData, gallery: gal })}
                allowGallery={true}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Estado *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value as RuralState })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite cursor-pointer"
                  >
                    <option value="MS">Mato Grosso do Sul (MS)</option>
                    <option value="MT">Mato Grosso (MT)</option>
                    <option value="GO">Goiás (GO)</option>
                    <option value="MG">Minas Gerais (MG)</option>
                    <option value="SP">São Paulo (SP)</option>
                    <option value="PR">Paraná (PR)</option>
                    <option value="BA">Bahia (BA)</option>
                    <option value="PI">Piauí (PI)</option>
                    <option value="MA">Maranhão (MA)</option>
                    <option value="TO">Tocantins (TO)</option>
                    <option value="PA">Pará (PA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Município *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ribas do Rio Pardo, Rondonópolis, Maracaju..."
                    value={formData.municipality}
                    onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Área Total (Hectares) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.totalHectares}
                    onChange={(e) =>
                      setFormData({ ...formData, totalHectares: Number(e.target.value) || 0 })
                    }
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                  {formData.totalHectares > 0 && (
                    <span className="text-[11px] text-graphite/50 mt-1 block">
                      Equivalente a {(formData.totalHectares / 2.42).toFixed(0)} alqueires paulistas
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Aptidão Principal *
                  </label>
                  <select
                    value={formData.activity}
                    onChange={(e) =>
                      setFormData({ ...formData, activity: e.target.value as RuralActivity })
                    }
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite cursor-pointer"
                  >
                    <option value="pecuaria">Pecuária (Cria, Recria, Engorda)</option>
                    <option value="agricultura">Agricultura / Lavoura de Soja &amp; Milho</option>
                    <option value="investimento">Investimento / Silvicultura (Eucalipto)</option>
                    <option value="arrendamento">Arrendamento Rural</option>
                    <option value="venda">Venda Geral / Oportunidade</option>
                  </select>
                </div>
              </div>

              {/* Valor Total com CurrencyInput */}
              <div className="space-y-2">
                <CurrencyInput
                  label="Valor Total da Propriedade (R$)"
                  value={formData.price ?? 0}
                  onChange={(numVal) => setFormData({ ...formData, price: numVal === 0 ? null : numVal })}
                  placeholder="Ex: 25.000.000 ou 25 milhões"
                  helperText="Aceita valores em milhões com ponto ou texto (ex: 15.000.000 ou 15 mi)."
                  allowSobConsulta={true}
                />

                {calculatedPricePerHa && (
                  <div className="flex items-center gap-2 p-2 rounded-xs bg-mineral/5 border border-mineral/20 text-xs text-mineral font-medium">
                    <Calculator className="h-4 w-4 shrink-0" />
                    <span>
                      Custo por Hectare calculado: <strong>{formatBRL(calculatedPricePerHa)} / ha</strong>
                    </span>
                  </div>
                )}
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
                  {editingSlug ? "Atualizar Fazenda" : "Salvar Fazenda"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
