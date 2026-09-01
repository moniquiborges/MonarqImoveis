"use server";

import { createClient } from "@/lib/supabase/server";
import type { LeadInterestDb } from "@/types/database";

const CITY_INTEREST_MAP: Record<string, LeadInterestDb | null> = {
  "Porto Belo - SC": "porto-belo",
  "Itapema - SC": "itapema",
  "Balneário Camboriú - SC": "balneario-camboriu",
  "Campo Grande - MS": "campo-grande",
  "Mato Grosso do Sul (Rural)": "rural",
  "Mato Grosso (Rural)": "rural",
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartamento: "Apartamento / Studio",
  cobertura: "Cobertura",
  "casa-condominio": "Casa em Condomínio Fechado",
  "casa-rua": "Casa Urbana",
  terreno: "Terreno / Lote",
  fazenda: "Fazenda / Propriedade Rural",
  empreendimento: "Empreendimento / Incorporação",
};

export interface SellPropertyLeadInput {
  ownerName: string;
  phone: string;
  email: string;
  propertyType: string;
  cityState: string;
  neighborhood: string;
  estimatedPrice: string;
  area: string;
  details: string;
}

export interface SellPropertyLeadResult {
  success: boolean;
  error?: string;
}

export async function submitSellPropertyLead(
  input: SellPropertyLeadInput
): Promise<SellPropertyLeadResult> {
  const name = input.ownerName.trim();
  const phone = input.phone.trim();
  const email = input.email.trim();

  if (!name || !phone || !email) {
    return { success: false, error: "Preencha nome, telefone e e-mail." };
  }

  const typeLabel = PROPERTY_TYPE_LABELS[input.propertyType] ?? input.propertyType;
  const details = [
    `Tipo: ${typeLabel}`,
    `Local: ${input.cityState}`,
    input.neighborhood.trim() ? `Bairro/detalhes: ${input.neighborhood.trim()}` : null,
    input.area.trim() ? `Área: ${input.area.trim()}` : null,
    input.estimatedPrice.trim() ? `Expectativa de valor: R$ ${input.estimatedPrice.trim()}` : null,
    input.details.trim() ? `Observações: ${input.details.trim()}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    name,
    phone,
    email,
    interest: CITY_INTEREST_MAP[input.cityState] ?? null,
    message: `[Cadastro para venda] ${details}`,
    origin_page: "/venda-seu-imovel",
  });

  if (error) {
    console.error("Erro ao salvar lead de cadastro de imóvel:", error);
    return { success: false, error: "Não foi possível enviar seu cadastro. Tente novamente em instantes." };
  }

  return { success: true };
}
