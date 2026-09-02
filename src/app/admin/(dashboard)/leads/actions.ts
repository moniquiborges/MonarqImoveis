"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/require-staff";
import type { LeadInterestDb, LeadStatusDb, LeadTypeDb } from "@/types/database";

export interface LeadListItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  interest: LeadInterestDb | null;
  message: string | null;
  status: LeadStatusDb;
  leadType: LeadTypeDb;
  createdAt: string;
  notes: string | null;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export interface ListLeadsResult {
  leads: LeadListItem[];
  error?: string;
}

export async function listLeads(): Promise<ListLeadsResult> {
  const staff = await requireStaff();
  if (!staff) return { leads: [], error: "Não autorizado." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("id, name, phone, email, interest, message, status, lead_type, notes, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return { leads: [], error: error.message };
  }

  const leads: LeadListItem[] = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email ?? "",
    interest: row.interest,
    message: row.message,
    status: row.status,
    leadType: row.lead_type,
    notes: row.notes,
    createdAt: formatDateTime(row.created_at),
  }));

  return { leads };
}

export interface UpdateLeadStatusResult {
  success: boolean;
  error?: string;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatusDb
): Promise<UpdateLeadStatusResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/leads");
  return { success: true };
}

export interface DeleteLeadResult {
  success: boolean;
  error?: string;
}

export async function deleteLead(id: string): Promise<DeleteLeadResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/leads");
  return { success: true };
}
