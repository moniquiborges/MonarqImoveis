import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { mockImages } from "@/lib/mock/images";

const pillars = [
  "Construímos. Avaliamos. Vendemos. Regularizamos.",
  "Apoio Jurídico Especializado.",
  "Inteligência de mercado. Patrimônio que permanece.",
];

export function AboutSection() {
  return (
    <section className="bg-areia/25 py-24">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="Sobre a MONARQ"
            title="Curadoria imobiliária com visão de investimento"
            description="A MONARQ atua com inteligência de mercado e uma abordagem consultiva para conectar clientes a oportunidades imobiliárias criteriosamente selecionadas. Nossa atuação reúne imóveis, empreendimentos, investimentos, avaliação, regularização e propriedades rurais, com presença estratégica entre Santa Catarina, Mato Grosso do Sul e Mato Grosso."
          />

          <ul className="flex flex-col gap-2 border-l border-terracota/40 pl-4">
            {pillars.map((pillar) => (
              <li key={pillar} className="text-[13px] italic leading-relaxed text-graphite/70">
                {pillar}
              </li>
            ))}
          </ul>

          <ButtonLink href="/sobre" variant="secondary" className="w-fit">
            Conhecer a MONARQ
          </ButtonLink>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
          <Image
            src={mockImages.houseExterior3}
            alt="Arquitetura contemporânea representando a curadoria MONARQ"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
