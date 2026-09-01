import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata um valor numérico para o padrão de moeda brasileiro (BRL).
 * Exemplo: 1500000 -> "R$ 1.500.000"
 */
export function formatBRL(value: number, showCents = false): string {
  if (isNaN(value) || value === null || value === undefined) return "R$ 0";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(value);
}

/**
 * Formata área em metros quadrados.
 * Exemplo: 140 -> "140 m²"
 */
export function formatArea(value: number): string {
  if (isNaN(value) || value === null || value === undefined) return "0 m²";
  return `${new Intl.NumberFormat("pt-BR").format(value)} m²`;
}

/**
 * Converte qualquer entrada de valor monetário (string formatada com pontos,
 * vírgulas, abreviações como "milhões", "mil", etc.) para um número puro em JavaScript.
 *
 * Exemplos tratados:
 * - "1.000.000" -> 1000000
 * - "1.500.000,50" -> 1500000.5
 * - "1500000" -> 1500000
 * - "R$ 1.250.000,00" -> 1250000
 * - "1,5 milhão" -> 1500000
 * - "1 milhao" -> 1000000
 * - "2.5 mi" -> 2500000
 * - "500 mil" -> 500000
 */
export function parseCurrency(value: string | number): number {
  if (typeof value === "number") {
    return isNaN(value) ? 0 : value;
  }

  if (!value || typeof value !== "string") {
    return 0;
  }

  let clean = value.trim().toLowerCase();

  if (!clean) return 0;

  // Tratar multiplicadores em texto ("milhão", "milhoes", "milhões", "mi", "mil", "k", "bi")
  const isBillion = clean.includes("bi") || clean.includes("bilh");
  const isMillion = clean.includes("mi") || clean.includes("milh");
  const isThousand = clean.includes("mil") || clean.includes("k");

  clean = clean.replace(/r\$/gi, "").replace(/reais/gi, "").trim();

  if (isBillion || isMillion || isThousand) {
    const match = clean.match(/^[\d.,]+/);
    if (match) {
      const numStr = match[0].replace(/\./g, "").replace(",", ".");
      const baseNum = parseFloat(numStr) || 0;
      if (isBillion) return Math.round(baseNum * 1_000_000_000);
      if (isMillion) return Math.round(baseNum * 1_000_000);
      if (isThousand) return Math.round(baseNum * 1_000);
    }
  }

  if (clean.includes(",") && clean.includes(".")) {
    clean = clean.replace(/\./g, "").replace(",", ".");
  } else if (clean.includes(",")) {
    if (/,\d{1,2}$/.test(clean)) {
      clean = clean.replace(",", ".");
    } else {
      clean = clean.replace(/,/g, "");
    }
  } else if (clean.includes(".")) {
    const dotCount = (clean.match(/\./g) || []).length;
    if (dotCount > 1) {
      clean = clean.replace(/\./g, "");
    } else {
      if (/\.\d{3}$/.test(clean)) {
        clean = clean.replace(/\./g, "");
      }
    }
  }

  clean = clean.replace(/[^\d.]/g, "");

  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formata um número para visualização amigável de valor por extenso resumido
 * Ex: 1500000 -> "1,5 milhão" | 12000000 -> "12 milhões"
 */
export function formatCompactBRL(value: number): string {
  if (!value || isNaN(value)) return "R$ 0";
  if (value >= 1_000_000_000) {
    const bi = value / 1_000_000_000;
    return `${bi.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} ${bi === 1 ? "bilhão" : "bilhões"}`;
  }
  if (value >= 1_000_000) {
    const mi = value / 1_000_000;
    return `${mi.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} ${mi === 1 ? "milhão" : "milhões"}`;
  }
  if (value >= 10_000) {
    const mil = value / 1_000;
    return `${mil.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;
  }
  return formatBRL(value);
}
