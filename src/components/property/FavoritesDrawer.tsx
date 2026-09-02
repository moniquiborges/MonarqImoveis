"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Heart, MessageCircle, ArrowRight, Layers } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { formatBRL } from "@/lib/utils";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

export function FavoritesDrawer() {
  const { favorites, isDrawerOpen, setIsDrawerOpen, removeFavorite, clearFavorites } =
    useFavorites();
  const { buildWhatsappUrl } = useSiteConfig();

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  // Cria mensagem para WhatsApp com todos os imóveis salvos
  const whatsappMessage = `Olá! Salvei os seguintes imóveis na MONARQ e gostaria de mais informações:\n${favorites
    .map(
      (f, i) =>
        `${i + 1}. ${f.title} (${f.location}) - ${
          f.price ? formatBRL(f.price) : "Sob Consulta"
        }`
    )
    .join("\n")}`;

  const whatsappUrl = buildWhatsappUrl(whatsappMessage);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-graphite/60 backdrop-blur-xs animate-fade-in"
    >
      {/* Backdrop de Fechamento */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="fixed inset-0 cursor-pointer"
        aria-hidden="true"
      />

      {/* Painel Lateral */}
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-fade-left">
        {/* Topo do Drawer */}
        <div className="flex items-center justify-between border-b border-areia/40 px-6 py-5">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-terracota text-terracota" />
            <h3 className="font-display text-lg font-medium text-graphite">
              Imóveis Salvos ({favorites.length})
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {favorites.length > 0 && (
              <button
                type="button"
                onClick={clearFavorites}
                className="text-xs text-graphite/50 hover:text-rose-600 transition-colors"
                title="Limpar todos"
              >
                Limpar
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="rounded-full p-1.5 text-graphite/50 hover:bg-offwhite hover:text-graphite transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Lista de Imóveis Favoritados */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {favorites.length > 0 ? (
            favorites.map((item) => (
              <div
                key={item.slug}
                className="group relative flex gap-3.5 rounded-xs border border-areia/50 bg-offwhite/30 p-3 hover:bg-offwhite transition-colors"
              >
                {/* Miniatura */}
                <Link
                  href={item.href}
                  onClick={() => setIsDrawerOpen(false)}
                  className="relative aspect-square h-20 w-20 overflow-hidden rounded-xs bg-areia/40 shrink-0"
                >
                  <Image
                    src={item.image.url}
                    alt={item.image.alt || item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                {/* Dados */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-graphite/50 block">
                      {item.location}
                    </span>
                    <Link
                      href={item.href}
                      onClick={() => setIsDrawerOpen(false)}
                      className="font-display text-sm font-medium text-graphite hover:text-mineral transition-colors line-clamp-1 block"
                    >
                      {item.title}
                    </Link>
                  </div>

                  <div className="flex items-baseline justify-between mt-2">
                    <span className="font-semibold text-mineral text-xs">
                      {item.price ? formatBRL(item.price) : "Sob Consulta"}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFavorite(item.slug)}
                      className="text-[11px] text-graphite/40 hover:text-rose-600 transition-colors inline-flex items-center gap-1"
                      title="Remover dos favoritos"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center py-12 text-graphite/60 space-y-3">
              <div className="rounded-full bg-areia/30 p-4 text-graphite/40">
                <Heart className="h-8 w-8" />
              </div>
              <h4 className="font-display text-base text-graphite">Sua lista está vazia</h4>
              <p className="text-xs text-graphite/60 max-w-xs leading-relaxed">
                Navegue pelas páginas de lançamentos, imóveis ou fazendas e clique no ícone de coração para salvar e comparar suas oportunidades preferidas.
              </p>
            </div>
          )}
        </div>

        {/* Rodapé de Ações */}
        {favorites.length > 0 && (
          <div className="border-t border-areia/40 p-6 bg-offwhite/50 space-y-3">
            <Link
              href="/favoritos"
              onClick={() => setIsDrawerOpen(false)}
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-xs bg-mineral px-4 py-3 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors shadow-xs"
            >
              <Layers className="h-4 w-4" />
              Comparar Imóveis ({favorites.length})
            </Link>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex w-full items-center justify-center gap-2 rounded-xs bg-[#25D366] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:brightness-105 transition-all shadow-xs"
              >
                <MessageCircle className="h-4 w-4 fill-current" />
                Atendimento WhatsApp para Todos
              </a>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
