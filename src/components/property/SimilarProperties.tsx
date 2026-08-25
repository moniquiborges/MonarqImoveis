import { Container } from "@/components/ui/Container";
import { PropertyCard, type PropertyCardProps } from "./PropertyCard";

export interface SimilarPropertiesProps {
  title?: string;
  subtitle?: string;
  items: PropertyCardProps[];
}

export function SimilarProperties({
  title = "Oportunidades Semelhantes",
  subtitle = "Seleção curada de imóveis com perfil e localização similares",
  items,
}: SimilarPropertiesProps) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-areia/40 bg-white/40 py-14 md:py-20">
      <Container>
        <div className="mb-10 max-w-xl">
          <p className="text-xs uppercase tracking-[0.15em] text-terracota font-semibold mb-2">
            Recomendações
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-graphite">{title}</h2>
          <p className="mt-2 text-sm text-graphite/70">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {items.slice(0, 3).map((item, idx) => (
            <PropertyCard key={idx} {...item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
