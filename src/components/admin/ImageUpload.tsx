"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  X,
  Plus,
  Check,
  Sparkles,
  Camera,
  Trash2,
} from "lucide-react";
import { mockImages } from "@/lib/mock/images";

export interface ImageData {
  url: string;
  alt?: string;
}

interface ImageUploadProps {
  label?: string;
  helperText?: string;
  coverImage: ImageData;
  onCoverChange: (image: ImageData) => void;
  gallery?: ImageData[];
  onGalleryChange?: (gallery: ImageData[]) => void;
  allowGallery?: boolean;
  category?: "urban" | "coastal" | "rural" | "blog" | "general";
  className?: string;
}

const PRESET_COLLECTIONS = {
  urban: [
    { title: "Casa Alto Padrão", url: mockImages.modernHouse },
    { title: "Living Duplex Integrado", url: mockImages.livingRoom1 },
    { title: "Living Contemporâneo", url: mockImages.livingRoom2 },
    { title: "Suíte Master", url: mockImages.bedroom1 },
    { title: "Cozinha Gourmet", url: mockImages.kitchen1 },
    { title: "Fachada Moderna Noturna", url: mockImages.houseExterior1 },
    { title: "Área de Lazer & Piscina", url: mockImages.poolHouse },
    { title: "Edifício Residencial", url: mockImages.urbanBuilding1 },
  ],
  coastal: [
    { title: "Vista Mar Frente-Mar", url: mockImages.coastalHouse1 },
    { title: "Edifício Litoral Catarinense", url: mockImages.urbanBuilding2 },
    { title: "Living Panorâmico", url: mockImages.livingRoom3 },
    { title: "Orla & Praia Aérea", url: mockImages.beachAerial },
    { title: "Pôr do Sol Balneário", url: mockImages.beach2 },
    { title: "Varanda Gourmet com Vista", url: mockImages.poolHouse },
  ],
  rural: [
    { title: "Fazenda Produtiva Pecuária", url: mockImages.ruralLandscape1 },
    { title: "Lavoura de Grãos / Agricultura", url: mockImages.ruralLandscape2 },
    { title: "Sede de Fazenda", url: mockImages.farmField },
    { title: "Pasto & Topografia Plana", mock: "ruralLandscape1", url: mockImages.ruralLandscape1 },
  ],
  blog: [
    { title: "Mercado Imobiliário", url: mockImages.urbanBuilding1 },
    { title: "Litoral SC", url: mockImages.beach2 },
    { title: "Agronegócio", url: mockImages.ruralLandscape1 },
    { title: "Design de Interiores", url: mockImages.livingRoom1 },
  ],
  general: [
    { title: "Living de Luxo", url: mockImages.livingRoom1 },
    { title: "Fachada Moderna", url: mockImages.modernHouse },
    { title: "Vista Mar", url: mockImages.coastalHouse1 },
    { title: "Fazenda", url: mockImages.ruralLandscape1 },
  ],
};

