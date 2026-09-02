"use server";

import { createClient } from "@/lib/supabase/server";
import type { LeadInterestDb } from "@/types/database";

const INTEREST_MAP: Record<string, LeadInterestDb | null> = {
  "campo-grande": "campo-grande",
  rural: "rural",
  avaliacao: "investimento",
};

const INTEREST_LABELS: Record<string, string> = {
  "empreendimentos-sc": "Empreendimentos SC (Porto Belo, Itapema, BC)",
  "campo-grande": "Imóveis em Campo Grande / MS",
  rural: "Propriedades Rurais & Fazendas (MS / MT)",
  avaliacao: "Avaliação Mercadológica (PTAM)",
  regularizacao: "Regularização Imobiliária & Apoio Jurídico",
  outro: "Outro assunto institucional",
};

export interface ContactLeadInput {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
}

export interface ContactLeadResult {
  success: boolean;
  error?: string;
}

export async function submitContactLead(input: ContactLeadInput): Promise<ContactLeadResult> {
  const name = input.name.trim();
  const phone = input.phone.trim();
  const email = input.email.trim();

  if (!name || !phone || !email) {
    return { success: false, error: "Preencha nome, telefone e e-mail." };
  }

  const interestLabel = INTEREST_LABELS[input.interest] ?? input.interest;
  const message = input.message?.trim()
    ? `[${interestLabel}] ${input.message.trim()}`
    : `[${interestLabel}]`;

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    name,
    phone,
    email,
    interest: INTEREST_MAP[input.interest] ?? null,
    message,
    lead_type: "compra",
    origin_page: "/contato",
  });

  if (error) {
    console.error("Erro ao salvar lead de contato:", error);
    return { success: false, error: "Não foi possível enviar sua mensagem. Tente novamente em instantes." };
  }

  return { success: true };
}
