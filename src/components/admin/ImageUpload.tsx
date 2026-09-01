"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Sparkles,
  Camera,
  Trash2,
  Star,
  Check,
  Layers,
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
  onCoverChange?: (image: ImageData) => void;
  gallery?: ImageData[];
  onGalleryChange?: (gallery: ImageData[]) => void;
  onChangeImages?: (cover: ImageData, gallery: ImageData[]) => void;
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
    { title: "Pasto & Topografia Plana", url: mockImages.ruralLandscape1 },
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
  helperText,
  coverImage,
  onCoverChange,
  gallery = [],
  onGalleryChange,
  onChangeImages,
  allowGallery = true,
  category = "urban",
  className = "",
}: ImageUploadProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url" | "presets">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = PRESET_COLLECTIONS[category] || PRESET_COLLECTIONS.urban;

  // Monta a lista unificada de todas as fotos presentes no anúncio
  const allImages: ImageData[] = [];
  if (coverImage?.url) {
    allImages.push(coverImage);
  }
  if (allowGallery && gallery && gallery.length > 0) {
    gallery.forEach((g) => {
      if (g.url && (!coverImage?.url || g.url !== coverImage.url)) {
        allImages.push(g);
      }
    });
  }

  // Atualiza capa e galeria simultaneamente de forma atômica e segura
  const updateImages = (newCover: ImageData, newGallery: ImageData[]) => {
    if (onChangeImages) {
      onChangeImages(newCover, newGallery);
    } else {
      if (onCoverChange) onCoverChange(newCover);
      if (onGalleryChange) onGalleryChange(newGallery);
    }
  };

  // Adiciona novas imagens (via upload múltiplo, URL ou banco de sugestões)
  const addImages = (newImgs: ImageData[]) => {
    if (!newImgs || newImgs.length === 0) return;

    if (!allowGallery) {
      // Modo imagem única (ex: banner ou blog)
      updateImages(newImgs[0], []);
      return;
    }

    const currentList = [...allImages];
    const incomingValid = newImgs.filter(
      (n) => n.url && !currentList.some((existing) => existing.url === n.url)
    );

    if (incomingValid.length === 0) return;

    // Se ainda não tem capa definida, a primeira imagem assume como capa
    if (!coverImage?.url) {
      const first = incomingValid[0];
      const rest = incomingValid.slice(1);
      updateImages(first, rest);
    } else {
      // Já existe capa, adiciona todas as novas na galeria
      const existingGallery = gallery.filter((g) => g.url !== coverImage.url);
      updateImages(coverImage, [...existingGallery, ...incomingValid]);
    }
  };

  // Função para redimensionar e comprimir fotos enviadas pelo usuário
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            resolve(dataUrl);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          // Comprime para JPEG 0.78 para caber dezenas de fotos sem estourar o storage
          const compressed = canvas.toDataURL("image/jpeg", 0.78);
          resolve(compressed);
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  };

  // Processa múltiplos arquivos selecionados pelo input ou drop
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (fileArray.length === 0) {
      alert("Por favor, selecione arquivos de imagem válidos (JPG, PNG, WEBP, etc.).");
      return;
    }

    try {
      const loadedImgs: ImageData[] = [];
      for (const file of fileArray) {
        const compressedUrl = await compressImage(file);
        if (compressedUrl) {
          loadedImgs.push({
            url: compressedUrl,
            alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          });
        }
      }
      addImages(loadedImgs);
    } catch (err) {
      console.error("Erro ao carregar imagens:", err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleUrlSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    addImages([{ url: trimmed, alt: "Imagem do anúncio" }]);
    setUrlInput("");
  };

  const handleSelectPreset = (url: string, title: string) => {
    addImages([{ url, alt: title }]);
  };

  // Define uma imagem específica como Capa Principal com a Estrela (★)
  const handleSetAsCover = (selectedImg: ImageData) => {
    if (selectedImg.url === coverImage?.url) return;

    // A nova galeria conterá todas as outras fotos (inclusive a capa antiga) exceto a nova capa
    const updatedGallery = allImages.filter((img) => img.url !== selectedImg.url);
    updateImages(selectedImg, updatedGallery);
  };

  // Remove uma imagem da galeria ou da capa
  const handleRemoveImage = (imgToRemove: ImageData) => {
    const isCover = imgToRemove.url === coverImage?.url;
    const remaining = allImages.filter((img) => img.url !== imgToRemove.url);

    if (isCover) {
      if (remaining.length > 0) {
        // O sistema puxa automaticamente a próxima foto para ser a nova capa
        const newCover = remaining[0];
        const newGallery = remaining.slice(1);
        updateImages(newCover, newGallery);
      } else {
        // Nenhuma imagem restou
        updateImages({ url: "", alt: "" }, []);
      }
    } else {
      const updatedGallery = gallery.filter((img) => img.url !== imgToRemove.url);
      updateImages(coverImage, updatedGallery);
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
          <p className="text-[11px] text-graphite/60 mt-0.5">
            {helperText ||
              "Envie várias fotos de uma vez. A primeira foto se torna a capa automaticamente ou clique na estrela (★) para escolher a capa."}
          </p>
        </div>

        {allowGallery && allImages.length > 0 && (
          <div className="flex items-center gap-1.5 bg-mineral/10 text-mineral px-2.5 py-1 rounded-xs text-[11px] font-semibold">
            <Layers className="h-3.5 w-3.5" />
            <span>
              {allImages.length} {allImages.length === 1 ? "foto" : "fotos"} no anúncio
            </span>
          </div>
        )}
      </div>

      {/* Abas de Envio */}
      <div className="flex items-center gap-2 border-b border-areia/30 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
            activeTab === "upload"
              ? "bg-mineral text-offwhite font-semibold shadow-xs"
              : "text-graphite/60 hover:text-graphite hover:bg-offwhite"
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          Upload de Fotos (Múltiplas)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
            activeTab === "url"
              ? "bg-mineral text-offwhite font-semibold shadow-xs"
              : "text-graphite/60 hover:text-graphite hover:bg-offwhite"
          }`}
        >
          <LinkIcon className="h-3.5 w-3.5" />
          Link / URL
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("presets")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
            activeTab === "presets"
              ? "bg-mineral text-offwhite font-semibold shadow-xs"
              : "text-graphite/60 hover:text-graphite hover:bg-offwhite"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          Fotos Sugeridas
        </button>
      </div>

      {/* Conteúdo da Aba: Upload em Lote */}
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
            multiple={allowGallery}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
              }
            }}
          />
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white border border-areia/60 shadow-xs mb-2.5 text-mineral">
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold text-graphite">
            Clique para selecionar fotos ou arraste e solte aqui
          </p>
          <p className="text-[11px] text-graphite/60 mt-1">
            {allowGallery
              ? "Você pode selecionar várias fotos de uma vez (PNG, JPG, WEBP)"
              : "Formatos suportados: PNG, JPG, WEBP"}
          </p>
        </div>
      )}

      {/* Conteúdo da Aba: Link / URL */}
      {activeTab === "url" && (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://exemplo.com/fotos/fachada-imovel.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleUrlSubmit();
              }
            }}
            className="focus-ring flex-1 rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite placeholder:text-graphite/40"
          />
          <button
            type="button"
            onClick={() => handleUrlSubmit()}
            className="rounded-xs bg-mineral px-4 py-2 text-xs font-semibold text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shrink-0"
          >
            + Adicionar Foto
          </button>
        </div>
      )}

      {/* Conteúdo da Aba: Fotos Sugeridas */}
      {activeTab === "presets" && (
        <div className="space-y-2">
          <p className="text-[11px] text-graphite/60">
            Clique em qualquer imagem para adicionar à galeria do anúncio:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
            {presets.map((preset, idx) => {
              const isAlreadyAdded = allImages.some((img) => img.url === preset.url);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url, preset.title)}
                  className={`group relative aspect-video overflow-hidden rounded-xs border text-left transition-all hover:border-mineral hover:shadow-xs cursor-pointer ${
                    isAlreadyAdded ? "border-mineral ring-1 ring-mineral" : "border-areia/70 bg-areia/20"
                  }`}
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
                  {isAlreadyAdded && (
                    <span className="absolute top-1 right-1 rounded-full bg-mineral p-0.5 text-white shadow-xs">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid Unificado com Todas as Fotos do Anúncio */}
      <div className="space-y-2 pt-2 border-t border-areia/30">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-graphite uppercase tracking-wider block">
            Galeria do Anúncio ({allImages.length}):
          </span>
          {allImages.length > 0 && (
            <span className="text-[10px] text-graphite/50 flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              Estrela indica a Capa Principal do site
            </span>
          )}
        </div>

        {allImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allImages.map((img, i) => {
              const isCover = img.url === coverImage?.url;

              return (
                <div
                  key={`${img.url}-${i}`}
                  className={`group relative aspect-[16/10] overflow-hidden rounded-xs bg-offwhite border transition-all ${
                    isCover
                      ? "border-mineral ring-2 ring-mineral/30 shadow-xs"
                      : "border-areia/70 hover:border-mineral/50"
                  }`}
                >
                  {/* Imagem */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.alt || `Foto ${i + 1}`}
                    className="h-full w-full object-cover"
                  />

                  {/* Badge de Capa */}
                  {isCover && (
                    <div className="absolute top-1.5 left-1.5 rounded-xs bg-mineral px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-offwhite shadow-md flex items-center gap-1">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      Capa Principal
                    </div>
                  )}

                  {/* Ações na Imagem: Escolher como Capa (Estrela) e Excluir */}
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                    {/* Botão de Estrela para Definir como Capa */}
                    {allowGallery && (
                      <button
                        type="button"
                        onClick={() => handleSetAsCover(img)}
                        title={isCover ? "Foto de Capa Atual" : "Definir como Foto de Capa"}
                        className={`rounded-xs p-1.5 text-xs transition-all shadow-xs cursor-pointer ${
                          isCover
                            ? "bg-mineral text-amber-300 ring-1 ring-amber-300"
                            : "bg-graphite/80 text-offwhite/80 hover:text-amber-300 hover:bg-graphite opacity-80 group-hover:opacity-100"
                        }`}
                      >
                        <Star
                          className={`h-3.5 w-3.5 ${
                            isCover ? "fill-amber-400 text-amber-400" : ""
                          }`}
                        />
                      </button>
                    )}

                    {/* Botão de Excluir */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img)}
                      title="Excluir foto"
                      className="rounded-xs bg-graphite/80 p-1.5 text-offwhite opacity-0 group-hover:opacity-100 hover:bg-rose-600 transition-all shadow-xs cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Barra inferior com legenda/ação */}
                  {!isCover && allowGallery ? (
                    <button
                      type="button"
                      onClick={() => handleSetAsCover(img)}
                      className="absolute bottom-0 inset-x-0 bg-graphite/80 backdrop-blur-xs py-1 px-1.5 text-[10px] text-offwhite/90 hover:text-amber-300 hover:bg-graphite transition-all text-center font-medium opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Star className="h-2.5 w-2.5" />
                      Tornar Capa
                    </button>
                  ) : isCover ? (
                    <div className="absolute bottom-0 inset-x-0 bg-mineral/90 backdrop-blur-xs py-0.5 px-1.5 text-[9px] text-offwhite text-center font-semibold">
                      Exibida na Busca e Destaques
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-areia rounded-xs bg-offwhite/50 text-graphite/50 text-xs text-center">
            <ImageIcon className="h-5 w-5 mb-1.5 opacity-40" />
            <span>Nenhuma foto adicionada ainda ao anúncio.</span>
            <span className="text-[11px] text-graphite/40 mt-0.5">
              Selecione os arquivos pelo computador ou cole links acima.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
