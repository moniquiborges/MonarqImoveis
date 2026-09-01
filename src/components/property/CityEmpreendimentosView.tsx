"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PropertyCard } from "@/components/property/PropertyCard";
import { developmentToCard } from "@/components/property/adapters";
import { mockDevelopments } from "@/lib/mock/developments";
import { getStoredDevelopments, useLiveStoredData } from "@/lib/storage";
import type { ScCity, Development } from "@/types";

interface CityInfo {
  name: string;
  headline: string;
  description: string;
}

const cityData: Record<ScCity, CityInfo> = {
  "porto-belo": {
    name: "Porto Belo",
    headline: "Águas calmas, marina internacional e forte vetor de valorização",
    description:
      "A capital catarinense dos transatlânticos e dos esportes náuticos combina praias paradisíacas com um planejamento urbano moderno e empreendimentos de altíssimo padrão com vista mar.",
  },
  itapema: {
    name: "Itapema",
    headline: "Orla reurbanizada, sofisticação e segundo metro quadrado mais valorizado",
    description:
      "Referência nacional em valorização imobiliária, Itapema oferece infraestrutura completa, a famosa Meia Praia e edifícios imponentes projetados para moradia e alta rentabilidade.",
  },
  "balneario-camboriu": {
    name: "Balneário Camboriú",
    headline: "O metro quadrado mais cobiçado do Brasil e skyline icônico",
    description:
      "O epicentro do luxo no litoral brasileiro. Arranha-céus de arquitetura mundial, alta gastronomia, marina privativa e liquidez incomparável no mercado imobiliário.",
  },
};

const validCities: ScCity[] = ["porto-belo", "itapema", "balneario-camboriu"];

interface Props {
  city: ScCity;
  initialDevelopments?: Development[];
}

export function CityEmpreendimentosView({ city, initialDevelopments }: Props) {
  const [allDevelopments] = useLiveStoredData<Development[]>(
    getStoredDevelopments,
    mockDevelopments,
    "developments"
  );

  const info = cityData[city];
  const developments = useMemo(() => {
    return allDevelopments.filter((d) => d.city === city);
  }, [allDevelopments, city]);

  return (
    <main className="py-8 md:py-12">
      <Container>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Empreendimentos SC", href: "/empreendimentos" },
            { label: info.name },
          ]}
        />

        {/* Header da Cidade */}
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.15em] text-terracota font-semibold mb-2">
            Litoral de Santa Catarina
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-mineral font-normal tracking-tight">
            Empreendimentos em {info.name}
          </h1>
          <p className="mt-3 text-base md:text-lg text-mineral-light font-medium">
            {info.headline}
          </p>
          <p className="mt-3 text-sm md:text-base text-graphite/70 leading-relaxed">
            {info.description}
          </p>
        </div>

        {/* Outras Cidades para Navegação Fácil */}
        <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-areia/40 pb-4 text-xs">
          <span className="text-graphite/50 font-medium mr-2">Ver outras regiões:</span>
          <Link
            href="/empreendimentos"
            className="rounded-xs border border-areia/60 bg-white/70 px-3 py-1.5 text-graphite/70 hover:bg-areia/30 hover:text-graphite transition-colors"
          >
            Todos
          </Link>
          {validCities
            .filter((c) => c !== city)
            .map((c) => (
              <Link
                key={c}
                href={`/empreendimentos/${c}`}
                className="rounded-xs border border-areia/60 bg-white/70 px-3 py-1.5 text-graphite/70 hover:bg-areia/30 hover:text-graphite transition-colors"
              >
                {cityData[c].name}
              </Link>
            ))}
        </div>

        {/* Grade de Empreendimentos */}
        {developments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {developments.map((dev) => (
              <PropertyCard key={dev.slug} {...developmentToCard(dev)} />
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-areia/80 p-12 text-center bg-white/40">
            <h3 className="font-display text-lg text-graphite">
              Novos lançamentos em breve em {info.name}
            </h3>
            <p className="mt-2 text-xs text-graphite/60 max-w-md mx-auto">
              Nossa equipe está selecionando novos empreendimentos exclusivos nesta região. Entre em contato para oportunidades off-market.
            </p>
          </div>
        )}
      </Container>
    </main>
  );
}
