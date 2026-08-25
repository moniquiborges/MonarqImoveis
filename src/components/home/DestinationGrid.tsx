import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { mockImages } from "@/lib/mock/images";

const destinations = [
  {
    city: "Porto Belo",
    href: "/empreendimentos/porto-belo",
    image: mockImages.beachAerial,
    description: "Litoral preservado e crescimento imobiliário acelerado.",
  },
  {
    city: "Itapema",
    href: "/empreendimentos/itapema",
    image: mockImages.beach2,
    description: "Verticalização premium e alta liquidez de mercado.",
  },
  {
    city: "Balneário Camboriú",
    href: "/empreendimentos/balneario-camboriu",
    image: mockImages.houseExterior1,
    description: "O epicentro do alto padrão em Santa Catarina.",
  },
];

export function DestinationGrid() {
  return (
    <section className="py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Litoral catarinense"
          title="Navegue por destino"
          description="Três praças estratégicas, cada uma com um perfil de investimento distinto."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {destinations.map((dest) => (
            <Link
              key={dest.city}
              href={dest.href}
              className="focus-ring group relative flex h-[420px] flex-col justify-end overflow-hidden rounded-sm"
            >
              <Image
                src={dest.image}
                alt={`Vista de ${dest.city}`}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite/85 via-graphite/10 to-transparent" />
              <div className="relative flex flex-col gap-2 p-6">
                <span className="flex items-center gap-2 font-display text-2xl text-offwhite">
                  {dest.city}
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
                <p className="text-[13px] text-offwhite/75">{dest.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
