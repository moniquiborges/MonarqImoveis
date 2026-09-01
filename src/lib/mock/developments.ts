import type { Development } from "@/types";
import { mockImages } from "./images";

/**
 * MOCK — dados de demonstração para popular a interface antes do cadastro
 * real via painel /admin. Nomes de construtora/incorporadora são
 * propositalmente omitidos por não haver dado oficial confirmado.
 */
export const mockDevelopments: Development[] = [
  {
    slug: "essenza-porto-belo",
    name: "Essenza Residence",
    city: "porto-belo",
    cityLabel: "Porto Belo",
    neighborhood: "Centro",
    stage: "em-obras",
    deliveryDate: "2027",
    shortDescription:
      "Torre única frente-mar com varandas gourmet e vista privilegiada da Baía de Porto Belo.",
    priceFrom: 980000,
    bedroomsRange: [2, 4],
    suitesRange: [1, 3],
    parkingRange: [1, 2],
    areaRange: [72, 168],
    distanceToSea: "80m do mar",
    badges: ["frente-mar", "em-obras"],
    coverImage: { url: mockImages.coastalHouse1, alt: "Fachada do Essenza Residence em Porto Belo" },
    gallery: [
      { url: mockImages.livingRoom1, alt: "Living integrado" },
      { url: mockImages.poolHouse, alt: "Área de lazer com piscina" },
    ],
    features: [
      "Piscina com Deck Molhado",
      "Espaço Gourmet e Salão de Festas",
      "Academia com Vista Panorâmica",
      "Hall com Pé-Direito Duplo",
      "Fechaduras Biométricas",
      "Vagas para Carro Elétrico",
    ],
  },
  {
    slug: "vista-itapema",
    name: "Vista Itapema Tower",
    city: "itapema",
    cityLabel: "Itapema",
    neighborhood: "Meia Praia",
    stage: "lancamento",
    deliveryDate: "2029",
    shortDescription:
      "Lançamento com studios e apartamentos de alto padrão a poucos passos da Meia Praia.",
    priceFrom: 720000,
    bedroomsRange: [1, 3],
    suitesRange: [1, 2],
    parkingRange: [1, 2],
    areaRange: [45, 120],
    distanceToSea: "300m do mar",
    badges: ["lancamento", "exclusivo"],
    coverImage: { url: mockImages.houseExterior1, alt: "Torre Vista Itapema" },
    gallery: [
      { url: mockImages.kitchen1, alt: "Cozinha e área social" },
      { url: mockImages.livingRoom2, alt: "Living gourmet" },
    ],
    features: [
      "Rooftop com Piscina Infinita",
      "Coworking Integrado",
      "Espaço Fitness",
      "Lavanderia Compartilhada",
    ],
  },
  {
    slug: "alto-camboriu-residence",
    name: "Alto Camboriú Residence",
    city: "balneario-camboriu",
    cityLabel: "Balneário Camboriú",
    neighborhood: "Barra Sul",
    stage: "pronto",
    deliveryDate: "Pronto para morar",
    shortDescription:
      "Apartamentos de altíssimo luxo na Barra Sul com vista panorâmica para toda a orla.",
    priceFrom: 2850000,
    bedroomsRange: [3, 5],
    suitesRange: [3, 5],
    parkingRange: [3, 4],
    areaRange: [140, 310],
    distanceToSea: "Frente-mar",
    badges: ["frente-mar", "pronto"],
    coverImage: { url: mockImages.modernHouse, alt: "Alto Camboriú Residence Barra Sul" },
    gallery: [
      { url: mockImages.livingRoom2, alt: "Living integrado com vista mar" },
      { url: mockImages.houseExterior2, alt: "Fachada contemporânea" },
    ],
    features: [
      "Piscina Aquecida",
      "Spa com Sauna e Hidromassagem",
      "Cinema Privativo",
      "Adega Climatizada",
      "Heliponto Homologado",
    ],
  },
  {
    slug: "reserva-porto-belo",
    name: "Reserva Porto Belo",
    city: "porto-belo",
    cityLabel: "Porto Belo",
    neighborhood: "Perequê",
    stage: "lancamento",
    deliveryDate: "2028",
    shortDescription:
      "Condomínio clube fechado com infraestrutura completa de lazer e contato com a natureza.",
    priceFrom: 850000,
    bedroomsRange: [2, 3],
    suitesRange: [1, 2],
    parkingRange: [1, 2],
    areaRange: [68, 110],
    distanceToSea: "200m do mar",
    badges: ["lancamento", "exclusivo"],
    coverImage: { url: mockImages.houseExterior2, alt: "Reserva Porto Belo" },
    gallery: [
      { url: mockImages.poolHouse, alt: "Piscina e área verde" },
      { url: mockImages.livingRoom1, alt: "Apartamento decorado" },
    ],
    features: [
      "Complexo Aquático",
      "Quadra de Beach Tennis",
      "Pet Place",
      "Trilha Ecológica",
    ],
  },
];

export function getDevelopmentsByCity(city: Development["city"]) {
  return mockDevelopments.filter((d) => d.city === city);
}

export function getDevelopmentBySlug(slug: string) {
  return mockDevelopments.find((d) => d.slug === slug);
}
