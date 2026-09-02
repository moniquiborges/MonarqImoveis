"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GalleryHorizontal, Plus, Eye, EyeOff, Trash2, Edit2, ArrowRight, X } from "lucide-react";
import { mockImages } from "@/lib/mock/images";
import { ImageUpload, type ImageData } from "@/components/admin/ImageUpload";
import {
  createBanner,
  deleteBanner,
  toggleBannerActive,
  updateBanner,
  type BannerListItem,
} from "./actions";
import type { BannerLocationDb } from "@/types/database";

interface BannersViewProps {
  initialBanners: BannerListItem[];
  initialError: string | null;
}

const locationLabels: Record<BannerLocationDb, string> = {
  hero: "Hero Principal (Home)",
  "destaque-sc": "Destaque Litoral SC",
  "campo-grande": "Seção Urbana",
  rural: "Seção Rural & Agro",
};

const emptyForm = {
  title: "",
  subtitle: "",
  location: "hero" as BannerLocationDb,
  ctaText: "Saiba Mais",
  ctaLink: "/empreendimentos",
  coverImage: { url: mockImages.coastalHouse1, alt: "Banner de Destaque" } as ImageData,
  active: true,
};

export function BannersView({ initialBanners, initialError }: BannersViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: BannerListItem) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      location: banner.location,
      ctaText: banner.ctaText,
      ctaLink: banner.ctaLink,
      coverImage: { url: banner.imageUrl || mockImages.coastalHouse1, alt: banner.title },
      active: banner.active,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const input = {
      title: formData.title,
      subtitle: formData.subtitle,
      location: formData.location,
      imageUrl: formData.coverImage.url,
      ctaText: formData.ctaText,
      ctaLink: formData.ctaLink,
      active: formData.active,
    };

    const result = editingId ? await updateBanner(editingId, input) : await createBanner(input);

    setIsSubmitting(false);
    if (result.success) {
      setIsModalOpen(false);
      router.refresh();
    } else {
      setFormError(result.error ?? "Não foi possível salvar o banner.");
    }
  };

  const handleToggleActive = (banner: BannerListItem) => {
    setActionError(null);
    startTransition(async () => {
      const result = await toggleBannerActive(banner.id, !banner.active);
      if (result.success) {
        router.refresh();
      } else {
        setActionError(result.error ?? "Não foi possível atualizar o status.");
      }
    });
  };

  const handleDeleteBanner = (id: string) => {
    if (!confirm("Deseja realmente remover este banner promocional?")) return;

    setActionError(null);
    startTransition(async () => {
      const result = await deleteBanner(id);
      if (result.success) {
        router.refresh();
      } else {
        setActionError(result.error ?? "Não foi possível excluir o banner.");
      }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Topo da Página */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-terracota">
            Marketing &amp; Comunicação Visual
          </span>
          <h1 className="font-display text-2xl md:text-3xl text-mineral">Banners &amp; Destaques</h1>
          <p className="text-xs md:text-sm text-graphite/70 mt-1">
            Gerencie os banners rotativos, chamadas principais e campanhas sazonais do site.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xs bg-mineral px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Novo Banner
        </button>
      </div>

      {initialError && (
        <div className="rounded-xs border border-rose-300 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {initialError}
        </div>
      )}
      {actionError && (
        <div className="rounded-xs border border-rose-300 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {actionError}
        </div>
      )}

      {/* Grade de Banners */}
      {initialBanners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialBanners.map((item) => (
            <div
              key={item.id}
              className={`group flex flex-col rounded-sm border bg-white shadow-xs overflow-hidden transition-all ${
                item.active ? "border-areia/60" : "border-gray-200 opacity-60"
              }`}
            >
              {/* Pré-visualização da Imagem */}
              <div className="relative aspect-[16/9] bg-graphite overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl || mockImages.coastalHouse1}
                  alt={item.title}
                  className="h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-transparent to-transparent" />

                <span className="absolute top-3 left-3 rounded-xs bg-graphite/80 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-areia">
                  {locationLabels[item.location]}
                </span>

                <span
                  className={`absolute top-3 right-3 flex h-6 items-center px-2 rounded-full text-[10px] font-bold ${
                    item.active ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"
                  }`}
                >
                  {item.active ? "ATIVO" : "INATIVO"}
                </span>
              </div>

              {/* Conteúdo */}
              <div className="flex flex-1 flex-col p-5 justify-between space-y-4">
                <div>
                  <h3 className="font-display text-base text-graphite font-semibold line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-graphite/60 mt-1 line-clamp-2 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-areia/30 pt-4 text-xs">
                  <div className="flex items-center gap-1 text-mineral font-medium">
                    <span>{item.ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item)}
                      disabled={isPending}
                      title={item.active ? "Desativar" : "Ativar"}
                      className="p-1.5 rounded-xs text-graphite/60 hover:text-mineral hover:bg-areia/40 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {item.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      title="Editar Banner"
                      className="p-1.5 rounded-xs text-graphite/60 hover:text-mineral hover:bg-areia/40 transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBanner(item.id)}
                      disabled={isPending}
                      title="Remover"
                      className="p-1.5 rounded-xs text-graphite/60 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-sm border border-dashed border-areia/80 bg-white/40 p-12 text-center text-xs text-graphite/50">
          Nenhum banner cadastrado ainda.
        </div>
      )}

      {/* Modal de Criação / Edição de Banner */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/60 backdrop-blur-xs p-4 animate-fade-in"
        >
          <div className="w-full max-w-2xl rounded-sm border border-areia/60 bg-white p-6 shadow-2xl space-y-5 animate-scale-in max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-areia/40 pb-3">
              <div className="flex items-center gap-2">
                <GalleryHorizontal className="h-5 w-5 text-mineral" />
                <h3 className="font-display text-lg font-medium text-graphite">
                  {editingId ? "Editar Banner Promocional" : "Adicionar Novo Banner"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-graphite/40 hover:text-graphite cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              {formError && (
                <div className="rounded-xs border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Posição de Exibição *
                </label>
                <select
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value as BannerLocationDb })
                  }
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite cursor-pointer"
                >
                  <option value="hero">Hero Principal (Topo da Home)</option>
                  <option value="destaque-sc">Destaque Litoral SC (Porto Belo / Itapema / BC)</option>
                  <option value="campo-grande">Seção Urbana (Campo Grande / MS)</option>
                  <option value="rural">Seção Rural &amp; Agronegócio</option>
                </select>
              </div>

              {/* Upload de Imagem do Banner */}
              <ImageUpload
                label="Imagem de Fundo do Banner"
                helperText="Escolha uma imagem de alto impacto com arquivo local, link ou banco de fotos."
                category={
                  formData.location === "destaque-sc"
                    ? "coastal"
                    : formData.location === "rural"
                    ? "rural"
                    : "urban"
                }
                coverImage={formData.coverImage}
                onCoverChange={(img) => setFormData({ ...formData, coverImage: img })}
                allowGallery={false}
              />

              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Título Principal *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lançamento Exclusivo Frente Mar em Itapema"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Subtítulo / Texto de Apoio
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Condições facilitadas de parcelamento direto durante o período de obras."
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Texto do Botão (CTA)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Link de Destino
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-graphite cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-areia/70"
                />
                Banner ativo
              </label>

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
                  disabled={isSubmitting}
                  className="rounded-xs bg-mineral px-5 py-2 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light cursor-pointer shadow-xs disabled:opacity-60"
                >
                  {isSubmitting ? "Salvando…" : editingId ? "Atualizar Banner" : "Publicar Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
