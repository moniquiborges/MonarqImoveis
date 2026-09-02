import "server-only";
import { createClient } from "./server";

const STAFF_ROLES = new Set(["admin", "editor"]);
const ADMIN_ROLES = new Set(["admin"]);

async function requireRole(allowedRoles: Set<string>) {
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

  if (!profile || !allowedRoles.has(profile.role)) return null;

  return user;
}

/**
 * Confere sessão + role antes de liberar operações privilegiadas
 * (Server Actions e Route Handlers que usam o client admin/service-role).
 * Retorna o usuário autenticado ou `null` se não for staff (admin ou editor).
 */
export async function requireStaff() {
  return requireRole(STAFF_ROLES);
}

/**
 * Igual a `requireStaff()`, mas restrito a `role = 'admin'` — usado em
 * operações sensíveis como gestão de usuários/permissões.
 */
export async function requireAdmin() {
  return requireRole(ADMIN_ROLES);
}
