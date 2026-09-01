import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { mockUrbanProperties } from "@/lib/mock/properties";
import { mockDevelopments } from "@/lib/mock/developments";
import { mockRuralProperties } from "@/lib/mock/rural";
import { mockImages } from "@/lib/mock/images";
import type { UrbanProperty, Development, RuralProperty, PropertyImage, ScCity, DevelopmentStage, RuralActivity } from "@/types";

/* =========================================================================
   URBAN PROPERTIES (Campo Grande / MS)
   ========================================================================= */

export async function fetchUrbanProperties(): Promise<UrbanProperty[]> {
  if (!isSupabaseConfigured()) {
    return mockUrbanProperties;
  }

  try {
    const supabase = createBrowserSupabaseClient() as any;
    const { data: urbanRows, error } = await supabase
      .from("urban_properties")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error || !urbanRows || urbanRows.length === 0) {
      return mockUrbanProperties;
    }

    // Busca todas as imagens associadas
    const { data: images } = await supabase
      .from("property_images")
      .select("*")
      .eq("entity_type", "urban_property")
      .order("position", { ascending: true });

    const imageMap = new Map<string, PropertyImage[]>();
    (images || []).forEach((img: any) => {
      const list = imageMap.get(img.entity_id) || [];
      list.push({ url: img.url, alt: img.alt || "" });
      imageMap.set(img.entity_id, list);
    });

    return urbanRows.map((row: any) => {
      const propImgs = imageMap.get(row.id) || [];
      const coverImage = propImgs[0] || { url: mockImages.livingRoom1, alt: row.title };
      const gallery = propImgs.slice(1);

      return {
        slug: row.slug,
        code: row.code,
        title: row.title,
        type: row.property_type || "Apartamento",
        neighborhood: row.neighborhood,
        city: "Campo Grande" as const,
        price: row.price ? Number(row.price) : null,
        bedrooms: row.bedrooms || 0,
        suites: row.suites || 0,
        parking: row.parking || 0,
        area: Number(row.area) || 0,
        leisureArea: row.total_area ? Number(row.total_area) : row.leisure_area ? Number(row.leisure_area) : undefined,
        badges: row.badges || ["novo", "alto-padrao"],
        coverImage,
        gallery,
        description: row.description || undefined,
        features: row.features || [],
      };
    });
  } catch (err) {
    console.error("Erro ao buscar imóveis urbanos do Supabase:", err);
    return mockUrbanProperties;
  }
}

export async function fetchUrbanPropertyBySlug(slugOrCode: string): Promise<UrbanProperty | undefined> {
  const normalized = slugOrCode.trim().toLowerCase();

  if (!isSupabaseConfigured()) {
    return mockUrbanProperties.find(
      (p) => p.slug.toLowerCase() === normalized || p.code.toLowerCase() === normalized
    );
  }

  try {
    const supabase = createBrowserSupabaseClient() as any;
    const { data: row, error } = await supabase
      .from("urban_properties")
      .select("*")
      .or(`slug.eq.${slugOrCode},code.ilike.${slugOrCode}`)
      .maybeSingle();

    if (error || !row) {
      return mockUrbanProperties.find(
        (p) => p.slug.toLowerCase() === normalized || p.code.toLowerCase() === normalized
      );
    }

    const { data: images } = await supabase
      .from("property_images")
      .select("*")
      .eq("entity_id", row.id)
      .order("position", { ascending: true });

    const propImgs: PropertyImage[] = (images || []).map((img: any) => ({
      url: img.url,
      alt: img.alt || row.title,
    }));

    const coverImage = propImgs[0] || { url: mockImages.livingRoom1, alt: row.title };
    const gallery = propImgs.slice(1);

    return {
      slug: row.slug,
      code: row.code,
      title: row.title,
      type: row.property_type || "Apartamento",
      neighborhood: row.neighborhood,
      city: "Campo Grande" as const,
      price: row.price ? Number(row.price) : null,
      bedrooms: row.bedrooms || 0,
      suites: row.suites || 0,
      parking: row.parking || 0,
      area: Number(row.area) || 0,
      leisureArea: row.total_area ? Number(row.total_area) : row.leisure_area ? Number(row.leisure_area) : undefined,
      badges: row.badges || ["novo", "alto-padrao"],
      coverImage,
      gallery,
      description: row.description || undefined,
      features: row.features || [],
    };
  } catch (err) {
    console.error("Erro ao buscar imóvel por slug/código no Supabase:", err);
    return mockUrbanProperties.find(
      (p) => p.slug.toLowerCase() === normalized || p.code.toLowerCase() === normalized
    );
  }
}

