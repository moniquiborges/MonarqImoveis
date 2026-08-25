import type { UrbanProperty } from "@/types";
import { mockImages } from "./images";

/** MOCK — imóveis de demonstração em Campo Grande/MS. */
export const mockUrbanProperties: UrbanProperty[] = [
  {
    slug: "cobertura-jardim-dos-estados",
    code: "MRQ-U101",
    title: "Cobertura duplex no Jardim dos Estados",
    type: "Cobertura",
    neighborhood: "Jardim dos Estados",
    city: "Campo Grande",
    price: 1890000,
    bedrooms: 4,
    suites: 3,
    parking: 3,
    area: 320,
    badges: ["alto-padrao", "exclusivo"],
    coverImage: { url: mockImages.urbanBuilding1, alt: "Fachada do edifício no Jardim dos Estados" },
    gallery: [{ url: mockImages.livingRoom2, alt: "Living da cobertura" }],
  },
  {
    slug: "casa-condominio-alphaville-cg",
    code: "MRQ-U102",
    title: "Casa em condomínio fechado",
    type: "Casa em condomínio",
    neighborhood: "Alphaville Campo Grande",
    city: "Campo Grande",
    price: 1250000,
    bedrooms: 3,
    suites: 2,
    parking: 4,
    area: 280,
    badges: ["novo"],
    coverImage: { url: mockImages.houseExterior3, alt: "Casa em condomínio fechado" },
    gallery: [{ url: mockImages.kitchen1, alt: "Cozinha da casa" }],
  },
  {
    slug: "apartamento-centro-cg",
    code: "MRQ-U103",
    title: "Apartamento 3 suítes no Centro",
    type: "Apartamento",
    neighborhood: "Centro",
    city: "Campo Grande",
    price: 690000,
    bedrooms: 3,
    suites: 3,
    parking: 2,
    area: 118,
    badges: ["oportunidade"],
    coverImage: { url: mockImages.urbanBuilding2, alt: "Edifício residencial no Centro de Campo Grande" },
    gallery: [{ url: mockImages.bedroom1, alt: "Suíte do apartamento" }],
  },
];

export function getUrbanPropertyBySlug(slug: string) {
  return mockUrbanProperties.find((p) => p.slug === slug);
}
