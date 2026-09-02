import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export interface AnalyticsSettings {
  gtmId: string;
  ga4Id: string;
  metaPixelId: string;
}

const EMPTY_ANALYTICS: AnalyticsSettings = { gtmId: "", ga4Id: "", metaPixelId: "" };

export async function fetchAnalyticsSettings(): Promise<AnalyticsSettings> {
  if (!isSupabaseConfigured()) {
    return EMPTY_ANALYTICS;
  }

  try {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "analytics")
      .maybeSingle();

    if (error || !data) {
      return EMPTY_ANALYTICS;
    }

    const value = data.value as Partial<AnalyticsSettings>;
    return {
      gtmId: value.gtmId?.trim() || "",
      ga4Id: value.ga4Id?.trim() || "",
      metaPixelId: value.metaPixelId?.trim() || "",
    };
  } catch (err) {
    console.error("Erro ao buscar configurações de analytics do Supabase:", err);
    return EMPTY_ANALYTICS;
  }
}
