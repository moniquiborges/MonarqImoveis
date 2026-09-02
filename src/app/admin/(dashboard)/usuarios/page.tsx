import { listAdminUsers } from "./actions";
import { UsuariosView } from "./UsuariosView";

export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage() {
  const { users, currentUserId, error } = await listAdminUsers();

  return (
    <UsuariosView initialUsers={users} initialError={error ?? null} currentUserId={currentUserId} />
  );
}
