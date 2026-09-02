"use server";

import { createClient } from "@/lib/supabase/server";
import type { LeadInterest } from "@/types";

export type LeadEntityType = "urban" | "development" | "rural";

export interface PropertyLeadInput {
  name: string;
  phone: string;
  email: string;
  message: string;
  interest: LeadInterest;
  entityType: LeadEntityType;
  slug: string;
  originPage: string;
}

export interface PropertyLeadResult {
  success: boolean;
  error?: string;
}

const TABLE_BY_TYPE = {
  urban: "urban_properties",
  development: "developments",
  rural: "rural_properties",
} as const;

export async function submitPropertyLead(input: PropertyLeadInput): Promise<PropertyLeadResult> {
  const name = input.name.trim();
  const phone = input.phone.trim();
  const email = input.email.trim();

  if (!name || !phone) {
    return { success: false, error: "Preencha nome e telefone." };
  }

  const supabase = await createClient();

  const { data: entity } = await supabase
    .from(TABLE_BY_TYPE[input.entityType])
    .select("id")
    .eq("slug", input.slug)
    .maybeSingle();

  const { error } = await supabase.from("leads").insert({
    name,
    phone,
    email: email || null,
    message: input.message?.trim() || null,
    interest: input.interest,
    lead_type: "compra",
    origin_page: input.originPage,
    urban_property_id: input.entityType === "urban" ? entity?.id ?? null : null,
    development_id: input.entityType === "development" ? entity?.id ?? null : null,
    rural_property_id: input.entityType === "rural" ? entity?.id ?? null : null,
  });

  if (error) {
    console.error("Erro ao salvar lead de imóvel:", error);
    return {
      success: false,
      error: "Não foi possível enviar seu contato. Tente novamente em instantes.",
    };
  }

  return { success: true };
}
