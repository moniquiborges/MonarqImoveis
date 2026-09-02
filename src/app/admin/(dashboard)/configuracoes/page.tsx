import { getSettings } from "./actions";
import { ConfiguracoesView } from "./ConfiguracoesView";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracoesPage() {
  const { siteConfig, analytics, error } = await getSettings();

  return (
    <ConfiguracoesView
      initialSiteConfig={siteConfig}
      initialAnalytics={analytics}
      initialError={error ?? null}
    />
  );
}
