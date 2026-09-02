"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { LeadContactCard } from "@/components/property/LeadContactCard";
import { SimilarProperties } from "@/components/property/SimilarProperties";
import { ruralPropertyToCard } from "@/components/property/adapters";
import { mockRuralProperties } from "@/lib/mock/rural";
import { getStoredRuralProperties, useLiveStoredData } from "@/lib/storage";
import { fetchRuralPropertyBySlug } from "@/lib/services/propertyService";
import { ruralActivityLabels } from "@/lib/labels";
import { formatBRL } from "@/lib/utils";
import type { RuralProperty } from "@/types";
import {
  LandPlot,
  Ruler,
  MapPin,
  FileCheck,
  ShieldCheck,
  CheckCircle,
  Sprout,
  Droplets,
  Tractor,
  Compass,
  Loader2,
} from "lucide-react";

interface Props {
  initialSlug: string;
  initialProperty?: RuralProperty;
}

export function RuralPropertyDetailView({ initialSlug, initialProperty }: Props) {
  const [localRuralProperties] = useLiveStoredData<RuralProperty[]>(
    getStoredRuralProperties,
    mockRuralProperties,
    "rural"
  );
  const [dbProperty, setDbProperty] = useState<RuralProperty | null>(null);
  const [loadingDb, setLoadingDb] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchRuralPropertyBySlug(initialSlug).then((prop) => {
      if (isMounted) {
        if (prop) setDbProperty(prop);
        setLoadingDb(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [initialSlug]);

  const property = useMemo(() => {
    return (
      dbProperty ||
      initialProperty ||
      localRuralProperties.find((p) => p.slug === initialSlug)
    );
  }, [dbProperty, initialProperty, localRuralProperties, initialSlug]);

  if (loadingDb && !property) {
    return (
      <main className="py-24 text-center">
        <Container className="flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-mineral" />
          <p className="text-xs uppercase tracking-wider text-graphite/60">
            Carregando propriedade rural...
          </p>
        </Container>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="py-20 text-center">
        <Container>
          <h1 className="font-display text-2xl text-graphite mb-2">
            Propriedade rural não encontrada
          </h1>
          <p className="text-sm text-graphite/60 mb-6">
            O anúncio solicitado pode ter sido atualizado ou o link está incorreto.
          </p>
          <Link
            href="/rural"
            className="inline-flex rounded-xs bg-mineral px-4 py-2 text-xs font-semibold text-offwhite"
          >
            Ver propriedades rurais
          </Link>
        </Container>
      </main>
    );
  }

  const alqueires = (property.totalHectares / 2.42).toFixed(1);

  const similarItems = localRuralProperties
    .filter((p) => p.slug !== property.slug)
    .map(ruralPropertyToCard);

  return (
    <main className="py-6 md:py-10">
      <Container>
        {/* Trilha de Navegação */}
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Propriedades Rurais", href: "/rural" },
            { label: `${property.municipality} - ${property.state}` },
            { label: property.title },
          ]}
        />

        {/* Cabeçalho */}
        <div className="mt-2 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {property.activity.map((act) => (
              <span
                key={act}
                className="rounded-xs bg-mineral/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-mineral"
              >
                {ruralActivityLabels[act]}
              </span>
            ))}
            {property.badges?.map((b) => (
              <Badge key={b} badge={b} />
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
            <div>
              <h1 className="font-display text-3xl md:text-5xl text-graphite font-normal tracking-tight">
                {property.title}
              </h1>
              <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm md:text-base text-graphite/70">
                <MapPin className="h-4 w-4 text-mineral shrink-0" />
                {property.municipality} &mdash; {property.state}
              </p>
            </div>
            <span className="text-xs font-mono text-graphite/50 shrink-0">
              Ref: {property.code}
            </span>
          </div>
        </div>

        {/* Galeria de Fotos */}
        <PropertyGallery
          coverImage={property.coverImage}
          gallery={property.gallery}
          title={property.title}
        />

        {/* Conteúdo Principal e Lead */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Coluna Esquerda: Métricas Agro, Benfeitorias e Solo */}
          <div className="lg:col-span-8 space-y-10">
            {/* Grid de Especificações Rurais */}
            <div className="rounded-sm border border-areia/60 bg-white p-6 shadow-xs">
              <h3 className="text-xs uppercase tracking-[0.15em] text-terracota font-semibold mb-4">
                Ficha Técnica Agropecuária
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                    <LandPlot className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-graphite/50 block">Área Total</span>
                    <strong className="text-graphite font-medium text-sm md:text-base">
                      {property.totalHectares.toLocaleString("pt-BR")} ha
                    </strong>
                    <span className="text-[11px] text-graphite/60 block">~{alqueires} alqueires</span>
                  </div>
                </div>

                {property.pricePerHectare && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                      <Ruler className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs text-graphite/50 block">Valor por Hectare</span>
                      <strong className="text-graphite font-medium text-sm md:text-base">
                        {formatBRL(property.pricePerHectare)} / ha
                      </strong>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-graphite/50 block">Aptidão do Solo</span>
                    <strong className="text-graphite font-medium text-sm md:text-base">
                      {property.activity.map((a) => ruralActivityLabels[a]).join(", ")}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                    <Droplets className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-graphite/50 block">Recursos Hídricos</span>
                    <strong className="text-graphite font-medium text-sm md:text-base">
                      Córrego &amp; Represa
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-graphite/50 block">Documentação</span>
                    <strong className="text-graphite font-medium text-sm md:text-base">
                      CAR &amp; GEO 100% Ok
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-graphite/50 block">Topografia</span>
                    <strong className="text-graphite font-medium text-sm md:text-base">
                      Plana a Suave Ondulada
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Descrição e Aptidão da Fazenda (Opcional) */}
            {property.description && property.description.trim() !== "" && (
              <div className="prose max-w-none rounded-sm border border-areia/60 bg-white p-6 shadow-xs">
                <h2 className="font-display text-2xl text-graphite mb-4">Sobre a Propriedade</h2>
                <div className="text-graphite/80 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-3">
                  {property.description}
                </div>
              </div>
            )}

            {/* Benfeitorias e Estrutura Operacional */}
            {property.features && property.features.length > 0 && (
              <div className="border-t border-areia/40 pt-8">
                <h3 className="font-display text-xl text-graphite mb-4 flex items-center gap-2">
                  <Tractor className="h-5 w-5 text-terracota" />
                  Benfeitorias e Infraestrutura
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-graphite/80">
                  {property.features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <CheckCircle className="h-4 w-4 text-mineral shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sigilo Comercial e Due Diligence */}
            <div className="border-t border-areia/40 pt-8">
              <div className="flex items-start gap-4 rounded-xs bg-mineral/5 p-5 border border-mineral/15">
                <ShieldCheck className="h-6 w-6 text-mineral shrink-0 mt-0.5" />
                <div className="text-xs text-graphite/80">
                  <h4 className="font-semibold text-graphite text-sm mb-1">
                    Atendimento Especializado em Agronegócio &amp; Sigilo
                  </h4>
                  <p>
                    Coordenadas exatas e relatórios detalhados de análise de solo e matrículas imobiliárias
                    são disponibilizados sob assinatura de termo de confidencialidade (NDA).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Lead Card Sticky com contexto Rural */}
          <div className="lg:col-span-4">
            <LeadContactCard
              title={property.title}
              code={property.code}
              slug={property.slug}
              price={property.price}
              interest="rural"
              entityType="rural"
              pricePrefix="Valor da Fazenda"
            />
          </div>
        </div>
      </Container>

      {/* Propriedades Similares */}
      <div className="mt-16">
        <SimilarProperties
          title="Outras Oportunidades no Agronegócio"
          subtitle="Fazendas selecionadas para agricultura, pecuária e expansão patrimonial"
          items={similarItems}
        />
      </div>
    </main>
  );
}
