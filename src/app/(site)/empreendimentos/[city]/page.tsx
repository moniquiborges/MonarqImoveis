import { notFound } from "next/navigation";
import { CityEmpreendimentosView } from "@/components/property/CityEmpreendimentosView";
import { getDevelopmentsByCity } from "@/lib/mock/developments";
import type { ScCity } from "@/types";

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
  const initialDevelopments = getDevelopmentsByCity(typedCity);

  return (
    <CityEmpreendimentosView
      city={typedCity}
      initialDevelopments={initialDevelopments}
    />
  );
}
