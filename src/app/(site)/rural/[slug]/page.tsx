import { RuralPropertyDetailView } from "@/components/property/RuralPropertyDetailView";
import { mockRuralProperties, getRuralPropertyBySlug } from "@/lib/mock/rural";
import { ruralActivityLabels } from "@/lib/labels";
import type { Metadata } from "next";

export function generateStaticParams() {
  return mockRuralProperties.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prop = getRuralPropertyBySlug(slug);

  if (!prop) return { title: "Propriedade Rural | MONARQ" };

  const activities = prop.activity.map((a) => ruralActivityLabels[a]).join(", ");

  return {
    title: `${prop.title} (${prop.totalHectares.toLocaleString("pt-BR")} ha) - ${prop.municipality}/${prop.state}`,
    description: `Fazenda à venda com ${prop.totalHectares.toLocaleString("pt-BR")} hectares em ${prop.municipality}/${prop.state}. Aptidão: ${activities}. Ref: ${prop.code}.`,
    openGraph: {
      title: `${prop.title} | ${prop.municipality} - ${prop.state}`,
      description: `Propriedade rural com ${prop.totalHectares.toLocaleString("pt-BR")} ha para ${activities}.`,
      images: [
        {
          url: prop.coverImage.url,
          alt: prop.coverImage.alt || prop.title,
        },
      ],
    },
  };
}

export default async function RuralPropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getRuralPropertyBySlug(slug);

  return (
    <RuralPropertyDetailView
      initialSlug={slug}
      initialProperty={property}
    />
  );
}
