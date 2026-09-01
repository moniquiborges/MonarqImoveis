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
  const isMillion = clean.includes("mi") || clean.includes("milh") || /(?:^|\s|\d)m(?:$|\s)/.test(clean);
  const isThousand = clean.includes("mil") || clean.includes("k");

  clean = clean.replace(/r\$/gi, "").replace(/reais/gi, "").trim();

  if (isBillion || isMillion || isThousand) {
    const match = clean.match(/^[\d.,]+/);
    if (match) {
      let num = match[0];
      if (num.includes(",") && num.includes(".")) {
        const lastComma = num.lastIndexOf(",");
        const lastDot = num.lastIndexOf(".");
        if (lastComma > lastDot) {
          num = num.replace(/\./g, "").replace(",", ".");
        } else {
          num = num.replace(/,/g, "");
        }
      } else if (num.includes(",")) {
        num = num.replace(",", ".");
      } else if (num.includes(".")) {
        // If 3 digits after dot (e.g. 1.500 mil), treat dot as thousand separator
        if (/\.\d{3}$/.test(num)) {
          num = num.replace(/\./g, "");
        }
      }
      const baseNum = parseFloat(num) || 0;
      if (isBillion) return Math.round(baseNum * 1_000_000_000);
      if (isMillion) return Math.round(baseNum * 1_000_000);
      if (isThousand) return Math.round(baseNum * 1_000);
    }
  }

  if (clean.includes(",") && clean.includes(".")) {
    const lastComma = clean.lastIndexOf(",");
    const lastDot = clean.lastIndexOf(".");
    if (lastComma > lastDot) {
      // Padrão BR: 1.500.000,50
      clean = clean.replace(/\./g, "").replace(",", ".");
    } else {
      // Padrão US: 1,500,000.50
      clean = clean.replace(/,/g, "");
    }
  } else if (clean.includes(",")) {
    const commaCount = (clean.match(/,/g) || []).length;
    if (commaCount > 1) {
      clean = clean.replace(/,/g, "");
    } else {
      if (/,\d{1,2}$/.test(clean)) {
        clean = clean.replace(",", ".");
      } else if (/,\d{3}$/.test(clean)) {
        clean = clean.replace(/,/g, "");
      } else {
        clean = clean.replace(",", ".");
      }
    }
  } else if (clean.includes(".")) {
    // No contexto imobiliário brasileiro, todos os pontos funcionam como separadores de milhar
    // Ex: "2.000", "2.0000", "2.000.000" -> remove todos os pontos para evitar que "2.0000" vire 2 no parseFloat
    clean = clean.replace(/\./g, "");
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