export async function saveUrbanPropertyToDb(prop: UrbanProperty): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/properties/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "urban", data: prop }),
    });
    const result = await res.json();
    return result;
  } catch (err: any) {
    console.error("Erro inesperado ao salvar imóvel no Supabase via API:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteUrbanPropertyFromDb(slug: string): Promise<boolean> {
  try {
    const res = await fetch("/api/properties/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "urban", slug }),
    });
    const result = await res.json();
    return Boolean(result.success);
  } catch (err) {
    console.error("Erro ao remover imóvel do Supabase via API:", err);
    return false;
  }
}

/* =========================================================================
   DEVELOPMENTS (Litoral SC)
   ========================================================================= */

export async function fetchDevelopments(): Promise<Development[]> {
  if (!isSupabaseConfigured()) {
    return mockDevelopments;
  }

  try {
    const supabase = createBrowserSupabaseClient() as any;
    const { data: devRows, error } = await supabase
      .from("developments")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error || !devRows || devRows.length === 0) {
      return mockDevelopments;
    }

    const { data: images } = await supabase
      .from("property_images")
      .select("*")
      .eq("entity_type", "development")
      .order("position", { ascending: true });

    const imageMap = new Map<string, PropertyImage[]>();
    (images || []).forEach((img: any) => {
      const list = imageMap.get(img.entity_id) || [];
      list.push({ url: img.url, alt: img.alt || "" });
      imageMap.set(img.entity_id, list);
    });

    const cityLabels: Record<string, string> = {
      "porto-belo": "Porto Belo",
      itapema: "Itapema",
      "balneario-camboriu": "Balneário Camboriú",
    };

    return devRows.map((row: any) => {
      const propImgs = imageMap.get(row.id) || [];
      const coverImage = propImgs[0] || { url: mockImages.coastalHouse1, alt: row.name };
      const gallery = propImgs.slice(1);

      return {
        slug: row.slug,
        name: row.name,
        city: row.city as ScCity,
        cityLabel: cityLabels[row.city] || row.city,
        neighborhood: row.neighborhood || "Centro",
        builder: row.builder || undefined,
        stage: row.stage as DevelopmentStage,
        deliveryDate: row.delivery_forecast || undefined,
        shortDescription: row.short_description || "",
        priceFrom: row.price_from ? Number(row.price_from) : undefined,
        bedroomsRange:
          row.bedrooms_min && row.bedrooms_max
            ? [row.bedrooms_min, row.bedrooms_max]
            : row.bedrooms_min
            ? [row.bedrooms_min, row.bedrooms_min]
            : undefined,
        suitesRange: row.suites_min ? [row.suites_min, row.suites_max || row.suites_min] : undefined,
        parkingRange: row.parking_min ? [row.parking_min, row.parking_max || row.parking_min] : undefined,
        areaRange:
          row.area_min && row.area_max
            ? [Number(row.area_min), Number(row.area_max)]
            : row.area_min
            ? [Number(row.area_min), Number(row.area_min)]
            : undefined,
        distanceToSea: row.distance_to_sea || undefined,
        badges: row.badges || ["lancamento", "alto-padrao"],
        coverImage,
        gallery,
        description: row.description || undefined,
        features: row.amenities || row.features || [],
      };
    });
  } catch (err) {
    console.error("Erro ao buscar empreendimentos do Supabase:", err);
    return mockDevelopments;
  }
}

