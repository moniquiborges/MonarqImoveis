import type { DevelopmentStage, PropertyBadge, RuralActivity } from "@/types";

export const stageLabels: Record<DevelopmentStage, string> = {
  lancamento: "Lançamento",
  "em-obras": "Em obras",
  pronto: "Pronto para Morar",
  vendido: "100% Vendido",
};

export const ruralActivityLabels: Record<RuralActivity, string> = {
  venda: "Venda",
  arrendamento: "Arrendamento",
  agricultura: "Agricultura",
  pecuaria: "Pecuária",
  investimento: "Investimento",
  chacara: "Chácara",
  rancho: "Rancho",
  sitio: "Sítio",
};

export const ruralTypeLabels: Record<string, string> = {
  fazenda: "Fazenda",
  chacara: "Chácara",
  sitio: "Sítio",
  rancho: "Rancho",
};

export const urbanPropertyTypeLabels: Record<string, string> = {
  apartamento: "Apartamentos de Luxo",
  cobertura: "Coberturas",
  "casa em condomínio": "Casas em Condomínio",
  condominio: "Casas em Condomínio",
  casa: "Casas",
  sobrado: "Sobrados",
  terreno: "Terrenos Exclusivos",
  loteamento: "Loteamentos",
  comercial: "Comercial",
};

export const propertyBadgeLabels: Record<PropertyBadge, string> = {
  exclusivo: "Exclusivo",
  lancamento: "Lançamento",
  "em-obras": "Em obras",
  pronto: "Pronto",
  "frente-mar": "Frente-mar",
  novo: "Novo",
  oportunidade: "Oportunidade",
  "alto-padrao": "Alto padrão",
  vendido: "Vendido",
};

export const BRAZILIAN_STATES: { value: import("@/types").RuralState; label: string }[] = [
  { value: "MS", label: "Mato Grosso do Sul (MS)" },
  { value: "MT", label: "Mato Grosso (MT)" },
  { value: "GO", label: "Goiás (GO)" },
  { value: "MG", label: "Minas Gerais (MG)" },
  { value: "SP", label: "São Paulo (SP)" },
  { value: "PR", label: "Paraná (PR)" },
  { value: "BA", label: "Bahia (BA)" },
  { value: "TO", label: "Tocantins (TO)" },
  { value: "PA", label: "Pará (PA)" },
  { value: "MA", label: "Maranhão (MA)" },
  { value: "PI", label: "Piauí (PI)" },
  { value: "RO", label: "Rondônia (RO)" },
  { value: "RS", label: "Rio Grande do Sul (RS)" },
  { value: "SC", label: "Santa Catarina (SC)" },
  { value: "AC", label: "Acre (AC)" },
  { value: "AL", label: "Alagoas (AL)" },
  { value: "AP", label: "Amapá (AP)" },
  { value: "AM", label: "Amazonas (AM)" },
  { value: "CE", label: "Ceará (CE)" },
  { value: "DF", label: "Distrito Federal (DF)" },
  { value: "ES", label: "Espírito Santo (ES)" },
  { value: "PB", label: "Paraíba (PB)" },
  { value: "PE", label: "Pernambuco (PE)" },
  { value: "RJ", label: "Rio de Janeiro (RJ)" },
  { value: "RN", label: "Rio Grande do Norte (RN)" },
  { value: "RR", label: "Roraima (RR)" },
  { value: "SE", label: "Sergipe (SE)" },
];

