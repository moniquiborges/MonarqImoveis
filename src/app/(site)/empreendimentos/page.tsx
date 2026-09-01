import { fetchDevelopments } from "@/lib/services/propertyService";
import { DevelopmentCatalogView } from "@/components/property/DevelopmentCatalogView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Empreendimentos em Santa Catarina | MONARQ Imóveis",
  description:
    "Lançamentos e empreendimentos de alto padrão em Porto Belo, Itapema e Balneário Camboriú, SC.",
};

export default async function EmpreendimentosPage() {
  const developments = await fetchDevelopments();

  return <DevelopmentCatalogView initialDevelopments={developments} initialCityFilter="all" />;
}