export async function fetchDevelopmentBySlug(slug: string): Promise<Development | undefined> {
  if (!isSupabaseConfigured()) {
    return mockDevelopments.find((d) => d.slug === slug);
  }

  try {
    const supabase = createBrowserSupabaseClient() as any;
    const { data: row, error } = await supabase
      .from("developments")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !row) {
      return mockDevelopments.find((d) => d.slug === slug);
    }

    const { data: images } = await supabase
      .from("property_images")
      .select("*")
      .eq("entity_id", row.id)
      .order("position", { ascending: true });

    const propImgs: PropertyImage[] = (images || []).map((img: any) => ({
      url: img.url,
      alt: img.alt || row.name,
    }));

    const coverImage = propImgs[0] || { url: mockImages.coastalHouse1, alt: row.name };
    const gallery = propImgs.slice(1);

    const cityLabels: Record<string, string> = {
      "porto-belo": "Porto Belo",
      itapema: "Itapema",
      "balneario-camboriu": "Balneário Camboriú",
    };

    return {
      slug: row.slug,
      name: row.name,
      city: row.city as ScCity,
      cityLabel: cityLabels[row.city] || row.city,
      neighborhood: row.neighborhood || "Centro",
      builder: row.builder || undefined,
      stage: row.stage as DevelopmentStage,
      deliveryDate: row.delivery_forecast || undefined,
      shortDescription: row.short_description || "",
      description: row.description || undefined,
      priceFrom: row.price_from ? Number(row.price_from) : undefined,
      bedroomsRange:
        row.bedrooms_min && row.bedrooms_max
          ? [row.bedrooms_min, row.bedrooms_max]
          : row.bedrooms_min
          ? [row.bedrooms_min, row.bedrooms_min]
          : undefined,
      suitesRange: row.suites_min ? [row.suites_min, row.suites_max || row.suites_min] : undefined,
      parkingRange: row.parking_min ? [row.parking_min, row.parking_max || row.parking_min] : undefined,
      areaRange:
        row.area_min && row.area_max
          ? [Number(row.area_min), Number(row.area_max)]
          : row.area_min
          ? [Number(row.area_min), Number(row.area_min)]
          : undefined,
      distanceToSea: row.distance_to_sea || undefined,
      badges: row.badges || ["lancamento", "alto-padrao"],
      coverImage,
      gallery,
      features: row.amenities || row.features || [],
    };
  } catch (err) {
    console.error("Erro ao buscar empreendimento por slug no Supabase:", err);
    return mockDevelopments.find((d) => d.slug === slug);
  }
}

export async function saveDevelopmentToDb(dev: Development): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/properties/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "development", data: dev }),
    });
    const result = await res.json();
    return result;
  } catch (err: any) {
    console.error("Erro inesperado ao salvar empreendimento no Supabase via API:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteDevelopmentFromDb(slug: string): Promise<boolean> {
  try {
    const res = await fetch("/api/properties/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "development", slug }),
    });
    const result = await res.json();
    return Boolean(result.success);
  } catch (err) {
    console.error("Erro ao remover empreendimento do Supabase via API:", err);
    return false;
  }
}

/* =========================================================================
   RURAL PROPERTIES (MS & MT)
   ========================================================================= */

export async function fetchRuralProperties(): Promise<RuralProperty[]> {
  if (!isSupabaseConfigured()) {
    return mockRuralProperties;
  }

  try {
    const supabase = createBrowserSupabaseClient() as any;
    const { data: ruralRows, error } = await supabase
      .from("rural_properties")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error || !ruralRows || ruralRows.length === 0) {
      return mockRuralProperties;
    }

    const { data: images } = await supabase
      .from("property_images")
      .select("*")
      .eq("entity_type", "rural_property")
      .order("position", { ascending: true });

    const imageMap = new Map<string, PropertyImage[]>();
    (images || []).forEach((img: any) => {
      const list = imageMap.get(img.entity_id) || [];
      list.push({ url: img.url, alt: img.alt || "" });
      imageMap.set(img.entity_id, list);
    });

    return ruralRows.map((row: any) => {
      const propImgs = imageMap.get(row.id) || [];
      const coverImage = propImgs[0] || { url: mockImages.ruralLandscape1, alt: row.title };
      const gallery = propImgs.slice(1);

      return {
        slug: row.slug,
        code: row.code,
        title: row.title,
        state: row.state,
        municipality: row.municipality,
        totalHectares: Number(row.total_hectares) || 0,
        activity: row.activity || ["pecuaria"],
        price: row.price ? Number(row.price) : null,
        pricePerHectare: row.price_per_hectare ? Number(row.price_per_hectare) : undefined,
        badges: row.badges || ["oportunidade"],
        coverImage,
        gallery,
        description: row.description || undefined,
      };
    });
  } catch (err) {
    console.error("Erro ao buscar propriedades rurais do Supabase:", err);
    return mockRuralProperties;
  }
}

