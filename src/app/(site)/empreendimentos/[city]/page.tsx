import { notFound } from "next/navigation";
import { CityEmpreendimentosView } from "@/components/property/CityEmpreendimentosView";
import { fetchDevelopments } from "@/lib/services/propertyService";
import type { ScCity } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const validCities: ScCity[] = ["porto-belo", "itapema", "balneario-camboriu"];

export function generateStaticParams() {
  return validCities.map((city) => ({ city }));
}

export default async function CityEmpreendimentosPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;

  if (!validCities.includes(city as ScCity)) {
    notFound();
  }

  const typedCity = city as ScCity;
  const allDevs = await fetchDevelopments();
  const initialDevelopments = allDevs.filter((d) => d.city === typedCity);

  return (
    <CityEmpreendimentosView
      city={typedCity}
      initialDevelopments={initialDevelopments}
    />
  );
}
