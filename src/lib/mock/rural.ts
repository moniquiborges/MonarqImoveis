import type { RuralProperty } from "@/types";
import { mockImages } from "./images";

/** MOCK — propriedades rurais de demonstração (MS/MT). */
export const mockRuralProperties: RuralProperty[] = [
  {
    slug: "fazenda-boa-vista-ms",
    code: "MRQ-R201",
    title: "Fazenda Boa Vista",
    state: "MS",
    municipality: "Ribas do Rio Pardo",
    totalHectares: 1240,
    activity: ["venda", "pecuaria", "investimento"],
    price: 18500000,
    pricePerHectare: 14919,
    badges: ["oportunidade"],
    coverImage: { url: mockImages.ruralLandscape1, alt: "Vista aérea da Fazenda Boa Vista" },
    gallery: [{ url: mockImages.farmField, alt: "Pastagem da fazenda" }],
  },
  {
    slug: "fazenda-santa-luzia-mt",
    code: "MRQ-R202",
    title: "Fazenda Santa Luzia",
    state: "MT",
    municipality: "Rondonópolis",
    totalHectares: 2860,
    activity: ["venda", "agricultura"],
    price: 47000000,
    pricePerHectare: 16434,
    badges: ["exclusivo", "alto-padrao"],
    coverImage: { url: mockImages.ruralLandscape2, alt: "Área de lavoura da Fazenda Santa Luzia" },
    gallery: [{ url: mockImages.farmField, alt: "Plantação da fazenda" }],
  },
  {
    slug: "arrendamento-fazenda-pioneira-ms",
    code: "MRQ-R203",
    title: "Fazenda Pioneira (Arrendamento Agrícola)",
    state: "MS",
    municipality: "Maracaju",
    totalHectares: 1800,
    activity: ["arrendamento", "agricultura"],
    price: null,
    pricePerHectare: undefined,
    badges: ["oportunidade", "exclusivo"],
    coverImage: { url: mockImages.farmField, alt: "Lavoura de soja para arrendamento em Maracaju" },
    gallery: [{ url: mockImages.ruralLandscape1, alt: "Solo corrigido e infraestrutura" }],
  },
];

export function getRuralPropertyBySlug(slug: string) {
  return mockRuralProperties.find((p) => p.slug === slug);
}
