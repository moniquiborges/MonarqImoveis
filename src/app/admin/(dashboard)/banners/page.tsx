import { listBanners } from "./actions";
import { BannersView } from "./BannersView";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const { banners, error } = await listBanners();

  return <BannersView initialBanners={banners} initialError={error ?? null} />;
}
