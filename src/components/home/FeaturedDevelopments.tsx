"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { PropertyCard } from "@/components/property/PropertyCard";
import { developmentToCard } from "@/components/property/adapters";
import { mockDevelopments } from "@/lib/mock/developments";
import { getStoredDevelopments, useLiveStoredData } from "@/lib/storage";
import type { Development } from "@/types";
import type { HomeBanner } from "@/lib/services/bannerService";

interface FeaturedDevelopmentsProps {
  banner?: HomeBanner;
}

export function FeaturedDevelopments({ banner }: FeaturedDevelopmentsProps) {
  const [developments] = useLiveStoredData<Development[]>(
    getStoredDevelopments,
    mockDevelopments,
    "developments"
  );

  return (
    <section className="bg-areia/25 py-24">
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
          </div>
        )}

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Curadoria MONARQ"
            title={banner?.title || "Empreendimentos selecionados no litoral"}
            description={
              banner?.subtitle ||
              "Uma seleção criteriosa de lançamentos e empreendimentos prontos em Porto Belo, Itapema e Balneário Camboriú."
            }
          />
          <ButtonLink href={banner?.ctaLink || "/empreendimentos"} variant="secondary" className="shrink-0">
            {banner?.ctaText || "Ver todos"}
          </ButtonLink>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {developments.map((dev) => (
            <PropertyCard key={dev.slug} {...developmentToCard(dev)} />
          ))}
        </div>
      </Container>
    </section>
  );
}
