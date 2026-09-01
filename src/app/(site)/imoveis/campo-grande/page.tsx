import { fetchUrbanProperties } from "@/lib/services/propertyService";
import { UrbanCatalogView } from "@/components/property/UrbanCatalogView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Imóveis em Campo Grande | MONARQ Imóveis & Investimentos",
  description:
    "Casas em condomínios fechados (Damha, Alphaville) e apartamentos sofisticados nos bairros nobres de Campo Grande, MS.",
};

export default async function CampoGrandePage() {
  const properties = await fetchUrbanProperties();

  return <UrbanCatalogView initialProperties={properties} />;
}
