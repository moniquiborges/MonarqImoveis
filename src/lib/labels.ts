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
