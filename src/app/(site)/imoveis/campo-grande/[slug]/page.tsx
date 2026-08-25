import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { LeadContactCard } from "@/components/property/LeadContactCard";
import { SimilarProperties } from "@/components/property/SimilarProperties";
import { urbanPropertyToCard } from "@/components/property/adapters";
import { mockUrbanProperties, getUrbanPropertyBySlug } from "@/lib/mock/properties";
import { formatArea } from "@/lib/utils";
import {
  BedDouble,
  Bath,
  Car,
  Ruler,
  MapPin,
  ShieldCheck,
  CheckCircle,
  Home,
} from "lucide-react";
import type { Metadata } from "next";

export function generateStaticParams() {
  return mockUrbanProperties.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prop = getUrbanPropertyBySlug(slug);

  if (!prop) return {};

  return {
    title: `${prop.title} - ${prop.neighborhood}, Campo Grande`,
    description: `${prop.type} com ${prop.bedrooms} dorms, ${prop.suites} suítes e ${prop.parking} vagas no bairro ${prop.neighborhood}, Campo Grande/MS. Ref: ${prop.code}.`,
    openGraph: {
      title: `${prop.title} | MONARQ Campo Grande`,
      description: `${prop.type} no bairro ${prop.neighborhood} - ${formatArea(prop.area)}.`,
      images: [
        {
          url: prop.coverImage.url,
          alt: prop.coverImage.alt || prop.title,
        },
      ],
    },
  };
}

export default async function UrbanPropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getUrbanPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  // Imóveis similares em Campo Grande
  const similarItems = mockUrbanProperties
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
            {property.badges.map((b) => (
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
                    <span className="text-xs text-graphite/50 block">Suítes</span>
                    <strong className="text-graphite font-medium text-sm md:text-base">
                      {property.suites} suítes
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

            {/* Descrição Detalhada */}
            <div className="prose max-w-none">
              <h2 className="font-display text-2xl text-graphite mb-4">Apresentação do Imóvel</h2>
              <p className="text-graphite/80 leading-relaxed text-base">
                Excelente oportunidade residencial localizada no coração do bairro {property.neighborhood},
                uma das regiões mais nobres e desejadas de Campo Grande/MS.
              </p>
              <p className="mt-4 text-graphite/80 leading-relaxed text-sm">
                Imóvel com planta inteligente e excelente ventilação cruzada. Conta com acabamentos de primeira
                linha, ampla área social integrada, marcenaria planejada em pontos estratégicos e total segurança
                para você e sua família.
              </p>
            </div>

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
