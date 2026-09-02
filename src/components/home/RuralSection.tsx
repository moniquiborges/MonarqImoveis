"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LandPlot } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { formatBRL } from "@/lib/utils";
import { mockRuralProperties } from "@/lib/mock/rural";
import { getStoredRuralProperties, useLiveStoredData } from "@/lib/storage";
import type { RuralProperty } from "@/types";
import type { HomeBanner } from "@/lib/services/bannerService";

interface RuralSectionProps {
  banner?: HomeBanner;
}

export function RuralSection({ banner }: RuralSectionProps) {
  const [ruralProperties] = useLiveStoredData<RuralProperty[]>(
    getStoredRuralProperties,
    mockRuralProperties,
    "rural"
  );

  return (
    <section className="bg-mineral py-24 text-offwhite">
      <Container className="flex flex-col gap-12">
        {banner?.imageUrl && (
          <div className="relative aspect-[21/9] overflow-hidden rounded-sm">
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-mineral/90 via-mineral/10 to-transparent" />
          </div>
        )}

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Inteligência rural"
            title={banner?.title || "Oportunidades rurais em MS e MT"}
            description={
              banner?.subtitle ||
              "Fazendas e propriedades rurais com dados técnicos completos para decisões de investimento."
            }
            light
          />
          <ButtonLink href={banner?.ctaLink || "/rural"} variant="outline-light" className="shrink-0">
            {banner?.ctaText || "Ver propriedades rurais"}
          </ButtonLink>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {ruralProperties.map((property) => (
            <Link
              key={property.slug}
              href={`/rural/${property.slug}`}
              className="focus-ring group relative flex h-[340px] flex-col justify-end overflow-hidden rounded-sm"
            >
              <Image
                src={property.coverImage.url}
                alt={property.coverImage.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/30 to-transparent" />
              <div className="relative flex flex-col gap-2 p-6">
                <span className="text-[11px] uppercase tracking-[0.1em] text-areia">
                  {property.municipality}, {property.state}
                </span>
                <span className="flex items-center gap-2 font-display text-2xl">
                  {property.title}
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
                <div className="flex items-center gap-4 text-[13px] text-offwhite/80">
                  <span className="inline-flex items-center gap-1.5">
                    <LandPlot className="h-4 w-4" />
                    {property.totalHectares.toLocaleString("pt-BR")} ha
                  </span>
                  <span>{property.price ? formatBRL(property.price) : "Consulte valores"}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
