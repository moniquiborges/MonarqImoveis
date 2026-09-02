import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { FavoritesDrawer } from "@/components/property/FavoritesDrawer";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import { fetchSiteConfig } from "@/lib/services/settingsService";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const config = await fetchSiteConfig();

  return (
    <SiteConfigProvider config={config}>
      <FavoritesProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer config={config} />
        <WhatsAppButton config={config} />
        <FavoritesDrawer />
      </FavoritesProvider>
    </SiteConfigProvider>
  );
}
