import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { mockImages } from "@/lib/mock/images";
import {
  Building,
  Scale,
  BadgePercent,
  FileCheck2,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

export default function SobrePage() {
  return (
    <main className="py-8 md:py-16">
      <Container>
        {/* Trilha de Navegação */}
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Sobre a MONARQ" },
          ]}
        />

        {/* Hero Institucional */}
        <section className="mb-16 md:mb-24 mt-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold">
                Manifesto &amp; Posicionamento
              </p>
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-mineral font-normal tracking-tight leading-tight">
                Patrimônio que permanece. Inteligência de mercado.
              </h1>
              <p className="text-base md:text-lg text-graphite/80 leading-relaxed">
                A <strong>MONARQ Imóveis &amp; Investimentos</strong> nasceu para transformar a experiência
                imobiliária de alto padrão em uma jornada de precisão técnica, segurança jurídica e visão estratégica
                de longo prazo.
              </p>
              <div className="border-l-2 border-terracota pl-4 text-sm md:text-base italic text-graphite/70">
                &ldquo;Construímos. Avaliamos. Vendemos. Regularizamos.&rdquo;
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-lg">
                <Image
                  src={mockImages.modernHouse}
                  alt="Sede e arquitetura contemporânea MONARQ"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden sm:block rounded-sm bg-mineral p-6 text-offwhite shadow-xl max-w-[240px]">
                <span className="font-display text-2xl font-semibold text-areia block">3 Polos</span>
                <span className="text-xs text-offwhite/80 leading-snug block mt-1">
                  Atuação estratégica em SC, Campo Grande e Agronegócio Centro-Oeste
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Os 4 Pilares da MONARQ */}
        <section className="mb-20 md:mb-28 border-t border-areia/40 pt-16">
          <div className="max-w-2xl mb-12">
            <p className="text-xs uppercase tracking-[0.15em] text-terracota font-semibold mb-2">
              Estrutura de Atuação
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-mineral">
              Os 4 Pilares Fundamentais
            </h2>
            <p className="mt-3 text-sm md:text-base text-graphite/70">
              Uma abordagem 360° que acompanha o ciclo de vida completo do imóvel e do investimento patrimonial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Pilar 1: Construção */}
            <div className="rounded-sm border border-areia/60 bg-white p-8 shadow-xs hover:border-mineral/40 transition-colors">
              <div className="mb-5 inline-flex rounded-xs bg-offwhite p-3 text-mineral border border-areia/40">
                <Building className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl text-graphite font-medium mb-2">
                1. Construção &amp; Incorporação
              </h3>
              <p className="text-sm text-graphite/70 leading-relaxed">
                Desenvolvimento de projetos residenciais e comerciais com rigor construtivo, eficiência
                termoacústica, acabamentos nobres e integração com o entorno urbano e natural.
              </p>
            </div>

            {/* Pilar 2: Avaliação */}
            <div className="rounded-sm border border-areia/60 bg-white p-8 shadow-xs hover:border-mineral/40 transition-colors">
              <div className="mb-5 inline-flex rounded-xs bg-offwhite p-3 text-mineral border border-areia/40">
                <Scale className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl text-graphite font-medium mb-2">
                2. Avaliação Mercadológica (PTAM)
              </h3>
              <p className="text-sm text-graphite/70 leading-relaxed">
                Pareceres Técnicos de Avaliação Mercadológica emitidos com rigor científico conforme normas da ABNT
                para suporte a inventários, partilhas, garantias bancárias e decisões de compra/venda.
              </p>
            </div>

            {/* Pilar 3: Venda & Consultoria */}
            <div className="rounded-sm border border-areia/60 bg-white p-8 shadow-xs hover:border-mineral/40 transition-colors">
              <div className="mb-5 inline-flex rounded-xs bg-offwhite p-3 text-mineral border border-areia/40">
                <BadgePercent className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl text-graphite font-medium mb-2">
                3. Vendas &amp; Intermediação Consultiva
              </h3>
              <p className="text-sm text-graphite/70 leading-relaxed">
                Curadoria estrita de compradores qualificados, negociação estratégica e apresentação exclusiva
                de imóveis selecionados no litoral de SC, no mercado urbano e em fazendas produtivas.
              </p>
            </div>

            {/* Pilar 4: Regularização */}
            <div className="rounded-sm border border-areia/60 bg-white p-8 shadow-xs hover:border-mineral/40 transition-colors">
              <div className="mb-5 inline-flex rounded-xs bg-offwhite p-3 text-mineral border border-areia/40">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl text-graphite font-medium mb-2">
                4. Regularização &amp; Assessoria Jurídica
              </h3>
              <p className="text-sm text-graphite/70 leading-relaxed">
                Diagnóstico fundiário completo, retificação de áreas, averbações de benfeitorias, CAR/GEO rural
                e resolução de pendências cartorárias para garantir liquidez e segurança documental plena.
              </p>
            </div>
          </div>
        </section>

        {/* Presença Geográfica Estratégica */}
        <section className="mb-20 md:mb-28 rounded-sm bg-mineral p-8 md:p-14 text-offwhite">
          <div className="max-w-3xl mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-areia font-semibold mb-2">
              Geografia de Oportunidades
            </p>
            <h2 className="font-display text-2xl md:text-4xl text-offwhite font-normal">
              Conectando os polos mais valorizados do país
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-offwhite/20 pt-8">
            <div>
              <div className="flex items-center gap-2 text-areia mb-3">
                <MapPin className="h-5 w-5" />
                <h4 className="font-display text-lg font-medium text-offwhite">Litoral Catarinense</h4>
              </div>
              <p className="text-xs md:text-sm text-offwhite/80 leading-relaxed">
                Porto Belo, Itapema e Balneário Camboriú. Foco em rentabilidade sobre o capital investido,
                lançamentos de renome internacional e imóveis com vista para o mar.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-areia mb-3">
                <MapPin className="h-5 w-5" />
                <h4 className="font-display text-lg font-medium text-offwhite">Campo Grande (MS)</h4>
              </div>
              <p className="text-xs md:text-sm text-offwhite/80 leading-relaxed">
                Casas em condomínio, coberturas e apartamentos nos endereços mais nobres da capital sul-mato-grossense,
                com infraestrutura completa e qualidade de vida.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-areia mb-3">
                <MapPin className="h-5 w-5" />
                <h4 className="font-display text-lg font-medium text-offwhite">Agronegócio (MS &amp; MT)</h4>
              </div>
              <p className="text-xs md:text-sm text-offwhite/80 leading-relaxed">
                Grandes extensões para agricultura de alta tecnologia, pecuária intensiva e reservas florestais,
                com assessoria especializada e rigoroso sigilo comercial.
              </p>
            </div>
          </div>
        </section>

        {/* Nossos Princípios */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.15em] text-terracota font-semibold mb-2">
              Valores Inegociáveis
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-graphite">
              A Conduta MONARQ
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xs bg-white border border-areia/60">
              <ShieldCheck className="h-6 w-6 text-mineral mb-3" />
              <h4 className="font-display text-base font-semibold text-graphite mb-1">Sigilo Absoluto</h4>
              <p className="text-xs text-graphite/70">
                Proteção integral de dados patrimoniais e negociações off-market conduzidas com total discrição.
              </p>
            </div>

            <div className="p-6 rounded-xs bg-white border border-areia/60">
              <Award className="h-6 w-6 text-mineral mb-3" />
              <h4 className="font-display text-base font-semibold text-graphite mb-1">Curadoria Estrita</h4>
              <p className="text-xs text-graphite/70">
                Não acumulamos volume; selecionamos apenas ativos com real solidez jurídica e potencial de valorização.
              </p>
            </div>

            <div className="p-6 rounded-xs bg-white border border-areia/60">
              <TrendingUp className="h-6 w-6 text-mineral mb-3" />
              <h4 className="font-display text-base font-semibold text-graphite mb-1">Visão de Investidor</h4>
              <p className="text-xs text-graphite/70">
                Analisamos cada imóvel sob a ótica de liquidez, custo de oportunidade e preservação do capital.
              </p>
            </div>

            <div className="p-6 rounded-xs bg-white border border-areia/60">
              <Users className="h-6 w-6 text-mineral mb-3" />
              <h4 className="font-display text-base font-semibold text-graphite mb-1">Atendimento Pessoal</h4>
              <p className="text-xs text-graphite/70">
                Consultores sêniores dedicados ao acompanhamento contínuo antes, durante e após a escritura.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-areia/20 rounded-sm p-10 md:p-14 border border-areia/50">
          <h3 className="font-display text-2xl md:text-3xl text-mineral mb-3">
            Pronto para conversar sobre seus próximos investimentos?
          </h3>
          <p className="text-sm text-graphite/70 max-w-xl mx-auto mb-6">
            Nossa equipe de diretores e consultores está à disposição para uma reunião confidencial.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ButtonLink href="/contato" variant="primary">
              Entrar em Contato
            </ButtonLink>
            <ButtonLink href="/empreendimentos" variant="secondary">
              Explorar Empreendimentos
            </ButtonLink>
          </div>
        </section>
      </Container>
    </main>
  );
}
