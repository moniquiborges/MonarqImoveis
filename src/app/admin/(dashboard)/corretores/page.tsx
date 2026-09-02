import { listAgents } from "./actions";
import { CorretoresView } from "./CorretoresView";

export const dynamic = "force-dynamic";

export default async function AdminCorretoresPage() {
  const { agents, error } = await listAgents();

  return <CorretoresView initialAgents={agents} initialError={error ?? null} />;
}
