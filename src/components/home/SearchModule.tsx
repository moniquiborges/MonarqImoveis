"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = "empreendimentos" | "campo-grande" | "rural";

const categories: { id: Category; label: string }[] = [
  { id: "empreendimentos", label: "Empreendimentos SC" },
  { id: "campo-grande", label: "Campo Grande" },
  { id: "rural", label: "Rural" },
];

const selectClasses =
  "focus-ring h-12 w-full rounded-sm border border-graphite/15 bg-white px-3 text-[14px] text-graphite/80";

export function SearchModule() {
  const router = useRouter();
  const [category, setCategory] = useState<Category>("empreendimentos");
  const [fields, setFields] = useState<Record<string, string>>({});

  function updateField(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function handleSearch() {
    const params = new URLSearchParams(Object.entries(fields).filter(([, v]) => v));
    const basePath =
      category === "empreendimentos"
        ? "/empreendimentos"
        : category === "campo-grande"
          ? "/imoveis/campo-grande"
          : "/rural";
    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  }

  return (
    <div className="w-full max-w-3xl rounded-sm bg-offwhite/95 p-2 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.4)] backdrop-blur-sm">
      <div className="flex gap-1 p-1">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setCategory(c.id);
              setFields({});
            }}
            className={cn(
              "focus-ring rounded-sm px-4 py-2 text-[13px] font-medium uppercase tracking-[0.06em] transition-colors",
              category === c.id ? "bg-mineral text-offwhite" : "text-graphite/60 hover:text-graphite",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 lg:grid-cols-4">
        {category === "empreendimentos" ? (
          <>
            <select className={selectClasses} onChange={(e) => updateField("cidade", e.target.value)} defaultValue="">
              <option value="">Cidade</option>
              <option value="porto-belo">Porto Belo</option>
              <option value="itapema">Itapema</option>
              <option value="balneario-camboriu">Balneário Camboriú</option>
            </select>
            <select className={selectClasses} onChange={(e) => updateField("estagio", e.target.value)} defaultValue="">
              <option value="">Estágio</option>
              <option value="lancamento">Lançamento</option>
              <option value="em-obras">Em obras</option>
              <option value="pronto">Pronto</option>
            </select>
            <select className={selectClasses} onChange={(e) => updateField("dormitorios", e.target.value)} defaultValue="">
              <option value="">Dormitórios</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
            <select className={selectClasses} onChange={(e) => updateField("valor", e.target.value)} defaultValue="">
              <option value="">Valor</option>
              <option value="0-800000">Até R$ 800 mil</option>
              <option value="800000-1500000">R$ 800 mil – 1,5 mi</option>
              <option value="1500000-">Acima de R$ 1,5 mi</option>
            </select>
          </>
        ) : null}

        {category === "campo-grande" ? (
          <>
            <input
              type="text"
              placeholder="Bairro"
              className={selectClasses}
              onChange={(e) => updateField("bairro", e.target.value)}
            />
            <select className={selectClasses} onChange={(e) => updateField("tipo", e.target.value)} defaultValue="">
              <option value="">Tipo de imóvel</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="condominio">Condomínio fechado</option>
              <option value="terreno">Terreno</option>
              <option value="comercial">Comercial</option>
            </select>
            <select className={selectClasses} onChange={(e) => updateField("dormitorios", e.target.value)} defaultValue="">
              <option value="">Dormitórios</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
            <select className={selectClasses} onChange={(e) => updateField("preco", e.target.value)} defaultValue="">
              <option value="">Preço</option>
              <option value="0-500000">Até R$ 500 mil</option>
              <option value="500000-1200000">R$ 500 mil – 1,2 mi</option>
              <option value="1200000-">Acima de R$ 1,2 mi</option>
            </select>
          </>
        ) : null}

        {category === "rural" ? (
          <>
            <select className={selectClasses} onChange={(e) => updateField("estado", e.target.value)} defaultValue="">
              <option value="">Estado</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MT">Mato Grosso</option>
            </select>
            <select className={selectClasses} onChange={(e) => updateField("atividade", e.target.value)} defaultValue="">
              <option value="">Atividade</option>
              <option value="agricultura">Agricultura</option>
              <option value="pecuaria">Pecuária</option>
              <option value="investimento">Investimento</option>
            </select>
            <select className={selectClasses} onChange={(e) => updateField("hectares", e.target.value)} defaultValue="">
              <option value="">Faixa de hectares</option>
              <option value="0-500">Até 500 ha</option>
              <option value="500-2000">500 – 2.000 ha</option>
              <option value="2000-">Acima de 2.000 ha</option>
            </select>
          </>
        ) : null}

        <button
          type="button"
          onClick={handleSearch}
          className="focus-ring flex h-12 items-center justify-center gap-2 rounded-sm bg-terracota px-4 text-[13px] font-medium uppercase tracking-[0.1em] text-offwhite transition-colors hover:bg-terracota-light"
        >
          <Search className="h-4 w-4" />
          Buscar
        </button>
      </div>
    </div>
  );
}
