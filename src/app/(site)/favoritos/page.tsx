"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Trash2,
  MessageCircle,
  ExternalLink,
  Building2,
  Home,
  LandPlot,
  Layers,
  ArrowRight,
  Share2,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { useFavorites } from "@/contexts/FavoritesContext";
import { formatBRL } from "@/lib/utils";
import { buildWhatsappUrl } from "@/lib/site-config";

export default function FavoritosPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();

  const allPropertiesMessage = `Olá! Gostaria de receber consultoria sobre os seguintes imóveis que salvei na MONARQ:\n${favorites
    .map(
      (f, i) =>
        `${i + 1}. ${f.title} (${f.location}) - ${
          f.price ? formatBRL(f.price) : "Sob Consulta"
        }`
    )
    .join("\n")}`;

  const allWhatsappUrl = buildWhatsappUrl(allPropertiesMessage);

  return (
    <main className="py-8 md:py-16">
      <Container>
        {/* Trilha de Navegação */}
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Meus Imóveis Salvos & Comparador" },
          ]}
        />

        {/* Cabeçalho */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold">
                Curadoria Pessoal
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl text-mineral font-normal tracking-tight">
              Imóveis Salvos ({favorites.length})
            </h1>
            <p className="mt-2 text-sm text-graphite/70 max-w-xl">
              Compare as especificações, metragens e valores dos imóveis selecionados antes de tomar sua decisão patrimonial.
            </p>
          </div>

          {favorites.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {allWhatsappUrl && (
                <a
                  href={allWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-2 rounded-xs bg-[#25D366] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:brightness-105 transition-all shadow-xs"
                >
                  <MessageCircle className="h-4 w-4 fill-current" />
                  Atendimento para Todos
                </a>
              )}
              <button
                type="button"
                onClick={clearFavorites}
                className="focus-ring rounded-xs border border-areia/70 bg-white px-3.5 py-2.5 text-xs font-medium text-graphite/70 hover:bg-offwhite hover:text-rose-600 transition-colors"
              >
                Limpar Lista
              </button>
            </div>
          )}
        </div>

        {/* Conteúdo: Comparador ou Estado Vazio */}
        {favorites.length > 0 ? (
          <div className="space-y-12">
            {/* Grade de Cards com Especificações */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {favorites.map((item) => {
                const singleWaMessage = `Olá! Tenho interesse no imóvel "${item.title}" (${item.location})${
                  item.code ? ` - Código: ${item.code}` : ""
                }. Link: ${item.href}`;
                const singleWaUrl = buildWhatsappUrl(singleWaMessage);

                return (
                  <div
                    key={item.slug}
                    className="flex flex-col rounded-sm border border-areia/60 bg-white shadow-xs overflow-hidden group hover:border-mineral/40 transition-colors"
                  >
                    {/* Imagem */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-areia/40">
                      <Image
                        src={item.image.url}
                        alt={item.image.alt || item.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => removeFavorite(item.slug)}
                        title="Remover dos favoritos"
                        className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-graphite/60 hover:text-rose-600 hover:bg-white shadow-sm transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Detalhes */}
                    <div className="flex flex-1 flex-col p-5 justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-graphite/50 mb-1">
                          <span className="uppercase tracking-wider font-medium">{item.location}</span>
                          {item.code && <span className="font-mono">{item.code}</span>}
                        </div>

                        <Link href={item.href} className="focus-ring">
                          <h3 className="font-display text-lg text-graphite font-medium hover:text-mineral transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                        </Link>

                        {item.specsSummary && (
                          <p className="mt-2 text-xs text-graphite/70 border-t border-areia/30 pt-2">
                            {item.specsSummary}
                          </p>
                        )}
                      </div>

                      <div className="mt-5 border-t border-areia/40 pt-4">
                        <div className="flex items-baseline justify-between mb-4">
                          <span className="text-xs text-graphite/50">Valor:</span>
                          <strong className="font-display text-lg text-mineral font-semibold">
                            {item.price ? formatBRL(item.price) : "Sob Consulta"}
                          </strong>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={item.href}
                            className="focus-ring inline-flex items-center justify-center gap-1.5 rounded-xs border border-areia/70 bg-offwhite/50 px-3 py-2 text-xs font-semibold text-graphite hover:bg-offwhite hover:text-mineral transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Ver Imóvel
                          </Link>

                          {singleWaUrl && (
                            <a
                              href={singleWaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="focus-ring inline-flex items-center justify-center gap-1.5 rounded-xs bg-[#25D366] px-3 py-2 text-xs font-semibold text-white hover:brightness-105 transition-all shadow-xs"
                            >
                              <MessageCircle className="h-3.5 w-3.5 fill-current" />
                              WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-areia/80 bg-white/40 p-12 md:p-16 text-center max-w-2xl mx-auto space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-areia/30 text-mineral/60">
              <Heart className="h-8 w-8" />
            </div>
            <h2 className="font-display text-2xl text-graphite">
              Você ainda não salvou nenhum imóvel
            </h2>
            <p className="text-sm text-graphite/70 leading-relaxed">
              Explore nossos empreendimentos no litoral catarinense, imóveis urbanos em Campo Grande ou propriedades rurais e clique no ícone de coração para criar sua lista personalizada.
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <ButtonLink href="/empreendimentos" variant="primary">
                Empreendimentos SC
              </ButtonLink>
              <ButtonLink href="/imoveis/campo-grande" variant="secondary">
                Campo Grande
              </ButtonLink>
              <ButtonLink href="/rural" variant="secondary">
                Propriedades Rurais
              </ButtonLink>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
