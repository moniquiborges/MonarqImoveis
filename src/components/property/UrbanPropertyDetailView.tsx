"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { LeadContactCard } from "@/components/property/LeadContactCard";
import { SimilarProperties } from "@/components/property/SimilarProperties";
import { urbanPropertyToCard } from "@/components/property/adapters";
import { mockUrbanProperties } from "@/lib/mock/properties";
import { getStoredUrbanProperties, useLiveStoredData } from "@/lib/storage";
import { fetchUrbanProperties, fetchUrbanPropertyBySlug } from "@/lib/services/propertyService";
import { formatArea } from "@/lib/utils";
import type { UrbanProperty } from "@/types";
import {
  BedDouble,
  Bath,
  Car,
  Ruler,
  MapPin,
  ShieldCheck,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface Props {
  initialSlug: string;
  initialProperty?: UrbanProperty;
}

export function UrbanPropertyDetailView({ initialSlug, initialProperty }: Props) {
  const [localProperties] = useLiveStoredData<UrbanProperty[]>(
    getStoredUrbanProperties,
    mockUrbanProperties,
    "urban"
  );
  const [dbProperty, setDbProperty] = useState<UrbanProperty | null>(null);
  const [loadingDb, setLoadingDb] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchUrbanPropertyBySlug(initialSlug).then((prop) => {
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
      localProperties.find((p) => p.slug === initialSlug) ||
      initialProperty
    );
  }, [dbProperty, localProperties, initialSlug, initialProperty]);

  if (loadingDb && !property) {
    return (
      <main className="py-24 text-center">
        <Container className="flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-mineral" />
          <p className="text-xs uppercase tracking-wider text-graphite/60">
            Carregando imóvel...
          </p>
        </Container>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="py-20 text-center">
        <Container>
          <h1 className="font-display text-2xl text-graphite mb-2">Imóvel não encontrado</h1>
          <p className="text-sm text-graphite/60 mb-6">
            O anúncio solicitado pode ter sido atualizado ou o link está incorreto.
          </p>
          <Link
            href="/imoveis/campo-grande"
            className="inline-flex rounded-xs bg-mineral px-4 py-2 text-xs font-semibold text-offwhite"
          >
            Ver imóveis disponíveis
          </Link>
        </Container>
      </main>
    );
  }

  const similarItems = localProperties
    .filter((p) => p.slug !== property.slug)
    .map(urbanPropertyToCard);

  return (
    <main className="py-6 md:py-10">
      <Container>
        {/* Trilha de Navegação */}
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Imóveis", href: "/imoveis/campo-grande" },
            { label: "Campo Grande", href: "/imoveis/campo-grande" },
            { label: property.title },
          ]}
        />

        {/* Cabeçalho */}
        <div className="mt-2 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-xs bg-mineral/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-mineral">
              {property.type}
            </span>
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
                {property.neighborhood}, {property.city} &mdash; MS
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
          {/* Coluna Esquerda: Especificações e Descrição */}
          <div className="lg:col-span-8 space-y-10">
            {/* Grid de Especificações */}
            <div className="rounded-sm border border-areia/60 bg-white p-6 shadow-xs">
              <h3 className="text-xs uppercase tracking-[0.15em] text-terracota font-semibold mb-4">
                Características do Imóvel
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                    <Ruler className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-graphite/50 block">Área Útil</span>
                    <strong className="text-graphite font-medium text-sm md:text-base">
                      {formatArea(property.area)}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                    <BedDouble className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-graphite/50 block">Dormitórios</span>
                    <strong className="text-graphite font-medium text-sm md:text-base">
                      {property.bedrooms} dormitórios
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                    <Bath className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-graphite/50 block">Banheiros</span>
                    <strong className="text-graphite font-medium text-sm md:text-base">
                      {property.suites} banheiros
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-xs bg-offwhite p-2.5 text-mineral border border-areia/40">
                    <Car className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-graphite/50 block">Garagem</span>
                    <strong className="text-graphite font-medium text-sm md:text-base">
                      {property.parking} vagas
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Descrição Detalhada (Opcional - só aparece se foi preenchida no admin) */}
            {property.description && property.description.trim() !== "" && (
              <div className="prose max-w-none rounded-sm border border-areia/60 bg-white p-6 shadow-xs">
                <h2 className="font-display text-2xl text-graphite mb-4">Sobre o Imóvel</h2>
                <div className="text-graphite/80 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-3">
                  {property.description}
                </div>
              </div>
            )}

            {/* Diferenciais e Conveniências */}
            <div className="border-t border-areia/40 pt-8">
              <h3 className="font-display text-xl text-graphite mb-4">Diferenciais e Itens Inclusos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-graphite/80">
                {[
                  "Living com integração para varanda",
                  "Preparação para ar-condicionado Split em todos os ambientes",
                  "Pisos e revestimentos em porcelanato de grande formato",
                  "Banheiros com ventilação natural",
                  "Portaria e monitoramento 24h",
                  "Localização com fácil acesso aos melhores colégios, parques e restaurantes",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-mineral shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessoria Jurídica e Documental */}
            <div className="border-t border-areia/40 pt-8">
              <div className="flex items-start gap-4 rounded-xs bg-mineral/5 p-5 border border-mineral/15">
                <ShieldCheck className="h-6 w-6 text-mineral shrink-0 mt-0.5" />
                <div className="text-xs text-graphite/80">
                  <h4 className="font-semibold text-graphite text-sm mb-1">
                    Assessoria Jurídica e Regularização MONARQ
                  </h4>
                  <p>
                    Todos os imóveis catalogados passam por rigorosa auditoria documental, certidões negativas
                    e suporte completo até a outorga da escritura pública definitiva.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Lead Card Sticky */}
          <div className="lg:col-span-4">
            <LeadContactCard
              title={property.title}
              code={property.code}
              slug={property.slug}
              price={property.price}
              interest="campo-grande"
            />
          </div>
        </div>
      </Container>

      {/* Imóveis Semelhantes */}
      <div className="mt-16">
        <SimilarProperties items={similarItems} />
      </div>
    </main>
  );
}
