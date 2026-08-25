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
      { url: mockImages.livingRoom2, alt: "Sala de estar decorada" },
      { url: mockImages.bedroom1, alt: "Suíte master" },
    ],
  },
  {
    slug: "alto-camboriu-residence",
    name: "Alto Camboriú Residence",
    city: "balneario-camboriu",
    cityLabel: "Balneário Camboriú",
    neighborhood: "Barra Sul",
    stage: "pronto",
    deliveryDate: "Entregue",
    shortDescription:
      "Edifício assinado pronto para morar, com rooftop panorâmico e infraestrutura five-star.",
    priceFrom: 2450000,
    bedroomsRange: [3, 4],
    suitesRange: [2, 4],
    parkingRange: [2, 3],
    areaRange: [140, 310],
    distanceToSea: "Frente-mar",
    badges: ["pronto", "alto-padrao", "frente-mar"],
    coverImage: { url: mockImages.modernHouse, alt: "Alto Camboriú Residence" },
    gallery: [
      { url: mockImages.kitchen1, alt: "Cozinha integrada de alto padrão" },
      { url: mockImages.livingRoom3, alt: "Living com vista para o mar" },
    ],
  },
  {
    slug: "reserva-porto-belo",
    name: "Reserva Porto Belo",
    city: "porto-belo",
    cityLabel: "Porto Belo",
    neighborhood: "Perequê",
    stage: "em-obras",
    deliveryDate: "2026",
    shortDescription:
      "Condomínio boutique com poucas unidades e paisagismo assinado, próximo à Praia de Perequê.",
    priceFrom: 850000,
    bedroomsRange: [2, 3],
    suitesRange: [1, 2],
    parkingRange: [1, 2],
    areaRange: [68, 110],
    distanceToSea: "450m do mar",
    badges: ["em-obras", "oportunidade"],
    coverImage: { url: mockImages.houseExterior2, alt: "Reserva Porto Belo" },
    gallery: [{ url: mockImages.livingRoom1, alt: "Living Reserva Porto Belo" }],
  },
];

export function getDevelopmentsByCity(city: Development["city"]) {
  return mockDevelopments.filter((d) => d.city === city);
}

export function getDevelopmentBySlug(slug: string) {
  return mockDevelopments.find((d) => d.slug === slug);
}
