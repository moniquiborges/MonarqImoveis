"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { PropertyCard } from "@/components/property/PropertyCard";
import { urbanPropertyToCard } from "@/components/property/adapters";
import { mockUrbanProperties } from "@/lib/mock/properties";
import { mockImages } from "@/lib/mock/images";
import { getStoredUrbanProperties, useLiveStoredData } from "@/lib/storage";
import type { UrbanProperty } from "@/types";
import type { HomeBanner } from "@/lib/services/bannerService";

interface CampoGrandeSectionProps {
  banner?: HomeBanner;
}

export function CampoGrandeSection({ banner }: CampoGrandeSectionProps) {
  const [properties] = useLiveStoredData<UrbanProperty[]>(
    getStoredUrbanProperties,
    mockUrbanProperties,
    "urban"
  );

  return (
    <section className="py-24">
      <Container className="flex flex-col gap-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src={banner?.imageUrl || mockImages.urbanBuilding1}
              alt={banner?.title || "Imóvel de alto padrão em Campo Grande"}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="Mato Grosso do Sul"
              title={banner?.title || "Oportunidades urbanas em Campo Grande"}
              description={
                banner?.subtitle ||
                "Apartamentos, casas, condomínios fechados e imóveis comerciais em uma das capitais que mais crescem no Centro-Oeste."
              }
            />
            <ButtonLink href={banner?.ctaLink || "/imoveis/campo-grande"} variant="secondary" className="w-fit">
              {banner?.ctaText || "Ver imóveis em Campo Grande"}
            </ButtonLink>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.slug} {...urbanPropertyToCard(property)} />
          ))}
        </div>
      </Container>
    </section>
  );
}
