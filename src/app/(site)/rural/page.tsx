import { fetchRuralProperties } from "@/lib/services/propertyService";
import { RuralCatalogView } from "@/components/property/RuralCatalogView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Fazendas e Propriedades Rurais | MONARQ Agronegócio",
  description:
    "Curadoria especializada em propriedades rurais de grande escala para agricultura, pecuária intensiva e ativos florestais em MS e MT.",
};

export default async function RuralPage() {
  const properties = await fetchRuralProperties();

  return <RuralCatalogView initialProperties={properties} />;
}
