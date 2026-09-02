"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyVideos } from "@/components/property/PropertyVideos";
import { LeadContactCard } from "@/components/property/LeadContactCard";
import { SimilarProperties } from "@/components/property/SimilarProperties";
import { developmentToCard } from "@/components/property/adapters";
import { mockDevelopments } from "@/lib/mock/developments";
import { getStoredDevelopments, useLiveStoredData } from "@/lib/storage";
import { fetchDevelopmentBySlug } from "@/lib/services/propertyService";
import { stageLabels } from "@/lib/labels";
import type { Development } from "@/types";
import {
  BedDouble,
  Bath,
  Car,
  Ruler,
  Waves,
  Calendar,
  Building2,
  CheckCircle,
  Sparkles,
  Palmtree,
  MapPin,
  Loader2,
} from "lucide-react";

interface Props {
  initialCity: string;
  initialSlug: string;
  initialDevelopment?: Development;
}

export function DevelopmentDetailView({
  initialCity,
  initialSlug,
  initialDevelopment,
}: Props) {
  const [localDevelopments] = useLiveStoredData<Development[]>(
    getStoredDevelopments,
    mockDevelopments,
    "developments"
  );
  const [dbDevelopment, setDbDevelopment] = useState<Development | null>(null);
  const [loadingDb, setLoadingDb] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchDevelopmentBySlug(initialSlug).then((dev) => {
      if (isMounted) {
        if (dev) setDbDevelopment(dev);
        setLoadingDb(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [initialSlug]);

  const development = useMemo(() => {
    return (
      dbDevelopment ||
      initialDevelopment ||
      localDevelopments.find((d) => d.slug === initialSlug)
    );
  }, [dbDevelopment, initialDevelopment, localDevelopments, initialSlug]);

  if (loadingDb && !development) {
    return (
      <main className="py-24 text-center">
        <Container className="flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-mineral" />
          <p className="text-xs uppercase tracking-wider text-graphite/60">
            Carregando empreendimento...
          </p>
        </Container>
      </main>
    );
  }

  if (!development) {
    return (
      <main className="py-20 text-center">
        <Container>
          <h1 className="font-display text-2xl text-graphite mb-2">
            Empreendimento não encontrado
          </h1>
          <p className="text-sm text-graphite/60 mb-6">
            O empreendimento solicitado pode ter sido atualizado ou o link está incorreto.
          </p>
          <Link
            href="/empreendimentos"
            className="inline-flex rounded-xs bg-mineral px-4 py-2 text-xs font-semibold text-offwhite"
          >
            Ver todos os empreendimentos
          </Link>
        </Container>
      </main>
    );
  }

  const similarItems = localDevelopments
    .filter((d) => d.slug !== development.slug)
    .map(developmentToCard);

  return (
    <main className="py-6 md:py-10">
      <Container>
        {/* Trilha de Navegação */}
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Empreendimentos SC", href: "/empreendimentos" },
            { label: development.cityLabel, href: `/empreendimentos/${development.city}` },
            { label: development.name },
          ]}
        />

        {/* Cabeçalho do Empreendimento */}
        <div className="mt-2 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-xs bg-mineral/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-mineral">
              {stageLabels[development.stage]}
            </span>
            {development.badges?.map((b) => (
              <Badge key={b} badge={b} />
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
            <div>
              <h1 className="font-display text-3xl md:text-5xl text-graphite font-normal tracking-tight">
                {development.name}
              </h1>
              <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm md:text-base text-graphite/70">
                <MapPin className="h-4 w-4 text-mineral shrink-0" />
                {development.neighborhood ? `${development.neighborhood}, ` : ""}
                {development.cityLabel} &mdash; SC
                {development.distanceToSea && (
                  <span className="font-medium text-mineral ml-1">
                    ({development.distanceToSea})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Galeria de Fotos */}
        <PropertyGallery
          coverImage={development.coverImage}
          gallery={development.gallery}
          title={development.name}
        />

        <PropertyVideos videos={development.videos} title={development.name} />

        {/* Grade Principal de Conteúdo e Conversão */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Coluna Esquerda: Especificações, Descrição e Diferenciais */}
          <div className="lg:col-span-8 space-y-10">
            {/* Grid de Especificações Rápidas (Só aparece se houver especificações) */}
            {(Boolean(development.areaRange && (development.areaRange[0] > 0 || development.areaRange[1] > 0)) ||
              Boolean(development.bedroomsRange && (development.bedroomsRange[0] > 0 || development.bedroomsRange[1] > 0)) ||
              Boolean(development.suitesRange && (development.suitesRange[0] > 0 || development.suitesRange[1] > 0)) ||
              Boolean(development.parkingRange && (development.parkingRange[0] > 0 || development.parkingRange[1] > 0)) ||
              Boolean(development.distanceToSea && development.distanceToSea.trim() !== "") ||
              Boolean(development.deliveryDate && development.deliveryDate.trim() !== "")) && (
              <div className="rounded-sm border border-areia/60 bg-white p-6 shadow-xs">
                <h3 className="text-xs uppercase tracking-[0.15em] text-terracota font-semibold mb-4">
                  Visão Geral do Imóvel
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                  {development.areaRange && (development.areaRange[0] > 0 || development.areaRange[1] > 0) && (
                    <div className="flex items-start gap-3">
                      <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                        <Ruler className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs text-graphite/50 block">Área Privativa</span>
                        <strong className="text-graphite font-medium text-sm md:text-base">
                          {development.areaRange[0] === development.areaRange[1]
                            ? `${development.areaRange[0]} m²`
                            : `${development.areaRange[0]} a ${development.areaRange[1]} m²`}
                        </strong>
                      </div>
                    </div>
                  )}

                  {development.bedroomsRange && (development.bedroomsRange[0] > 0 || development.bedroomsRange[1] > 0) && (
                    <div className="flex items-start gap-3">
                      <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                        <BedDouble className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs text-graphite/50 block">Dormitórios</span>
                        <strong className="text-graphite font-medium text-sm md:text-base">
                          {development.bedroomsRange[0] === development.bedroomsRange[1]
                            ? `${development.bedroomsRange[0]} dorms.`
                            : `${development.bedroomsRange[0]} a ${development.bedroomsRange[1]} dorms.`}
                        </strong>
                      </div>
                    </div>
                  )}

                  {development.suitesRange && (development.suitesRange[0] > 0 || development.suitesRange[1] > 0) && (
                    <div className="flex items-start gap-3">
                      <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                        <Bath className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs text-graphite/50 block">Suítes</span>
                        <strong className="text-graphite font-medium text-sm md:text-base">
                          {development.suitesRange[0] === development.suitesRange[1]
                            ? `${development.suitesRange[0]} suítes`
                            : `${development.suitesRange[0]} a ${development.suitesRange[1]} suítes`}
                        </strong>
                      </div>
                    </div>
                  )}

                  {development.parkingRange && (development.parkingRange[0] > 0 || development.parkingRange[1] > 0) && (
                    <div className="flex items-start gap-3">
                      <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                        <Car className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs text-graphite/50 block">Vagas de Garagem</span>
                        <strong className="text-graphite font-medium text-sm md:text-base">
                          {development.parkingRange[0] === development.parkingRange[1]
                            ? `${development.parkingRange[0]} vagas`
                            : `${development.parkingRange[0]} a ${development.parkingRange[1]} vagas`}
                        </strong>
                      </div>
                    </div>
                  )}

                  {development.leisureArea && development.leisureArea > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                        <Palmtree className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs text-graphite/50 block">Área de Lazer</span>
                        <strong className="text-graphite font-medium text-sm md:text-base">
                          {development.leisureArea} m²
                        </strong>
                      </div>
                    </div>
                  )}

                  {development.distanceToSea && development.distanceToSea.trim() !== "" && (
                    <div className="flex items-start gap-3">
                      <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                        <Waves className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs text-graphite/50 block">Proximidade do Mar</span>
                        <strong className="text-graphite font-medium text-sm md:text-base">
                          {development.distanceToSea}
                        </strong>
                      </div>
                    </div>
                  )}

                  {development.deliveryDate && development.deliveryDate.trim() !== "" && (
                    <div className="flex items-start gap-3">
                      <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs text-graphite/50 block">Previsão de Entrega</span>
                        <strong className="text-graphite font-medium text-sm md:text-base">
                          {development.deliveryDate}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Descrição Editorial (Opcional) */}
            {(development.description || development.shortDescription) && (
              <div className="prose max-w-none rounded-sm border border-areia/60 bg-white p-6 shadow-xs">
                <h2 className="font-display text-2xl text-graphite mb-4">Sobre o Empreendimento</h2>
                <div className="text-graphite/80 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-3">
                  {development.description || development.shortDescription}
                </div>
              </div>
            )}

            {/* Destaques de Lazer e Infraestrutura (Opcional - exibe apenas se houver itens) */}
            {development.features && development.features.length > 0 && (
              <div className="border-t border-areia/40 pt-8">
                <h3 className="font-display text-xl text-graphite mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-terracota" />
                  Diferenciais e Infraestrutura
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-graphite/80">
                  {development.features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <CheckCircle className="h-4 w-4 text-mineral shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Informações Construtivas / Construtora */}
            {development.builder && (
              <div className="border-t border-areia/40 pt-8 flex items-center gap-4 bg-offwhite/50 p-5 rounded-xs border border-areia/60">
                <Building2 className="h-8 w-8 text-mineral shrink-0" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-graphite/50 block font-semibold">
                    Realização & Construção
                  </span>
                  <strong className="text-graphite text-base">{development.builder}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Coluna Direita: Card de Lead e Atendimento Sticky */}
          <div className="lg:col-span-4">
            <LeadContactCard
              title={development.name}
              slug={development.slug}
              price={development.priceFrom}
              interest={development.city}
              entityType="development"
              pricePrefix="A partir de"
            />
          </div>
        </div>
      </Container>

      {/* Imóveis Similares */}
      <div className="mt-16">
        <SimilarProperties items={similarItems} />
      </div>
    </main>
  );
}
