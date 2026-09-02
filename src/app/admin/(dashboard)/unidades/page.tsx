import { listUnits } from "./actions";
import { UnidadesView } from "./UnidadesView";

export const dynamic = "force-dynamic";

export default async function AdminUnidadesPage() {
  const { units, developments, error } = await listUnits();

  return (
    <UnidadesView initialUnits={units} developments={developments} initialError={error ?? null} />
  );
}
