"use client";

import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSelectConfig {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

export interface FilterBarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  selects?: FilterSelectConfig[];
  totalResults: number;
  onReset?: () => void;
  hasActiveFilters?: boolean;
}

export function FilterBar({
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Buscar por nome, bairro ou palavra-chave...",
  selects = [],
  totalResults,
  onReset,
  hasActiveFilters = false,
}: FilterBarProps) {
  return (
    <div className="mb-8 rounded-sm border border-areia/60 bg-white p-4 md:p-5 shadow-xs">
      <div className="flex flex-col gap-4">
        {/* Linha de Filtros */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 items-center">
          {/* Busca por texto */}
          {onSearchChange && (
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 py-2.5 pl-10 pr-3 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
              />
            </div>
          )}

          {/* Selects customizáveis */}
          {selects.map((select) => (
            <div key={select.id} className="relative">
              <label htmlFor={select.id} className="sr-only">
                {select.label}
              </label>
              <select
                id={select.id}
                value={select.value}
                onChange={(e) => select.onChange(e.target.value)}
                className="focus-ring w-full appearance-none rounded-xs border border-areia/70 bg-offwhite/30 px-3.5 py-2.5 text-xs text-graphite transition-colors focus:border-mineral focus:bg-white cursor-pointer"
              >
                {select.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Barra de Status / Contagem de Resultados e Limpar */}
        <div className="flex items-center justify-between border-t border-areia/30 pt-3 text-xs text-graphite/60">
          <div className="inline-flex items-center gap-1.5 font-medium">
            <SlidersHorizontal className="h-3.5 w-3.5 text-mineral" />
            <span>
              {totalResults === 1
                ? "1 imóvel encontrado"
                : `${totalResults} imóveis encontrados`}
            </span>
          </div>

          {hasActiveFilters && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-terracota hover:text-terracota-light transition-colors font-medium cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
