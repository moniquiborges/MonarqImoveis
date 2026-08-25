import type { BlogPost } from "@/types";
import { mockImages } from "./images";

/** MOCK — conteúdo editorial de demonstração. */
export const mockBlogPosts: BlogPost[] = [
  {
    slug: "por-que-investir-no-litoral-catarinense",
    title: "Por que investir no litoral catarinense em 2026",
    excerpt: "Panorama de valorização, oferta e demanda em Porto Belo, Itapema e Balneário Camboriú.",
    category: "Mercado imobiliário",
    coverImage: { url: mockImages.beachAerial, alt: "Litoral catarinense visto do alto" },
    publishedAt: "2026-02-10",
  },
  {
    slug: "campo-grande-crescimento-imobiliario",
    title: "Campo Grande: o crescimento imobiliário do Centro-Oeste",
    excerpt: "Os bairros que mais valorizam e o perfil de comprador que impulsiona o mercado local.",
    category: "Campo Grande",
    coverImage: { url: mockImages.urbanBuilding2, alt: "Vista urbana de Campo Grande" },
    publishedAt: "2026-01-22",
  },
  {
    slug: "guia-compra-propriedade-rural",
    title: "Guia essencial para comprar uma propriedade rural",
    excerpt: "Documentação, georreferenciamento e o que avaliar antes de investir em terra produtiva.",
    category: "Mercado rural",
    coverImage: { url: mockImages.ruralLandscape2, alt: "Propriedade rural produtiva" },
    publishedAt: "2026-01-05",
  },
];
