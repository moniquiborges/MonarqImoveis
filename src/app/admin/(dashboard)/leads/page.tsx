import { listLeads } from "./actions";
import { LeadsView } from "./LeadsView";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const { leads, error } = await listLeads();

  return <LeadsView initialLeads={leads} initialError={error ?? null} />;
}
