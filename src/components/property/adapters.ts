import { BedDouble, Bath, Car, Ruler, LandPlot } from "lucide-react";
import type { Development, RuralProperty, UrbanProperty } from "@/types";
import { ruralActivityLabels } from "@/lib/labels";
import { formatArea } from "@/lib/utils";
import type { PropertyCardProps } from "./PropertyCard";

export function developmentToCard(dev: Development): PropertyCardProps {
  return {
    href: `/empreendimentos/${dev.city}/${dev.slug}`,
    image: dev.coverImage,
    badges: dev.badges,
    title: dev.name,
    location: `${dev.neighborhood ? `${dev.neighborhood}, ` : ""}${dev.cityLabel}`,
    price: dev.priceFrom ?? null,
    specs: [
      { icon: BedDouble, label: `${dev.bedroomsRange[0]}–${dev.bedroomsRange[1]} dorm.` },
      { icon: Ruler, label: `${dev.areaRange[0]}–${dev.areaRange[1]} m²` },
    ],
  };
}

export function urbanPropertyToCard(property: UrbanProperty): PropertyCardProps {
  return {
    href: `/imoveis/campo-grande/${property.slug}`,
    image: property.coverImage,
    badges: property.badges,
    title: property.title,
    location: `${property.neighborhood}, ${property.city}`,
    price: property.price,
    code: property.code,
    specs: [
      { icon: BedDouble, label: `${property.bedrooms} dorm.` },
      { icon: Bath, label: `${property.suites} banheiros` },
      { icon: Car, label: `${property.parking} vagas` },
      { icon: Ruler, label: formatArea(property.area) },
    ],
  };
}

export function ruralPropertyToCard(property: RuralProperty): PropertyCardProps {
  return {
    href: `/rural/${property.slug}`,
    image: property.coverImage,
    badges: property.badges,
    title: property.title,
    location: `${property.municipality}, ${property.state}`,
    price: property.price,
    code: property.code,
    specs: [
      { icon: LandPlot, label: `${property.totalHectares.toLocaleString("pt-BR")} ha` },
      {
        icon: Ruler,
        label: property.activity.map((a) => ruralActivityLabels[a]).join(" · "),
      },
    ],
  };
}
