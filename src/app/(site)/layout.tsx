import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { FavoritesDrawer } from "@/components/property/FavoritesDrawer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <FavoritesProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <FavoritesDrawer />
    </FavoritesProvider>
  );
}