export async function fetchRuralPropertyBySlug(slug: string): Promise<RuralProperty | undefined> {
  if (!isSupabaseConfigured()) {
    return mockRuralProperties.find((p) => p.slug === slug);
  }

  try {
    const supabase = createBrowserSupabaseClient() as any;
    const { data: row, error } = await supabase
      .from("rural_properties")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !row) {
      return mockRuralProperties.find((p) => p.slug === slug);
    }

    const { data: images } = await supabase
      .from("property_images")
      .select("*")
      .eq("entity_id", row.id)
      .order("position", { ascending: true });

    const propImgs: PropertyImage[] = (images || []).map((img: any) => ({
      url: img.url,
      alt: img.alt || row.title,
    }));

    const coverImage = propImgs[0] || { url: mockImages.ruralLandscape1, alt: row.title };
    const gallery = propImgs.slice(1);

    return {
      slug: row.slug,
      code: row.code,
      title: row.title,
      state: row.state,
      municipality: row.municipality,
      totalHectares: Number(row.total_hectares) || 0,
      activity: row.activity || ["pecuaria"],
      price: row.price ? Number(row.price) : null,
      pricePerHectare: row.price_per_hectare ? Number(row.price_per_hectare) : undefined,
      badges: row.badges || ["oportunidade"],
      coverImage,
      gallery,
      description: row.description || undefined,
    };
  } catch (err) {
    console.error("Erro ao buscar propriedade rural por slug no Supabase:", err);
    return mockRuralProperties.find((p) => p.slug === slug);
  }
}

export async function saveRuralPropertyToDb(prop: RuralProperty): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/properties/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "rural", data: prop }),
    });
    const result = await res.json();
    return result;
  } catch (err: any) {
    console.error("Erro inesperado ao salvar propriedade rural no Supabase via API:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteRuralPropertyFromDb(slug: string): Promise<boolean> {
  try {
    const res = await fetch("/api/properties/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "rural", slug }),
    });
    const result = await res.json();
    return Boolean(result.success);
  } catch (err) {
    console.error("Erro ao remover propriedade rural do Supabase via API:", err);
    return false;
  }
}

/* =========================================================================
   UNIVERSAL SHORT LINK RESOLVER (MRQ Code / Slug)
   ========================================================================= */

export async function resolveShortCode(codeOrSlug: string): Promise<string | null> {
  const code = codeOrSlug.trim();
  const normalized = code.toLowerCase();

  // 1. Tenta buscar nos imóveis urbanos (MS)
  const urban = await fetchUrbanPropertyBySlug(code);
  if (urban) {
    return `/imoveis/campo-grande/${urban.slug}`;
  }

  // 2. Tenta buscar nos empreendimentos (SC)
  const dev = await fetchDevelopmentBySlug(code);
  if (dev) {
    return `/empreendimentos/${dev.city}/${dev.slug}`;
  }

  // 3. Tenta buscar nas propriedades rurais
  const rural = await fetchRuralPropertyBySlug(code);
  if (rural) {
    return `/rural/${rural.slug}`;
  }

  // 4. Fallback se o código digitado for numérico puro (ex: '102' -> busca por 'MRQ-U102' ou 'MRQ-R102')
  if (/^\d+$/.test(code)) {
    const tryUrban = await fetchUrbanPropertyBySlug(`MRQ-U${code}`);
    if (tryUrban) return `/imoveis/campo-grande/${tryUrban.slug}`;

    const tryRural = await fetchRuralPropertyBySlug(`MRQ-R${code}`);
    if (tryRural) return `/rural/${tryRural.slug}`;
  }

  return null;
}

