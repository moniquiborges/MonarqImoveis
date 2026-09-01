"use client";

import React, { useState, useEffect } from "react";
import { formatBRL, formatCompactBRL, parseCurrency } from "@/lib/utils";
import { DollarSign, CheckCircle2, HelpCircle } from "lucide-react";

interface CurrencyInputProps {
  label?: string;
  value: number | string;
  onChange: (numericValue: number, rawInput: string) => void;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
  showPresets?: boolean;
  allowSobConsulta?: boolean;
}

export function CurrencyInput({
  label = "Valor (R$)",
  value,
  onChange,
  placeholder = "Ex: 1.250.000 ou 1,5 milhão",
  required = false,
  helperText,
  className = "",
  showPresets = true,
  allowSobConsulta = true,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState<string>("");
  const [isSobConsulta, setIsSobConsulta] = useState<boolean>(false);

  useEffect(() => {
    if (value === 0 && isSobConsulta) {
      setDisplayValue("");
      return;
    }
    if (value === "" || value === undefined || value === null) {
      setDisplayValue("");
    } else if (typeof value === "number") {
      if (value === 0) {
        setDisplayValue("");
      } else {
        // Format with thousand dots for clarity
        setDisplayValue(new Intl.NumberFormat("pt-BR").format(value));
      }
    } else {
      setDisplayValue(String(value));
    }
  }, [value, isSobConsulta]);

  const numeric = parseCurrency(displayValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setIsSobConsulta(false);
    setDisplayValue(raw);
    const num = parseCurrency(raw);
    onChange(num, raw);
  };

  const handleApplyPreset = (amount: number) => {
    setIsSobConsulta(false);
    const formatted = new Intl.NumberFormat("pt-BR").format(amount);
    setDisplayValue(formatted);
    onChange(amount, formatted);
  };

  const handleAddAmount = (addAmount: number) => {
    setIsSobConsulta(false);
    const current = parseCurrency(displayValue);
    const updated = current + addAmount;
    const formatted = new Intl.NumberFormat("pt-BR").format(updated);
    setDisplayValue(formatted);
    onChange(updated, formatted);
  };

  const handleToggleSobConsulta = () => {
    if (!isSobConsulta) {
      setIsSobConsulta(true);
      setDisplayValue("");
      onChange(0, "Sob Consulta");
    } else {
      setIsSobConsulta(false);
      setDisplayValue("1.000.000");
      onChange(1000000, "1.000.000");
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-graphite">
          {label} {required && !isSobConsulta && <span className="text-terracota">*</span>}
        </label>
        {allowSobConsulta && (
          <button
            type="button"
            onClick={handleToggleSobConsulta}
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
              isSobConsulta
                ? "bg-mineral text-offwhite font-semibold"
                : "bg-areia/40 text-graphite/70 hover:bg-areia/70"
            }`}
          >
            {isSobConsulta ? "✓ Sob Consulta (Ativo)" : "Definir Sob Consulta"}
          </button>
        )}
      </div>

      {!isSobConsulta ? (
        <div className="space-y-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-graphite/40">
              <span className="text-xs font-semibold text-mineral">R$</span>
            </div>
            <input
              type="text"
              required={required}
              placeholder={placeholder}
              value={displayValue}
              onChange={handleInputChange}
              className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 py-2 pl-9 pr-24 text-xs font-medium text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
            />
            {numeric > 0 && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-[11px] font-semibold text-mineral bg-mineral/10 px-2 py-0.5 rounded-xs">
                  {formatCompactBRL(numeric)}
                </span>
              </div>
            )}
          </div>

          {/* Feedback de valor formatado e detalhado */}
          {numeric > 0 ? (
            <div className="flex items-center gap-1.5 text-[11px] text-graphite/70 bg-offwhite/80 px-2.5 py-1 rounded-xs border border-areia/40">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>
                Valor reconhecido: <strong className="text-graphite font-semibold">{formatBRL(numeric)}</strong>
              </span>
            </div>
          ) : displayValue ? (
            <p className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xs border border-amber-200">
              Digite um valor (ex: 1.000.000, 850000 ou 1,5 milhão)
            </p>
          ) : null}

          {/* Atalhos rápidos para imóveis de médio e alto padrão */}
          {showPresets && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] text-graphite/40 uppercase tracking-wider font-semibold mr-1">
                Atalhos:
              </span>
              {[
                { label: "850 mil", val: 850000 },
                { label: "1.2 Mi", val: 1200000 },
                { label: "1.8 Mi", val: 1800000 },
                { label: "2.5 Mi", val: 2500000 },
                { label: "5 Mi", val: 5000000 },
                { label: "10 Mi", val: 10000000 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleApplyPreset(p.val)}
                  className="rounded-xs border border-areia/70 bg-white px-2 py-0.5 text-[10px] font-medium text-graphite/70 hover:border-mineral hover:text-mineral hover:bg-mineral/5 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
              <div className="flex items-center gap-1 ml-auto">
                <button
                  type="button"
                  title="Somar 100 mil ao valor atual"
                  onClick={() => handleAddAmount(100000)}
                  className="rounded-xs bg-areia/40 px-1.5 py-0.5 text-[10px] font-semibold text-graphite/80 hover:bg-areia transition-colors cursor-pointer"
                >
                  +100k
                </button>
                <button
                  type="button"
                  title="Somar 500 mil ao valor atual"
                  onClick={() => handleAddAmount(500000)}
                  className="rounded-xs bg-areia/40 px-1.5 py-0.5 text-[10px] font-semibold text-graphite/80 hover:bg-areia transition-colors cursor-pointer"
                >
                  +500k
                </button>
                <button
                  type="button"
                  title="Somar 1 milhão ao valor atual"
                  onClick={() => handleAddAmount(1000000)}
                  className="rounded-xs bg-areia/40 px-1.5 py-0.5 text-[10px] font-semibold text-graphite/80 hover:bg-areia transition-colors cursor-pointer"
                >
                  +1M
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 bg-offwhite rounded-xs border border-areia/60 text-xs text-graphite/70 flex items-center justify-between">
          <span>Este imóvel será exibido no site como <strong>"Sob Consulta"</strong>.</span>
          <button
            type="button"
            onClick={handleToggleSobConsulta}
            className="text-[11px] text-terracota underline font-medium hover:text-terracota-dark"
          >
            Definir preço numérico
          </button>
        </div>
      )}

      {helperText && <p className="text-[11px] text-graphite/50">{helperText}</p>}
    </div>
  );
}
