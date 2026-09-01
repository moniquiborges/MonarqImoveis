import { BedDouble, Bath, Car, Ruler, LandPlot } from "lucide-react";
import type { Development, RuralProperty, UrbanProperty } from "@/types";
import { ruralActivityLabels } from "@/lib/labels";
import { formatArea } from "@/lib/utils";
import type { PropertyCardProps } from "./PropertyCard";

export function developmentToCard(dev: Development): PropertyCardProps {
  const specs = [];
  if (dev.bedroomsRange && (dev.bedroomsRange[0] > 0 || dev.bedroomsRange[1] > 0)) {
    const label =
      dev.bedroomsRange[0] === dev.bedroomsRange[1]
        ? `${dev.bedroomsRange[0]} dorm.`
        : `${dev.bedroomsRange[0]}–${dev.bedroomsRange[1]} dorm.`;
    specs.push({ icon: BedDouble, label });
  }
  if (dev.areaRange && (dev.areaRange[0] > 0 || dev.areaRange[1] > 0)) {
    const label =
      dev.areaRange[0] === dev.areaRange[1]
        ? `${dev.areaRange[0]} m²`
        : `${dev.areaRange[0]}–${dev.areaRange[1]} m²`;
    specs.push({ icon: Ruler, label });
  }

  return {
    href: `/empreendimentos/${dev.city}/${dev.slug}`,
    image: dev.coverImage,
    badges: dev.badges,
    title: dev.name,
    location: `${dev.neighborhood ? `${dev.neighborhood}, ` : ""}${dev.cityLabel}`,
    price: dev.priceFrom ?? null,
    specs,
  };
}

export function urbanPropertyToCard(property: UrbanProperty): PropertyCardProps {
  const specs = [];
  if (property.bedrooms && property.bedrooms > 0) {
    specs.push({ icon: BedDouble, label: `${property.bedrooms} dorm.` });
  }
  if (property.suites && property.suites > 0) {
    specs.push({ icon: Bath, label: `${property.suites} banheiros` });
  }
  if (property.parking && property.parking > 0) {
    specs.push({ icon: Car, label: `${property.parking} vagas` });
  }
  if (property.area && property.area > 0) {
    specs.push({ icon: Ruler, label: formatArea(property.area) });
  }

  return {
    href: `/imoveis/campo-grande/${property.slug}`,
    image: property.coverImage,
    badges: property.badges,
    title: property.title,
    location: `${property.neighborhood}, ${property.city}`,
    price: property.price,
    code: property.code,
    specs,
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
