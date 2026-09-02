import Image from "next/image";
import Link from "next/link";
import { mockImages } from "@/lib/mock/images";
import { Container } from "@/components/ui/Container";
import { SearchModule } from "./SearchModule";
import type { HomeBanner } from "@/lib/services/bannerService";

interface HeroProps {
  banner?: HomeBanner;
}

export function Hero({ banner }: HeroProps) {
  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-graphite">
      <Image
        src={banner?.imageUrl || mockImages.coastalHouse1}
        alt={banner?.title || "Residência contemporânea frente-mar no litoral catarinense"}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/35 to-graphite/10" />

      <Container className="relative flex flex-col gap-10 pb-16 pt-40">
        <div className="flex max-w-2xl flex-col gap-5 animate-fade-up">
          <span className="text-[12px] font-medium uppercase tracking-[0.25em] text-areia">
            Santa Catarina · Mato Grosso do Sul · Mato Grosso
          </span>
          <h1 className="font-display text-balance text-4xl font-normal leading-[1.08] text-offwhite md:text-5xl lg:text-6xl">
            {banner?.title || "Imóveis que constroem patrimônio."}
          </h1>
          <p className="max-w-xl text-[16px] leading-relaxed text-offwhite/80 md:text-[17px]">
            {banner?.subtitle ||
              "Curadoria imobiliária, investimentos no litoral catarinense e oportunidades urbanas e rurais selecionadas pela MONARQ."}
          </p>
          {banner?.ctaText && banner?.ctaLink && (
            <Link
              href={banner.ctaLink}
              className="focus-ring inline-flex w-fit items-center gap-2 rounded-xs bg-offwhite px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-graphite transition-colors hover:bg-areia"
            >
              {banner.ctaText}
            </Link>
          )}
        </div>

        <SearchModule />
      </Container>
    </section>
  );
}
