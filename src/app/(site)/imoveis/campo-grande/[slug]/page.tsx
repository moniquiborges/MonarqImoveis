import { UrbanPropertyDetailView } from "@/components/property/UrbanPropertyDetailView";
import { mockUrbanProperties, getUrbanPropertyBySlug } from "@/lib/mock/properties";
import { formatArea } from "@/lib/utils";
import type { Metadata } from "next";

export function generateStaticParams() {
  return mockUrbanProperties.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prop = getUrbanPropertyBySlug(slug);

  if (!prop) return { title: "Imóvel | MONARQ" };

  return {
    title: `${prop.title} - ${prop.neighborhood}, Campo Grande`,
    description: `${prop.type} com ${prop.bedrooms} dorms, ${prop.suites} suítes e ${prop.parking} vagas no bairro ${prop.neighborhood}, Campo Grande/MS. Ref: ${prop.code}.`,
    openGraph: {
      title: `${prop.title} | MONARQ Campo Grande`,
      description: `${prop.type} no bairro ${prop.neighborhood} - ${formatArea(prop.area)}.`,
      images: [
        {
          url: prop.coverImage.url,
          alt: prop.coverImage.alt || prop.title,
        },
      ],
    },
  };
}

export default async function UrbanPropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getUrbanPropertyBySlug(slug);

  return (
    <UrbanPropertyDetailView
      initialSlug={slug}
      initialProperty={property}
    />
  );
}
