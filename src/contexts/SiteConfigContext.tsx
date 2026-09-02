"use client";

import { createContext, useContext, useMemo } from "react";
import { buildWhatsappUrlFor } from "@/lib/site-config";
import type { ResolvedSiteConfig } from "@/lib/services/settingsService";

interface SiteConfigContextValue {
  config: ResolvedSiteConfig;
  buildWhatsappUrl: (message: string) => string | null;
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

export function SiteConfigProvider({
  config,
  children,
}: {
  config: ResolvedSiteConfig;
  children: React.ReactNode;
}) {
  const value = useMemo<SiteConfigContextValue>(
    () => ({
      config,
      buildWhatsappUrl: (message: string) => buildWhatsappUrlFor(config.whatsappNumber, message),
    }),
    [config]
  );

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig(): SiteConfigContextValue {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error("useSiteConfig() precisa ser usado dentro de <SiteConfigProvider>");
  }
  return ctx;
}
