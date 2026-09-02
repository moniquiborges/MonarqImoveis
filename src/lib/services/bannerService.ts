import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import type { BannerLocationDb } from "@/types/database";

export interface HomeBanner {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

export type HomeBannersByLocation = Partial<Record<BannerLocationDb, HomeBanner>>;

/**
 * Retorna o primeiro banner ativo de cada posição (Hero, Destaque SC,
 * Campo Grande, Rural). Sem lógica de rotação/carrossel — uma posição sem
 * banner ativo simplesmente não aparece no mapa, e o componente da Home
 * mantém seu conteúdo padrão.
 */
export async function fetchActiveBanners(): Promise<HomeBannersByLocation> {
  if (!isSupabaseConfigured()) {
    return {};
  }

  try {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("active", true)
      .order("display_order");

    if (error || !data) {
      return {};
    }

    const map: HomeBannersByLocation = {};
    for (const row of data) {
      if (map[row.location]) continue;
      map[row.location] = {
        title: row.title,
        subtitle: row.subtitle ?? "",
        imageUrl: row.image_url ?? "",
        ctaText: row.cta_text ?? "",
        ctaLink: row.cta_link ?? "",
      };
    }

    return map;
  } catch (err) {
    console.error("Erro ao buscar banners ativos do Supabase:", err);
    return {};
  }
}
