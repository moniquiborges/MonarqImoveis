import { DevelopmentDetailView } from "@/components/property/DevelopmentDetailView";
import { mockDevelopments } from "@/lib/mock/developments";
import { fetchDevelopmentBySlug } from "@/lib/services/propertyService";
import type { Metadata } from "next";

export const dynamicParams = true;

export function generateStaticParams() {
  return mockDevelopments.map((dev) => ({
    city: dev.city,
    slug: dev.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dev = await fetchDevelopmentBySlug(slug);

  if (!dev) return { title: "Empreendimento | MONARQ" };

  return {
    title: `${dev.name} em ${dev.cityLabel}`,
    description: dev.shortDescription,
    openGraph: {
      title: `${dev.name} | ${dev.cityLabel} - MONARQ`,
      description: dev.shortDescription,
      images: [
        {
          url: dev.coverImage.url,
          alt: dev.coverImage.alt || dev.name,
        },
      ],
    },
  };
}

export default async function DevelopmentDetailPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city, slug } = await params;
  const development = await fetchDevelopmentBySlug(slug);

  return (
    <DevelopmentDetailView
      initialCity={city}
      initialSlug={slug}
      initialDevelopment={development}
    />
  );
}
