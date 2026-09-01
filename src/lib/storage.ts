"use client";

import { useEffect, useState, useCallback } from "react";
import { mockUrbanProperties } from "@/lib/mock/properties";
import { mockDevelopments } from "@/lib/mock/developments";
import { mockRuralProperties } from "@/lib/mock/rural";
import { mockBlogPosts } from "@/lib/mock/posts";
import { mockImages } from "@/lib/mock/images";
import type {
  UrbanProperty,
  Development,
  RuralProperty,
  BlogPost,
} from "@/types";

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  location: "hero" | "destaque-sc" | "campo-grande" | "rural";
  locationLabel: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  order: number;
}

export interface UnitItem {
  id: string;
  developmentSlug: string;
  developmentName: string;
  unitNumber: string;
  tower: string;
  floor: number;
  area: number;
  bedrooms: number;
  suites: number;
  parking: number;
  price: number;
  status: "disponivel" | "reservado" | "vendido";
}

export const initialBanners: BannerItem[] = [
  {
    id: "ban-1",
    title: "Curadoria Imobiliária no Litoral Catarinense",
    subtitle: "Lançamentos e coberturas de alto padrão em Porto Belo, Itapema e Balneário Camboriú.",
    location: "hero",
    locationLabel: "Hero Principal (Home)",
    imageUrl: mockImages.coastalHouse1,
    ctaText: "Ver Empreendimentos",
    ctaLink: "/empreendimentos",
    active: true,
    order: 1,
  },
  {
    id: "ban-2",
    title: "Oportunidades Selecionadas em Campo Grande",
    subtitle: "Casas em condomínio fechado e apartamentos nos melhores bairros da capital.",
    location: "campo-grande",
    locationLabel: "Seção Urbana",
    imageUrl: mockImages.modernHouse,
    ctaText: "Ver Imóveis Urbanos",
    ctaLink: "/imoveis/campo-grande",
    active: true,
    order: 2,
  },
  {
    id: "ban-3",
    title: "Terras Produtivas & Inteligência Agrícola",
    subtitle: "Fazendas e propriedades de alta performance em Mato Grosso do Sul e Mato Grosso.",
    location: "rural",
    locationLabel: "Seção Rural",
    imageUrl: mockImages.ruralLandscape1,
    ctaText: "Ver Fazendas",
    ctaLink: "/rural",
    active: true,
    order: 3,
  },
];

export const initialUnits: UnitItem[] = [
  {
    id: "un-101",
    developmentSlug: "essenza-porto-belo",
    developmentName: "Essenza Porto Belo",
    unitNumber: "101",
    tower: "Torre A",
    floor: 1,
    area: 165,
    bedrooms: 3,
    suites: 3,
    parking: 2,
    price: 1890000,
    status: "disponivel",
  },
  {
    id: "un-102",
    developmentSlug: "essenza-porto-belo",
    developmentName: "Essenza Porto Belo",
    unitNumber: "102",
    tower: "Torre A",
    floor: 1,
    area: 198,
    bedrooms: 4,
    suites: 4,
    parking: 3,
    price: 2450000,
    status: "disponivel",
  },
];

const STORAGE_KEYS = {
  urban: "monarq_urban_properties",
  developments: "monarq_developments",
  rural: "monarq_rural_properties",
  posts: "monarq_posts",
  banners: "monarq_banners",
  units: "monarq_units",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/* =========================================================================
   URBAN PROPERTIES (Campo Grande / MS)
   ========================================================================= */
export function getStoredUrbanProperties(): UrbanProperty[] {
  if (!isBrowser()) return mockUrbanProperties;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.urban);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Erro ao ler imóveis urbanos do localStorage:", err);
  }
  return mockUrbanProperties;
}

export function saveStoredUrbanProperties(items: UrbanProperty[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.urban, JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent("monarq_data_change", { detail: { type: "urban" } })
    );
  } catch (err) {
    console.error("Erro ao salvar imóveis urbanos no localStorage:", err);
  }
}

export function getUrbanPropertyBySlugLive(slug: string): UrbanProperty | undefined {
  const items = getStoredUrbanProperties();
  return items.find((p) => p.slug === slug);
}

