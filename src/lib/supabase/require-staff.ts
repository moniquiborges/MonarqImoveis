import "server-only";
import { createClient } from "./server";

const STAFF_ROLES = new Set(["admin", "editor"]);

/**
 * Confere sessão + role antes de liberar operações privilegiadas
 * (Server Actions e Route Handlers que usam o client admin/service-role).
 * Retorna o usuário autenticado ou `null` se não for staff.
 */
export async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !STAFF_ROLES.has(profile.role)) return null;

  return user;
}