export function ImageUpload({
  label = "Fotografias do Imóvel",
  helperText = "Adicione a imagem principal (capa) e fotos adicionais para a galeria.",
  coverImage,
  onCoverChange,
  gallery = [],
  onGalleryChange,
  allowGallery = true,
  category = "urban",
  className = "",
}: ImageUploadProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url" | "presets">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [targetType, setTargetType] = useState<"cover" | "gallery">("cover");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = PRESET_COLLECTIONS[category] || PRESET_COLLECTIONS.urban;

  // Processa arquivo local do computador/celular
  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione um arquivo de imagem válido (JPG, PNG, WEBP, etc.).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        if (targetType === "cover" || !allowGallery || !onGalleryChange) {
          onCoverChange({ url: result, alt: file.name.replace(/\.[^/.]+$/, "") });
        } else {
          onGalleryChange([...gallery, { url: result, alt: file.name.replace(/\.[^/.]+$/, "") }]);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    if (targetType === "cover" || !allowGallery || !onGalleryChange) {
      onCoverChange({ url: urlInput.trim(), alt: "Imagem principal" });
    } else {
      onGalleryChange([...gallery, { url: urlInput.trim(), alt: "Foto da galeria" }]);
    }
    setUrlInput("");
  };

  const handleSelectPreset = (url: string, title: string) => {
    if (targetType === "cover" || !allowGallery || !onGalleryChange) {
      onCoverChange({ url, alt: title });
    } else {
      onGalleryChange([...gallery, { url, alt: title }]);
    }
  };

  const handleRemoveCover = () => {
    onCoverChange({ url: "", alt: "" });
  };

  const handleRemoveGalleryImage = (index: number) => {
    if (onGalleryChange) {
      onGalleryChange(gallery.filter((_, i) => i !== index));
    }
  };

  return (
    <div className={`space-y-4 rounded-sm border border-areia/70 bg-white p-4 shadow-xs ${className}`}>
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-areia/40 pb-3">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-graphite flex items-center gap-1.5">
            <Camera className="h-4 w-4 text-mineral" />
            {label}
          </h4>
          {helperText && <p className="text-[11px] text-graphite/60 mt-0.5">{helperText}</p>}
        </div>

        {/* Escolha do destino se galeria estiver ativa */}
        {allowGallery && onGalleryChange && (
          <div className="flex items-center gap-1 bg-offwhite p-1 rounded-xs border border-areia/60">
            <button
              type="button"
              onClick={() => setTargetType("cover")}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-xs transition-colors cursor-pointer ${
                targetType === "cover"
                  ? "bg-mineral text-offwhite font-semibold shadow-xs"
                  : "text-graphite/70 hover:text-graphite"
              }`}
            >
              Foto de Capa Principal
            </button>
            <button
              type="button"
              onClick={() => setTargetType("gallery")}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-xs transition-colors cursor-pointer ${
                targetType === "gallery"
                  ? "bg-mineral text-offwhite font-semibold shadow-xs"
                  : "text-graphite/70 hover:text-graphite"
              }`}
            >
              + Adicionar à Galeria ({gallery.length})
            </button>
          </div>
        )}
      </div>

      {/* Tabs de Seleção de Fonte */}
      <div className="flex items-center gap-2 border-b border-areia/30 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
            activeTab === "upload"
              ? "bg-areia/50 text-graphite font-semibold"
              : "text-graphite/60 hover:text-graphite hover:bg-offwhite"
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          Fazer Upload (Arquivo)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
            activeTab === "url"
              ? "bg-areia/50 text-graphite font-semibold"
              : "text-graphite/60 hover:text-graphite hover:bg-offwhite"
          }`}
        >
          <LinkIcon className="h-3.5 w-3.5" />
          Link / URL da Imagem
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("presets")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
            activeTab === "presets"
              ? "bg-areia/50 text-graphite font-semibold"
              : "text-graphite/60 hover:text-graphite hover:bg-offwhite"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-terracota" />
          Fotos Sugeridas
        </button>
      </div>

      {/* Conteúdo da Tab Ativa */}
      {activeTab === "upload" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xs p-6 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-mineral bg-mineral/5 scale-[0.99]"
              : "border-areia/80 bg-offwhite/40 hover:border-mineral/60 hover:bg-offwhite"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white border border-areia/60 shadow-xs mb-2 text-mineral">
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-graphite">
            Clique para selecionar uma imagem ou arraste e solte aqui
          </p>
          <p className="text-[11px] text-graphite/50 mt-1">
            Formatos suportados: PNG, JPG, WEBP, JPEG • Destino atual:{" "}
            <strong className="text-mineral uppercase font-semibold">
              {targetType === "cover" ? "Foto de Capa" : "Galeria"}
            </strong>
          </p>
        </div>
      )}

      {activeTab === "url" && (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://exemplo.com/fotos/imovel-fachada.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="focus-ring flex-1 rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite placeholder:text-graphite/40"
          />
          <button
            type="button"
            onClick={() => handleUrlSubmit()}
            className="rounded-xs bg-mineral px-4 py-2 text-xs font-semibold text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shrink-0"
          >
            {targetType === "cover" ? "Definir Capa" : "+ Adicionar"}
          </button>
        </div>
      )}

      {activeTab === "presets" && (
        <div className="space-y-2">
          <p className="text-[11px] text-graphite/60">
            Clique em qualquer imagem para aplicar como{" "}
            <strong>{targetType === "cover" ? "Capa Principal" : "Galeria"}</strong>:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.url, preset.title)}
                className="group relative aspect-video overflow-hidden rounded-xs border border-areia/70 bg-areia/20 text-left transition-all hover:border-mineral hover:shadow-xs cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preset.url}
                  alt={preset.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                  <span className="text-[10px] text-white font-medium line-clamp-1">
                    {preset.title}
                  </span>
                </div>
                {coverImage.url === preset.url && (
                  <span className="absolute top-1 right-1 rounded-full bg-mineral p-0.5 text-white">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pré-visualização da Capa e da Galeria */}
      <div className="space-y-3 pt-2">
        {/* Capa Principal */}
        <div>
          <span className="text-[11px] font-semibold text-graphite uppercase tracking-wider block mb-1.5">
            Foto de Capa Atual:
          </span>
          {coverImage?.url ? (
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-xs border border-areia/80 bg-offwhite shadow-xs group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage.url}
                alt={coverImage.alt || "Capa do imóvel"}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-2 left-2 rounded-xs bg-mineral px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-offwhite shadow-xs">
                ★ Capa Principal
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={handleRemoveCover}
                  className="rounded-xs bg-graphite/80 p-1.5 text-offwhite hover:bg-rose-600 transition-colors shadow-xs cursor-pointer"
                  title="Remover imagem de capa"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-graphite/70 backdrop-blur-xs p-2 text-[11px] text-offwhite truncate">
                {coverImage.alt || coverImage.url}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 border border-dashed border-areia rounded-xs bg-offwhite/50 text-graphite/50 text-xs">
              <ImageIcon className="h-4 w-4 mr-2" />
              Nenhuma imagem de capa selecionada. Use o upload, link ou banco de fotos acima.
            </div>
          )}
        </div>

        {/* Galeria de Fotos Adicionais */}
        {allowGallery && onGalleryChange && gallery.length > 0 && (
          <div className="pt-2 border-t border-areia/30">
            <span className="text-[11px] font-semibold text-graphite uppercase tracking-wider block mb-1.5">
              Fotos da Galeria ({gallery.length}):
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {gallery.map((img, i) => (
                <div
                  key={i}
                  className="group relative aspect-video overflow-hidden rounded-xs border border-areia/70 bg-offwhite"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.alt || `Foto ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(i)}
                    className="absolute top-1 right-1 rounded-full bg-graphite/80 p-1 text-offwhite opacity-0 group-hover:opacity-100 hover:bg-rose-600 transition-all cursor-pointer"
                    title="Remover da galeria"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
