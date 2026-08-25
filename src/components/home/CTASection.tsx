import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { mockImages } from "@/lib/mock/images";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-graphite py-28">
      <Image
        src={mockImages.livingRoom3}
        alt="Interior contemporâneo de alto padrão"
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-areia">
          Atendimento consultivo
        </span>
        <h2 className="font-display text-balance max-w-2xl text-3xl font-normal leading-tight text-offwhite md:text-4xl">
          Pronto para encontrar a oportunidade certa para o seu patrimônio?
        </h2>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <ButtonLink href="/contato" variant="primary">
            Falar com um especialista
          </ButtonLink>
          <ButtonLink href="/venda-seu-imovel" variant="outline-light">
            Quero vender meu imóvel
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
