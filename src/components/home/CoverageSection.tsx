import { Building2, ClipboardCheck, Home, LandPlot, Scale, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const regions = [
  {
    state: "Santa Catarina",
    detail: "Porto Belo · Itapema · Balneário Camboriú",
  },
  {
    state: "Mato Grosso do Sul",
    detail: "Campo Grande",
  },
  {
    state: "Mercado Rural — MS e MT",
    detail: "Fazendas, sítios e propriedades produtivas",
  },
];

const practiceAreas = [
  { icon: Home, label: "Imóveis" },
  { icon: Building2, label: "Empreendimentos" },
  { icon: TrendingUp, label: "Investimentos imobiliários" },
  { icon: LandPlot, label: "Propriedades rurais" },
  { icon: ClipboardCheck, label: "Avaliação e regularização" },
  { icon: Scale, label: "Apoio jurídico especializado" },
];

export function CoverageSection() {
  return (
    <section className="border-y border-graphite/8 bg-offwhite py-24">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Atuação MONARQ"
          title="Presença estratégica em 3 estados"
          description="Curadoria imobiliária concentrada em praças de alto potencial, do litoral catarinense ao interior produtivo do Centro-Oeste."
        />

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-graphite/10 md:grid-cols-3">
          {regions.map((region) => (
            <div key={region.state} className="flex flex-col gap-2 bg-offwhite p-8">
              <span className="font-display text-xl text-mineral">{region.state}</span>
              <span className="text-[14px] leading-relaxed text-graphite/65">{region.detail}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-graphite/10 sm:grid-cols-3 lg:grid-cols-6">
          {practiceAreas.map((area) => (
            <div
              key={area.label}
              className="flex flex-col items-center gap-3 bg-offwhite px-4 py-8 text-center"
            >
              <area.icon className="h-6 w-6 text-terracota" strokeWidth={1.5} />
              <span className="text-[13px] leading-snug text-graphite/75">{area.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
