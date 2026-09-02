"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-staff";
import type { UserRole } from "@/types/database";

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  lastLogin: string;
  createdAt: string;
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "Nunca acessou";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isBanned(bannedUntil: string | null | undefined): boolean {
  if (!bannedUntil) return false;
  return new Date(bannedUntil).getTime() > Date.now();
}

export interface ListAdminUsersResult {
  users: AdminUserItem[];
  currentUserId: string | null;
  error?: string;
}

export async function listAdminUsers(): Promise<ListAdminUsersResult> {
  const admin = await requireAdmin();
  if (!admin) {
    return { users: [], currentUserId: null, error: "Não autorizado." };
  }

  const supabase = createAdminClient();

  const [authResult, profilesResult] = await Promise.all([
    supabase.auth.admin.listUsers({ page: 1, perPage: 200 }),
    supabase.from("profiles").select("id, full_name, role, created_at"),
  ]);

  if (authResult.error || profilesResult.error) {
    return {
      users: [],
      currentUserId: admin.id,
      error:
        authResult.error?.message ??
        profilesResult.error?.message ??
        "Erro ao carregar usuários.",
    };
  }

  const profileMap = new Map((profilesResult.data ?? []).map((p) => [p.id, p]));

  const users: AdminUserItem[] = authResult.data.users
    .map((u): AdminUserItem => {
      const profile = profileMap.get(u.id);
      const metaName =
        typeof u.user_metadata?.full_name === "string" ? u.user_metadata.full_name : undefined;

      return {
        id: u.id,
        name: profile?.full_name || metaName || u.email || "Sem nome",
        email: u.email ?? "",
        role: (profile?.role as UserRole | undefined) ?? "editor",
        status: isBanned(u.banned_until) ? "inactive" : "active",
        lastLogin: formatDateTime(u.last_sign_in_at),
        createdAt: u.created_at,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return { users, currentUserId: admin.id };
}

export interface CreateAdminUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateAdminUserResult {
  success: boolean;
  error?: string;
}

export async function createAdminUser(
  input: CreateAdminUserInput
): Promise<CreateAdminUserResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Não autorizado." };

  const name = input.name.trim();
  const email = input.email.trim();
  const password = input.password;

  if (!name || !email) {
    return { success: false, error: "Preencha nome e e-mail." };
  }
  if (password.length < 6) {
    return { success: false, error: "A senha precisa ter pelo menos 6 caracteres." };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  });

  if (error || !data.user) {
    return { success: false, error: error?.message ?? "Não foi possível criar o usuário." };
  }

  const { data: updatedProfile, error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: name, role: input.role })
    .eq("id", data.user.id)
    .select("id")
    .maybeSingle();

  if (profileError || !updatedProfile) {
    // Sem a linha em `profiles` o novo usuário não consegue passar pela
    // checagem de staff do proxy — desfaz a criação em vez de deixar um
    // usuário "fantasma" sem cargo.
    await supabase.auth.admin.deleteUser(data.user.id);
    return {
      success: false,
      error:
        "Usuário criado no Supabase Auth, mas não foi possível gravar o cargo em 'profiles' (a tabela/trigger podem não existir neste projeto). A criação foi revertida.",
    };
  }

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export interface ToggleUserStatusResult {
  success: boolean;
  error?: string;
}

export async function toggleAdminUserStatus(
  userId: string,
  activate: boolean
): Promise<ToggleUserStatusResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Não autorizado." };

  if (userId === admin.id && !activate) {
    return { success: false, error: "Você não pode desativar sua própria conta." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: activate ? "none" : "876000h",
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export interface DeleteAdminUserResult {
  success: boolean;
  error?: string;
}

export async function deleteAdminUser(userId: string): Promise<DeleteAdminUserResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Não autorizado." };

  if (userId === admin.id) {
    return { success: false, error: "Você não pode excluir sua própria conta." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/usuarios");
  return { success: true };
}
