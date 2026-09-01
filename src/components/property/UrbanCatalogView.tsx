"use client";

import { useState, useMemo, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar } from "@/components/property/FilterBar";
import { PropertyCard } from "@/components/property/PropertyCard";
import { urbanPropertyToCard } from "@/components/property/adapters";
import { fetchUrbanProperties } from "@/lib/services/propertyService";
import { saveStoredUrbanProperties } from "@/lib/storage";
import type { UrbanProperty } from "@/types";

interface Props {
  initialProperties: UrbanProperty[];
}

export function UrbanCatalogView({ initialProperties }: Props) {
  const [dbProps, setDbProps] = useState<UrbanProperty[]>(initialProperties);

  useEffect(() => {
    fetchUrbanProperties().then((props) => {
      if (props && props.length > 0) {
        setDbProps(props);
        saveStoredUrbanProperties(props);
      }
    });
  }, []);

  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const properties = dbProps && dbProps.length > 0 ? dbProps : initialProperties;

  // Bairros únicos disponíveis nos dados
  const neighborhoods = useMemo(() => {
    const set = new Set(properties.map((p) => p.neighborhood));
    return Array.from(set);
  }, [properties]);

  // Tipos únicos disponíveis
  const propertyTypes = useMemo(() => {
    const set = new Set(properties.map((p) => p.type));
    return Array.from(set);
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      if (selectedType !== "all" && item.type !== selectedType) return false;
      if (selectedNeighborhood !== "all" && item.neighborhood !== selectedNeighborhood) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesNeighborhood = item.neighborhood.toLowerCase().includes(q);
        const matchesCode = item.code.toLowerCase().includes(q);
        if (!matchesTitle && !matchesNeighborhood && !matchesCode) return false;
      }

      return true;
    });
  }, [properties, selectedType, selectedNeighborhood, searchQuery]);

  const hasActiveFilters =
    selectedType !== "all" || selectedNeighborhood !== "all" || searchQuery !== "";

  const handleReset = () => {
    setSelectedType("all");
    setSelectedNeighborhood("all");
    setSearchQuery("");
  };

  const typeLabels: Record<string, string> = {
    casa: "Casas em Condomínio",
    apartamento: "Apartamentos de Luxo",
    terreno: "Terrenos Exclusivos",
    cobertura: "Coberturas",
  };

  return (
    <main className="py-8 md:py-12">
      <Container>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Imóveis em Campo Grande" },
          ]}
        />

        {/* Cabeçalho Editorial */}
        <div className="mb-8 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.15em] text-terracota font-semibold mb-2">
            Mato Grosso do Sul
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-mineral font-normal tracking-tight">
            Imóveis de Alto Padrão em Campo Grande
          </h1>
          <p className="mt-4 text-sm md:text-base text-graphite/70 leading-relaxed">
            Casas em condomínios fechados renomados (Damha, Alphaville) e apartamentos sofisticados
            nos bairros mais nobres da capital sul-mato-grossense.
          </p>
        </div>

        {/* Barra de Filtros */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Buscar por condomínio, bairro ou código (ex: MRQ-U101)..."
          selects={[
            {
              id: "filter-type",
              label: "Tipo de Imóvel",
              value: selectedType,
              onChange: setSelectedType,
              options: [
                { value: "all", label: "Todos os Tipos" },
                ...propertyTypes.map((t) => ({
                  value: t,
                  label: typeLabels[t] || t.charAt(0).toUpperCase() + t.slice(1),
                })),
              ],
            },
            {
              id: "filter-neighborhood",
              label: "Bairro / Região",
              value: selectedNeighborhood,
              onChange: setSelectedNeighborhood,
              options: [
                { value: "all", label: "Todos os Bairros" },
                ...neighborhoods.map((n) => ({ value: n, label: n })),
              ],
            },
          ]}
          totalResults={filteredProperties.length}
          hasActiveFilters={hasActiveFilters}
          onReset={handleReset}
        />

        {/* Grade de Imóveis */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {filteredProperties.map((p) => (
              <PropertyCard key={p.slug} {...urbanPropertyToCard(p)} />
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-areia/80 p-12 text-center bg-white/40">
            <h3 className="font-display text-lg text-graphite">Nenhum imóvel encontrado</h3>
            <p className="mt-2 text-xs text-graphite/60 max-w-md mx-auto">
              Não encontramos imóveis para os filtros selecionados. Tente ajustar a busca ou limpar os filtros.
            </p>
            <button
              onClick={handleReset}
              className="mt-5 inline-flex items-center rounded-xs bg-mineral px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </Container>
    </main>
  );
}
