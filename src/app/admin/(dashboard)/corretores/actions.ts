"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/require-staff";

export interface AgentListItem {
  id: string;
  name: string;
  roleTitle: string;
  creci: string;
  email: string;
  phone: string;
  active: boolean;
}

export interface ListAgentsResult {
  agents: AgentListItem[];
  error?: string;
}

export async function listAgents(): Promise<ListAgentsResult> {
  const staff = await requireStaff();
  if (!staff) return { agents: [], error: "Não autorizado." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agents")
    .select("id, full_name, role_title, creci, email, phone, active")
    .order("full_name");

  if (error) {
    return { agents: [], error: error.message };
  }

  const agents: AgentListItem[] = (data ?? []).map((row) => ({
    id: row.id,
    name: row.full_name,
    roleTitle: row.role_title ?? "",
    creci: row.creci ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    active: row.active,
  }));

  return { agents };
}

export interface AgentFormInput {
  name: string;
  roleTitle: string;
  creci: string;
  email: string;
  phone: string;
}

export interface AgentActionResult {
  success: boolean;
  error?: string;
}

export async function createAgent(input: AgentFormInput): Promise<AgentActionResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  const name = input.name.trim();
  if (!name) return { success: false, error: "Informe o nome completo." };

  const supabase = await createClient();
  const { error } = await supabase.from("agents").insert({
    full_name: name,
    role_title: input.roleTitle.trim() || null,
    creci: input.creci.trim() || null,
    email: input.email.trim() || null,
    phone: input.phone.trim() || null,
    active: true,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/corretores");
  return { success: true };
}

export async function updateAgent(id: string, input: AgentFormInput): Promise<AgentActionResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  const name = input.name.trim();
  if (!name) return { success: false, error: "Informe o nome completo." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("agents")
    .update({
      full_name: name,
      role_title: input.roleTitle.trim() || null,
      creci: input.creci.trim() || null,
      email: input.email.trim() || null,
      phone: input.phone.trim() || null,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/corretores");
  return { success: true };
}

export async function toggleAgentActive(id: string, active: boolean): Promise<AgentActionResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  const supabase = await createClient();
  const { error } = await supabase.from("agents").update({ active }).eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/corretores");
  return { success: true };
}

export async function deleteAgent(id: string): Promise<AgentActionResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  const supabase = await createClient();
  const { error } = await supabase.from("agents").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/corretores");
  return { success: true };
}
