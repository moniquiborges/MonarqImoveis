"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Images, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { PropertyImage } from "@/types";

export interface PropertyGalleryProps {
  coverImage: PropertyImage;
  gallery: PropertyImage[];
  title: string;
}

export function PropertyGallery({ coverImage, gallery, title }: PropertyGalleryProps) {
  const allImages = [coverImage, ...gallery.filter((img) => img.url !== coverImage.url)];
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const closeLightbox = () => {
    setModalOpen(false);
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    if (!modalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [modalOpen, handleNext, handlePrev]);

  return (
    <section className="relative my-4" aria-label={`Galeria de fotos de ${title}`}>
      {/* Grade de Imagens (Desktop: 1 Principal + 2 Laterais | Mobile: 1 Principal) */}
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3 md:gap-3">
        {/* Foto Principal */}
        <div
          onClick={() => openLightbox(0)}
          className="group relative aspect-[16/10] md:aspect-auto md:col-span-2 md:h-[480px] overflow-hidden rounded-xs cursor-pointer bg-areia/40"
        >
          <Image
            src={allImages[0].url}
            alt={allImages[0].alt || title}
            fill
            priority
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-graphite/10 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Miniaturas Laterais (Desktop) */}
        <div className="hidden md:flex flex-col gap-3 h-[480px]">
          {allImages.slice(1, 3).map((img, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx + 1)}
              className="group relative flex-1 overflow-hidden rounded-xs cursor-pointer bg-areia/40"
            >
              <Image
                src={img.url}
                alt={img.alt || `${title} - Foto ${idx + 2}`}
                fill
                sizes="33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-graphite/10 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}

          {/* Se houver apenas 1 imagem lateral no mock, preenche com um bloco elegante */}
          {allImages.length === 2 && (
            <div
              onClick={() => openLightbox(0)}
              className="flex flex-1 items-center justify-center rounded-xs bg-areia/20 text-mineral/70 text-sm border border-areia/50 cursor-pointer hover:bg-areia/30 transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <Images className="h-4 w-4" />
                Explorar visualização completa
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Botão de Ver Todas as Fotos */}
      <button
        type="button"
        onClick={() => openLightbox(0)}
        className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-xs bg-white/95 backdrop-blur-md px-4 py-2.5 text-xs font-semibold tracking-wide text-graphite shadow-md hover:bg-white hover:text-mineral transition-all focus-ring"
      >
        <Images className="h-4 w-4 text-mineral" />
        Ver todas as fotos ({allImages.length})
      </button>

      {/* Modal / Lightbox Fullscreen */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/95 backdrop-blur-md animate-fade-in"
        >
          {/* Barra Superior */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6 text-offwhite">
            <span className="text-sm font-medium">
              {currentIndex + 1} / {allImages.length} &mdash; {title}
            </span>
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Fechar visualizador"
              className="rounded-full p-2 text-offwhite/80 hover:bg-white/10 hover:text-white transition-colors focus-ring"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Botão Anterior */}
          {allImages.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto anterior"
              className="absolute left-4 z-20 rounded-full p-3 text-white bg-white/10 hover:bg-white/20 transition-colors focus-ring"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Imagem em Exibição */}
          <div className="relative max-h-[85vh] max-w-[90vw] w-full h-full flex items-center justify-center">
            <div className="relative w-full h-[80vh]">
              <Image
                src={allImages[currentIndex].url}
                alt={allImages[currentIndex].alt || `${title} - Foto ${currentIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Botão Próximo */}
          {allImages.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Próxima foto"
              className="absolute right-4 z-20 rounded-full p-3 text-white bg-white/10 hover:bg-white/20 transition-colors focus-ring"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Legenda Inferior */}
          {allImages[currentIndex].alt && (
            <div className="absolute bottom-4 left-0 right-0 text-center px-4 text-xs md:text-sm text-offwhite/70">
              {allImages[currentIndex].alt}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
