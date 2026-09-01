"use client";

import { useState, useMemo, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FilterBar } from "@/components/property/FilterBar";
import { PropertyCard } from "@/components/property/PropertyCard";
import { developmentToCard } from "@/components/property/adapters";
import { fetchDevelopments } from "@/lib/services/propertyService";
import { saveStoredDevelopments } from "@/lib/storage";
import type { Development, ScCity } from "@/types";

interface Props {
  initialDevelopments: Development[];
  initialCityFilter?: string;
  cityTitle?: string;
}

const cityTabs: { value: string; label: string }[] = [
  { value: "all", label: "Todas as Cidades" },
  { value: "porto-belo", label: "Porto Belo" },
  { value: "itapema", label: "Itapema" },
  { value: "balneario-camboriu", label: "Balneário Camboriú" },
];

export function DevelopmentCatalogView({
  initialDevelopments,
  initialCityFilter = "all",
  cityTitle,
}: Props) {
  const [dbDevs, setDbDevs] = useState<Development[]>(initialDevelopments);

  useEffect(() => {
    fetchDevelopments().then((devs) => {
      if (devs && devs.length > 0) {
        setDbDevs(devs);
        saveStoredDevelopments(devs);
      }
    });
  }, []);

  const [selectedCity, setSelectedCity] = useState<string>(initialCityFilter);
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const developments = dbDevs && dbDevs.length > 0 ? dbDevs : initialDevelopments;

  const filteredDevelopments = useMemo(() => {
    return developments.filter((dev) => {
      // Filtro de Cidade
      if (selectedCity !== "all" && dev.city !== selectedCity) return false;

      // Filtro de Estágio da Obra
      if (selectedStage !== "all" && dev.stage !== selectedStage) return false;

      // Busca por Texto
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = dev.name.toLowerCase().includes(q);
        const matchesNeighborhood = dev.neighborhood?.toLowerCase().includes(q);
        const matchesCity = dev.cityLabel.toLowerCase().includes(q);
        const matchesDesc = dev.shortDescription.toLowerCase().includes(q);
        if (!matchesName && !matchesNeighborhood && !matchesCity && !matchesDesc) return false;
      }

      return true;
    });
  }, [developments, selectedCity, selectedStage, searchQuery]);

  const hasActiveFilters =
    (initialCityFilter === "all" ? selectedCity !== "all" : false) ||
    selectedStage !== "all" ||
    searchQuery !== "";

  const handleReset = () => {
    setSelectedCity(initialCityFilter);
    setSelectedStage("all");
    setSearchQuery("");
  };

  return (
    <main className="py-8 md:py-12">
      <Container>
        {/* Trilha de Navegação */}
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Empreendimentos SC", href: "/empreendimentos" },
            ...(cityTitle ? [{ label: cityTitle }] : []),
          ]}
        />

        {/* Cabeçalho Editorial */}
        <div className="mb-8 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.15em] text-terracota font-semibold mb-2">
            Litoral de Santa Catarina
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-mineral font-normal tracking-tight">
            {cityTitle ? `Empreendimentos em ${cityTitle}` : "Empreendimentos de Alto Padrão"}
          </h1>
          <p className="mt-4 text-sm md:text-base text-graphite/70 leading-relaxed">
            Descubra lançamentos exclusivos, imóveis em construção e residenciais prontos para morar
            nas localizações mais valorizadas de Porto Belo, Itapema e Balneário Camboriú.
          </p>
        </div>

        {/* Abas Rápidas por Cidade (apenas na página geral) */}
        {initialCityFilter === "all" && (
          <div className="mb-6 flex flex-wrap gap-2 border-b border-areia/40 pb-4">
            {cityTabs.map((tab) => {
              const isActive = selectedCity === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setSelectedCity(tab.value)}
                  className={`focus-ring rounded-xs px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    isActive
                      ? "bg-mineral text-offwhite"
                      : "bg-white/80 text-graphite/70 hover:bg-areia/40 hover:text-graphite border border-areia/50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Barra de Filtros */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Buscar por nome do empreendimento ou bairro..."
          selects={[
            {
              id: "filter-stage",
              label: "Fase da Obra",
              value: selectedStage,
              onChange: setSelectedStage,
              options: [
                { value: "all", label: "Todas as Fases" },
                { value: "lancamento", label: "Lançamento" },
                { value: "em-obras", label: "Em Obras" },
                { value: "pronto", label: "Pronto para Morar" },
              ],
            },
          ]}
          totalResults={filteredDevelopments.length}
          hasActiveFilters={hasActiveFilters}
          onReset={handleReset}
        />

        {/* Grade de Resultados */}
        {filteredDevelopments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {filteredDevelopments.map((dev) => (
              <PropertyCard key={dev.slug} {...developmentToCard(dev)} />
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-areia/80 p-12 text-center bg-white/40">
            <h3 className="font-display text-lg text-graphite">Nenhum empreendimento encontrado</h3>
            <p className="mt-2 text-xs text-graphite/60 max-w-md mx-auto">
              Não encontramos nenhum imóvel correspondente aos filtros selecionados. Tente redefinir a busca ou fale com nossos consultores.
            </p>
            <button
              onClick={handleReset}
              className="mt-5 inline-flex items-center rounded-xs bg-mineral px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer"
            >
              Ver Todos os Empreendimentos
            </button>
          </div>
        )}
      </Container>
    </main>
  );
}
