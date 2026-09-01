"use client";

import { useState, useMemo, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar } from "@/components/property/FilterBar";
import { PropertyCard } from "@/components/property/PropertyCard";
import { ruralPropertyToCard } from "@/components/property/adapters";
import { mockRuralProperties } from "@/lib/mock/rural";
import { getStoredRuralProperties, saveStoredRuralProperties, useLiveStoredData } from "@/lib/storage";
import { fetchRuralProperties } from "@/lib/services/propertyService";
import { ruralActivityLabels } from "@/lib/labels";
import type { RuralProperty, RuralActivity } from "@/types";

export default function RuralPage() {
  const [ruralProperties, setRuralProperties] = useLiveStoredData<RuralProperty[]>(
    getStoredRuralProperties,
    mockRuralProperties,
    "rural"
  );

  useEffect(() => {
    fetchRuralProperties().then((dbRural) => {
      if (dbRural && dbRural.length > 0) {
        setRuralProperties(() => dbRural);
        saveStoredRuralProperties(dbRural);
      }
    });
  }, [setRuralProperties]);

  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedActivity, setSelectedActivity] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProperties = useMemo(() => {
    return ruralProperties.filter((item) => {
      // Estado (MS / MT / etc)
      if (selectedState !== "all" && item.state !== selectedState) return false;

      // Finalidade (Venda / Arrendamento)
      if (selectedActivity !== "all" && !item.activity.includes(selectedActivity as RuralActivity)) {
        return false;
      }

      // Tipo de Imóvel Rural (Fazendas, Chácaras, Sítio, Ranchos)
      if (selectedType !== "all" && item.type !== selectedType) {
        return false;
      }

      // Busca por Texto
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesMunicipality = item.municipality.toLowerCase().includes(q);
        const matchesCode = item.code.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMunicipality && !matchesCode) return false;
      }

      return true;
    });
  }, [selectedState, selectedActivity, selectedType, searchQuery]);

  const hasActiveFilters =
    selectedState !== "all" || selectedActivity !== "all" || selectedType !== "all" || searchQuery !== "";

  const handleReset = () => {
    setSelectedState("all");
    setSelectedActivity("all");
    setSelectedType("all");
    setSearchQuery("");
  };

  return (
    <main className="py-8 md:py-12">
      <Container>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Propriedades Rurais & Agronegócio" },
          ]}
        />

        {/* Cabeçalho Editorial */}
        <div className="mb-8 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.15em] text-terracota font-semibold mb-2">
            Agronegócio no Centro-Oeste
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-mineral font-normal tracking-tight">
            Fazendas e Áreas Rurais (MS &amp; MT)
          </h1>
          <p className="mt-4 text-sm md:text-base text-graphite/70 leading-relaxed">
            Curadoria especializada em propriedades rurais de grande escala para agricultura, pecuária intensiva
            e ativos florestais/investimento nos polos mais produtivos de Mato Grosso do Sul e Mato Grosso.
          </p>
        </div>

        {/* Barra de Filtros */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Buscar por nome da fazenda, município ou código (ex: MRQ-R201)..."
          selects={[
            {
              id: "filter-state",
              label: "Estado",
              value: selectedState,
              onChange: setSelectedState,
              options: [
                { value: "all", label: "Todos os Estados" },
                { value: "MS", label: "Mato Grosso do Sul (MS)" },
                { value: "MT", label: "Mato Grosso (MT)" },
                { value: "GO", label: "Goiás (GO)" },
                { value: "MG", label: "Minas Gerais (MG)" },
                { value: "SP", label: "São Paulo (SP)" },
                { value: "PR", label: "Paraná (PR)" },
                { value: "BA", label: "Bahia (BA)" },
                { value: "PI", label: "Piauí (PI)" },
                { value: "MA", label: "Maranhão (MA)" },
                { value: "TO", label: "Tocantins (TO)" },
                { value: "PA", label: "Pará (PA)" },
              ],
            },
            {
              id: "filter-activity",
              label: "Atividade / Finalidade",
              value: selectedActivity,
              onChange: setSelectedActivity,
              options: [
                { value: "all", label: "Todas as Finalidades" },
                { value: "venda", label: "Venda" },
                { value: "arrendamento", label: "Arrendamento" },
              ],
            },
            {
              id: "filter-type",
              label: "Tipo de Imóvel",
              value: selectedType,
              onChange: setSelectedType,
              options: [
                { value: "all", label: "Todos os Tipos" },
                { value: "fazenda", label: "Fazendas" },
                { value: "chacara", label: "Chácaras" },
                { value: "sitio", label: "Sítio" },
                { value: "rancho", label: "Ranchos" },
              ],
            },
          ]}
          totalResults={filteredProperties.length}
          hasActiveFilters={hasActiveFilters}
          onReset={handleReset}
        />

        {/* Grade de Propriedades Rurais */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {filteredProperties.map((p) => (
              <PropertyCard key={p.slug} {...ruralPropertyToCard(p)} />
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-areia/80 p-12 text-center bg-white/40">
            <h3 className="font-display text-lg text-graphite">Nenhuma propriedade rural encontrada</h3>
            <p className="mt-2 text-xs text-graphite/60 max-w-md mx-auto">
              Temos um portfólio de fazendas exclusivas sob sigilo comercial (off-market). Entre em contato diretamente com nossa divisão agro.
            </p>
            <button
              onClick={handleReset}
              className="mt-5 inline-flex items-center rounded-xs bg-mineral px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </Container>
    </main>
  );
}
