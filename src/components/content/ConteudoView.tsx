"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Calendar, ArrowRight, BookOpen, Search } from "lucide-react";
import type { BlogPost } from "@/types";

interface ConteudoViewProps {
  initialPosts: BlogPost[];
}

export function ConteudoView({ initialPosts }: ConteudoViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = useMemo(() => {
    const set = new Set(initialPosts.map((p) => p.category));
    return Array.from(set);
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      if (selectedCategory !== "all" && post.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesExcerpt = post.excerpt.toLowerCase().includes(q);
        if (!matchesTitle && !matchesExcerpt) return false;
      }
      return true;
    });
  }, [initialPosts, selectedCategory, searchQuery]);

  return (
    <main className="py-8 md:py-16">
      <Container>
        {/* Trilha de Navegação */}
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Conteúdo & Inteligência de Mercado" },
          ]}
        />

        {/* Cabeçalho Editorial */}
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold mb-2">
            Inteligência Imobiliária &amp; Tendências
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-mineral font-normal tracking-tight">
            Análises, Guias e Mercado
          </h1>
          <p className="mt-4 text-sm md:text-base text-graphite/70 leading-relaxed">
            Acompanhe nossos artigos sobre valorização urbana em Santa Catarina, oportunidades patrimoniais
            em Campo Grande e diretrizes essenciais para investimentos no agronegócio.
          </p>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="mb-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-y border-areia/40 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-xs px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-mineral text-offwhite"
                  : "bg-white text-graphite/70 hover:bg-areia/30 border border-areia/60"
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xs px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-mineral text-offwhite"
                    : "bg-white text-graphite/70 hover:bg-areia/30 border border-areia/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-graphite/40" />
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus-ring w-full rounded-xs border border-areia/70 bg-white py-1.5 pl-9 pr-3 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral"
            />
          </div>
        </div>

        {/* Grade de Artigos */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.slug} className="group flex flex-col">
                <Link
                  href={`/conteudo/${post.slug}`}
                  className="focus-ring relative aspect-[16/10] overflow-hidden rounded-xs bg-areia/40 block mb-4"
                >
                  <Image
                    src={post.coverImage.url}
                    alt={post.coverImage.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-xs bg-mineral/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-offwhite uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </Link>

                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-graphite/50 mb-2">
                    <Calendar className="h-3.5 w-3.5 text-mineral" />
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  </div>

                  <Link href={`/conteudo/${post.slug}`} className="focus-ring">
                    <h2 className="font-display text-xl text-graphite font-medium group-hover:text-mineral transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="mt-2 text-xs md:text-sm text-graphite/70 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 pt-3 border-t border-areia/30 mt-auto">
                    <Link
                      href={`/conteudo/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-mineral hover:text-mineral-light transition-colors"
                    >
                      Ler artigo completo
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-areia/80 p-12 text-center bg-white/40">
            <BookOpen className="mx-auto h-8 w-8 text-mineral/60 mb-2" />
            <h3 className="font-display text-lg text-graphite">Nenhum artigo encontrado</h3>
            <p className="mt-1 text-xs text-graphite/60">
              Tente buscar por outros termos ou selecionar outra categoria.
            </p>
          </div>
        )}
      </Container>
    </main>
  );
}