/* =========================================================================
   DEVELOPMENTS (Litoral SC)
   ========================================================================= */
export function getStoredDevelopments(): Development[] {
  if (!isBrowser()) return mockDevelopments;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.developments);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Erro ao ler empreendimentos do localStorage:", err);
  }
  return mockDevelopments;
}

export function saveStoredDevelopments(items: Development[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.developments, JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent("monarq_data_change", { detail: { type: "developments" } })
    );
  } catch (err) {
    console.error("Erro ao salvar empreendimentos no localStorage:", err);
  }
}

export function getDevelopmentBySlugLive(slug: string): Development | undefined {
  const items = getStoredDevelopments();
  return items.find((d) => d.slug === slug);
}

/* =========================================================================
   RURAL PROPERTIES (MS & MT)
   ========================================================================= */
export function getStoredRuralProperties(): RuralProperty[] {
  if (!isBrowser()) return mockRuralProperties;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.rural);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Erro ao ler propriedades rurais do localStorage:", err);
  }
  return mockRuralProperties;
}

export function saveStoredRuralProperties(items: RuralProperty[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.rural, JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent("monarq_data_change", { detail: { type: "rural" } })
    );
  } catch (err) {
    console.error("Erro ao salvar propriedades rurais no localStorage:", err);
  }
}

export function getRuralPropertyBySlugLive(slug: string): RuralProperty | undefined {
  const items = getStoredRuralProperties();
  return items.find((p) => p.slug === slug);
}

/* =========================================================================
   BLOG POSTS
   ========================================================================= */
export function getStoredPosts(): BlogPost[] {
  if (!isBrowser()) return mockBlogPosts;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.posts);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Erro ao ler posts do blog do localStorage:", err);
  }
  return mockBlogPosts;
}

export function saveStoredPosts(items: BlogPost[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent("monarq_data_change", { detail: { type: "posts" } })
    );
  } catch (err) {
    console.error("Erro ao salvar posts do blog no localStorage:", err);
  }
}

/* =========================================================================
   BANNERS
   ========================================================================= */
export function getStoredBanners(): BannerItem[] {
  if (!isBrowser()) return initialBanners;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.banners);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Erro ao ler banners do localStorage:", err);
  }
  return initialBanners;
}

export function saveStoredBanners(items: BannerItem[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.banners, JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent("monarq_data_change", { detail: { type: "banners" } })
    );
  } catch (err) {
    console.error("Erro ao salvar banners no localStorage:", err);
  }
}

/* =========================================================================
   UNIDADES
   ========================================================================= */
export function getStoredUnits(): UnitItem[] {
  if (!isBrowser()) return initialUnits;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.units);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Erro ao ler unidades do localStorage:", err);
  }
  return initialUnits;
}

export function saveStoredUnits(items: UnitItem[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.units, JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent("monarq_data_change", { detail: { type: "units" } })
    );
  } catch (err) {
    console.error("Erro ao salvar unidades no localStorage:", err);
  }
}

/* =========================================================================
   REACT HOOK PARA SINCRONIZAÇÃO AUTOMÁTICA EM TEMPO REAL
   ========================================================================= */
export function useLiveStoredData<T>(
  getter: () => T,
  initialDefault: T,
  targetType?: string
): [T, (updater: (prev: T) => T) => void] {
  const [data, setData] = useState<T>(initialDefault);

  const refresh = useCallback(() => {
    setData(getter());
  }, [getter]);

  useEffect(() => {
    refresh();

    const handleCustomEvent = (e: Event) => {
      const custom = e as CustomEvent<{ type?: string }>;
      if (!targetType || !custom.detail || custom.detail.type === targetType) {
        refresh();
      }
    };

    const handleStorageEvent = () => {
      refresh();
    };

    window.addEventListener("monarq_data_change", handleCustomEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("monarq_data_change", handleCustomEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [refresh, targetType]);

  const update = useCallback(
    (updater: (prev: T) => T) => {
      setData((current) => {
        const next = updater(current);
        return next;
      });
    },
    []
  );

  return [data, update];
}
