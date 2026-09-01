"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  LandPlot,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Edit2,
  X,
  Sprout,
  Calculator,
  Sparkles,
  Copy,
  Check,
  Loader2,
  TreePine,
  CheckCircle2,
} from "lucide-react";
import { mockRuralProperties } from "@/lib/mock/rural";
import { ruralActivityLabels } from "@/lib/labels";
import { formatBRL } from "@/lib/utils";
import {
  getStoredRuralProperties,
  saveStoredRuralProperties,
  useLiveStoredData,
} from "@/lib/storage";
import {
  fetchRuralProperties,
  saveRuralPropertyToDb,
  deleteRuralPropertyFromDb,
} from "@/lib/services/propertyService";
import { CurrencyInput } from "@/components/admin/CurrencyInput";
import { ImageUpload, ImageData } from "@/components/admin/ImageUpload";
import type { RuralProperty, RuralActivity, RuralState } from "@/types";

export default function AdminRuralPage() {
  const [items, setItems] = useLiveStoredData<RuralProperty[]>(
    getStoredRuralProperties,
    mockRuralProperties,
    "rural"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Diferenciais / Benfeitorias
  const [featureInput, setFeatureInput] = useState("");

  // Sincroniza dados com o Supabase no carregamento inicial
  useEffect(() => {
    fetchRuralProperties().then((dbProps) => {
      if (dbProps && dbProps.length > 0) {
        setItems(() => dbProps);
        saveStoredRuralProperties(dbProps);
      }
    });
  }, [setItems]);

  const [formData, setFormData] = useState<{
    code: string;
    title: string;
    state: RuralState;
    municipality: string;
    totalHectares: string | number;
    activity: RuralActivity;
    price: number | null;
    description: string;
    features: string[];
    coverImage: ImageData;
    gallery: ImageData[];
  }>({
    code: "MRQ-R201",
    title: "",
    state: "MS",
    municipality: "",
    totalHectares: "",
    activity: "pecuaria",
    price: null,
    description: "",
    features: [],
    coverImage: {
      url: "",
      alt: "",
    },
    gallery: [],
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleCopyShortLink = (code: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.monarqinvest.com.br";
    const shortUrl = `${origin}/i/${code}`;
    navigator.clipboard.writeText(shortUrl);
    showToast(`✓ Link curto copiado: ${shortUrl}`);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchMun = item.municipality.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        if (!matchTitle && !matchMun && !matchCode) return false;
      }
      return true;
    });
  }, [items, searchQuery]);

  const handleAddFeature = (text?: string) => {
    const val = (text || featureInput).trim();
    if (!val) return;
    if (!formData.features.includes(val)) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, val] }));
    }
    if (!text) setFeatureInput("");
  };

  const handleRemoveFeature = (idxToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== idxToRemove),
    }));
  };

  const handleExtractFeaturesFromDescription = () => {
    const text = `${formData.title} ${formData.description}`.toLowerCase();
    const extracted: string[] = [];

    const KEYWORD_MAP: Array<{ regex: RegExp; label: string }> = [
      { regex: /sede|casa\s*principal|climatizad/i, label: "Sede com Casa Principal Climatizada" },
      { regex: /curral|brete|balan[çc]a|embarcad/i, label: "Curral Completo com Balança e Embarcadouro" },
      { regex: /barrac[aã]o|galp[aã]o|oficina/i, label: "Barracão para Maquinários e Oficina" },
      { regex: /po[çc]o\s*artesiano|caixa\s*d['\s]?água/i, label: "Poço Artesiano com Alta Vazão" },
      { regex: /piv[oô]|irriga[çc]/i, label: "Pivôs Centrais de Irrigação" },
      { regex: /pista\s*(de\s*)?pouso|hangar/i, label: "Pista de Pouso Homologada" },
      { regex: /cerca|aroeira|arame/i, label: "Cercas Novas em Aroeira e Arame Liso" },
      { regex: /represa|c[oó]rrego|nascente|rio/i, label: "Represas, Córregos e Nascentes Próprias" },
      { regex: /trif[aá]sic|energia\s*el[eé]tric/i, label: "Energia Elétrica Trifásica" },
      { regex: /car|geo|georreferenc|matr[íi]cula/i, label: "Documentação 100% Regularizada (CAR e GEO)" },
      { regex: /confinamento/i, label: "Estrutura para Confinamento Bovino" },
      { regex: /casa.*(funcion[aá]rio|colaborador|alojamento)/i, label: "Casas para Colaboradores e Alojamento" },
      { regex: /retiro/i, label: "Retiro Operacional com Estrutura Completa" },
      { regex: /pastagem|brachiaria|momba[çc]a/i, label: "Pastagens Formadas e Piqueteadas" },
    ];

    // 1. Extrai tópicos explícitos caso haja listas
    const lines = formData.description.split("\n");
    for (const line of lines) {
      const match = line.match(/^[\s*•\-–\d.)]+\s*(.+)$/);
      if (match && match[1] && match[1].trim().length > 3 && match[1].trim().length < 80) {
        const item = match[1].trim();
        if (!extracted.includes(item) && !formData.features.includes(item)) {
          extracted.push(item);
        }
      }
    }

    // 2. Extrai por palavras-chave inteligentes
    KEYWORD_MAP.forEach(({ regex, label }) => {
      if (regex.test(text) && !extracted.includes(label) && !formData.features.includes(label)) {
        extracted.push(label);
      }
    });

    if (extracted.length > 0) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, ...extracted] }));
      showToast(`✓ ${extracted.length} benfeitorias/diferenciais adicionados com sucesso!`);
    } else {
      showToast("Nenhuma benfeitoria detectada automaticamente. Você pode selecionar das sugestões ou digitar abaixo!");
    }
  };

  const handleOpenCreate = () => {
    setEditingSlug(null);
    const nextCode = `MRQ-R${200 + items.length + 1}`;
    setFormData({
      code: nextCode,
      title: "",
      state: "MS",
      municipality: "",
      totalHectares: "",
      activity: "pecuaria",
      price: null,
      description: "",
      features: [],
      coverImage: {
        url: "",
        alt: "",
      },
      gallery: [],
    });
    setFeatureInput("");
    setModalOpen(true);
  };

  const handleOpenEdit = (prop: RuralProperty) => {
    setEditingSlug(prop.slug);
    setFormData({
      code: prop.code || `MRQ-R${200 + items.findIndex((i) => i.slug === prop.slug) + 1}`,
      title: prop.title,
      state: (prop.state as RuralState) || "MS",
      municipality: prop.municipality,
      totalHectares: prop.totalHectares || "",
      activity: prop.activity[0] || "pecuaria",
      price: prop.price,
      description: prop.description || "",
      features: prop.features || [],
      coverImage: prop.coverImage || { url: "", alt: prop.title },
      gallery: prop.gallery || [],
    });
    setFeatureInput("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Por favor, preencha o nome da fazenda.");
      return;
    }

    setIsSaving(true);

    try {
      const ha = Number(formData.totalHectares) || 1;
      const price = formData.price;
      const pricePerHectare = price ? Math.round(price / ha) : undefined;
      const code = formData.code.trim().toUpperCase() || `MRQ-R${200 + items.length + 1}`;

      const rawSlug =
        formData.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w ]+/g, "")
          .replace(/ +/g, "-") || `rural-${Date.now()}`;

      let updated: RuralProperty[];
      if (editingSlug) {
        updated = items.map((item) => {
          if (item.slug === editingSlug) {
            return {
              ...item,
              code,
              title: formData.title,
              state: formData.state,
              municipality: formData.municipality || "Centro-Oeste",
              totalHectares: ha,
              activity: [formData.activity],
              price,
              pricePerHectare,
              description: formData.description.trim() || undefined,
              features: formData.features,
              coverImage: {
                url: formData.coverImage.url || "",
                alt: formData.coverImage.alt || formData.title,
              },
              gallery: formData.gallery.map((g) => ({
                url: g.url,
                alt: g.alt || formData.title,
              })),
            };
          }
          return item;
        });
      } else {
        const created: RuralProperty = {
          slug: rawSlug,
          code,
          title: formData.title,
          state: formData.state,
          municipality: formData.municipality || "Centro-Oeste",
          totalHectares: ha,
          activity: [formData.activity],
          price,
          pricePerHectare,
          description: formData.description.trim() || undefined,
          features: formData.features,
          badges: ["oportunidade"],
          coverImage: {
            url: formData.coverImage.url || "",
            alt: formData.coverImage.alt || formData.title,
          },
          gallery: formData.gallery.map((g) => ({
            url: g.url,
            alt: g.alt || formData.title,
          })),
        };

        updated = [created, ...items];
      }

      setItems(() => updated);
      saveStoredRuralProperties(updated);

      // Sincroniza diretamente com o Supabase via Server API
      const targetRural = updated.find((r) => r.slug === (editingSlug || rawSlug));
      if (targetRural) {
        const res = await saveRuralPropertyToDb(targetRural);
        if (!res.success) {
          console.error("Erro no salvamento Supabase:", res.error);
        }
      }

      showToast(`✓ Propriedade rural "${formData.title}" salva e sincronizada na nuvem!`);
      setModalOpen(false);
    } catch (err: any) {
      console.error("Erro ao salvar fazenda:", err);
      alert("Erro ao salvar propriedade rural: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (confirm("Tem certeza que deseja remover esta propriedade rural?")) {
      const updated = items.filter((i) => i.slug !== slug);
      setItems(() => updated);
      saveStoredRuralProperties(updated);

      const res = await deleteRuralPropertyFromDb(slug);
      if (!res) {
        console.error("Erro ao remover no Supabase");
      }
      showToast("✓ Propriedade rural removida com sucesso.");
    }
  };

  const calculatedPricePerHa =
    formData.price && Number(formData.totalHectares) > 0
      ? Math.round(formData.price / Number(formData.totalHectares))
      : null;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Toast de Sucesso */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xs bg-mineral px-5 py-3 text-offwhite shadow-lg flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold">
            Agronegócio Centro-Oeste
          </span>
          <h1 className="font-display text-2xl md:text-3xl text-graphite font-normal">
            Propriedades Rurais
          </h1>
          <p className="text-xs md:text-sm text-graphite/60 mt-0.5">
            Gestão de fazendas para agricultura, pecuária e investimentos com link curto e sincronização na nuvem.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xs bg-mineral px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Nova Propriedade Rural
        </button>
      </div>

      {/* Busca */}
      <div className="rounded-sm border border-areia/60 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-graphite/40" />
          <input
            type="text"
            placeholder="Buscar por nome da fazenda, município ou código (ex: MRQ-R201)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 py-1.5 pl-9 pr-3 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
          />
        </div>

        <div className="text-xs text-graphite/60 font-medium">
          Total: {filteredItems.length} fazendas cadastradas
        </div>
      </div>

      {/* Tabela de Propriedades Rurais */}
      <div className="rounded-sm border border-areia/60 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-graphite">
            <thead>
              <tr className="border-b border-areia/40 bg-offwhite/50 text-graphite/60 uppercase tracking-wider text-[11px]">
                <th className="p-4 font-semibold">Propriedade &amp; Código</th>
                <th className="p-4 font-semibold">Município / Estado</th>
                <th className="p-4 font-semibold">Área Total</th>
                <th className="p-4 font-semibold">Aptidão</th>
                <th className="p-4 font-semibold">Valor Total</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-areia/30">
              {filteredItems.map((item) => (
                <tr key={item.slug} className="hover:bg-offwhite/30 transition-colors">
                  {/* Foto e Nome */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded-xs bg-areia/40 shrink-0 border border-areia/60">
                        {item.coverImage?.url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={item.coverImage.url}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-graphite/40">
                            <Sprout className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-graphite text-sm">{item.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <button
                            type="button"
                            onClick={() => handleCopyShortLink(item.code)}
                            title="Clique para copiar link curto"
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-mineral hover:underline font-semibold cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                            {item.code}
                          </button>
                          {item.gallery && item.gallery.length > 0 && (
                            <span className="text-[10px] bg-areia/40 text-graphite/70 px-1.5 py-0.2 rounded-xs">
                              +{item.gallery.length} fotos
                            </span>
                          )}
                          {item.features && item.features.length > 0 && (
                            <span className="text-[10px] bg-mineral/10 text-mineral px-1.5 py-0.2 rounded-xs font-medium">
                              {item.features.length} benfeitorias
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Município / Estado */}
                  <td className="p-4">
                    <div className="font-medium text-graphite">{item.municipality}</div>
                    <div className="text-graphite/50 text-[11px] font-semibold">{item.state}</div>
                  </td>

                  {/* Área */}
                  <td className="p-4">
                    <strong className="text-graphite font-semibold">
                      {item.totalHectares.toLocaleString("pt-BR")} ha
                    </strong>
                    <div className="text-[11px] text-graphite/50">
                      ~{(item.totalHectares / 2.42).toFixed(0)} alqueires
                    </div>
                  </td>

                  {/* Aptidão */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {item.activity.map((act) => (
                        <span
                          key={act}
                          className="rounded-xs bg-mineral/10 px-2 py-0.5 text-[10px] font-semibold text-mineral"
                        >
                          {ruralActivityLabels[act]}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Preço */}
                  <td className="p-4">
                    <div className="font-semibold text-mineral text-sm">
                      {item.price ? formatBRL(item.price) : "Sob Consulta"}
                    </div>
                    {item.pricePerHectare && (
                      <div className="text-[11px] text-graphite/50">
                        {formatBRL(item.pricePerHectare)} / ha
                      </div>
                    )}
                  </td>

                  {/* Ações */}
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyShortLink(item.code)}
                        title="Copiar Link Curto (/i/CODIGO)"
                        className="rounded-xs p-1.5 text-graphite/60 hover:bg-areia/50 hover:text-mineral transition-colors cursor-pointer"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        title="Editar fazenda"
                        className="rounded-xs p-1.5 text-graphite/60 hover:bg-areia/50 hover:text-mineral transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <Link
                        href={`/rural/${item.slug}`}
                        target="_blank"
                        title="Ver no site público"
                        className="rounded-xs p-1.5 text-graphite/60 hover:bg-areia/40 hover:text-mineral transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.slug)}
                        title="Remover"
                        className="rounded-xs p-1.5 text-graphite/60 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nova / Editar Propriedade Rural */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/60 backdrop-blur-xs p-4 animate-fade-in"
        >
          <div className="relative w-full max-w-3xl rounded-sm bg-white p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-areia/40 pb-4 mb-6">
              <div>
                <h3 className="font-display text-xl text-graphite font-medium">
                  {editingSlug ? "Editar Propriedade Rural" : "Nova Propriedade Rural"}
                </h3>
                <p className="text-xs text-graphite/60">
                  Cadastre dados de área, aptidão, descrição, benfeitorias, fotografias e valor total.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1.5 text-graphite/50 hover:bg-offwhite hover:text-graphite transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Nome da Fazenda & Código de Referência */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Nome da Fazenda / Propriedade *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Fazenda Santa Helena - Dupla Aptidão"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Código de Ref. / Link Curto
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: MRQ-R201"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite font-mono uppercase font-semibold"
                  />
                  <span className="text-[10px] text-graphite/50 block mt-0.5">
                    Link curto: <code className="text-mineral">/i/{formData.code || "CODIGO"}</code>
                  </span>
                </div>
              </div>

              {/* Upload de Imagens com Estrela de Capa */}
              <ImageUpload
                label="Fotografias da Propriedade Rural"
                helperText="Envie várias fotos de uma vez. A 1ª foto se torna a capa automaticamente ou clique na estrela (★) para escolher a capa."
                category="rural"
                coverImage={formData.coverImage}
                gallery={formData.gallery}
                onChangeImages={(cover, gal) =>
                  setFormData((prev) => ({
                    ...prev,
                    coverImage: cover,
                    gallery: gal,
                  }))
                }
                allowGallery={true}
              />

              {/* Estado e Município */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Estado *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value as RuralState })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite cursor-pointer"
                  >
                    <option value="MS">Mato Grosso do Sul (MS)</option>
                    <option value="MT">Mato Grosso (MT)</option>
                    <option value="GO">Goiás (GO)</option>
                    <option value="MG">Minas Gerais (MG)</option>
                    <option value="SP">São Paulo (SP)</option>
                    <option value="PR">Paraná (PR)</option>
                    <option value="BA">Bahia (BA)</option>
                    <option value="PI">Piauí (PI)</option>
                    <option value="MA">Maranhão (MA)</option>
                    <option value="TO">Tocantins (TO)</option>
                    <option value="PA">Pará (PA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Município *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ribas do Rio Pardo, Rondonópolis, Maracaju..."
                    value={formData.municipality}
                    onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              {/* Área Total e Aptidão */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Área Total (Hectares) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Ex: 1500"
                    value={formData.totalHectares}
                    onChange={(e) =>
                      setFormData({ ...formData, totalHectares: e.target.value })
                    }
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                  {Number(formData.totalHectares) > 0 && (
                    <span className="text-[11px] text-graphite/50 mt-1 block">
                      Equivalente a {(Number(formData.totalHectares) / 2.42).toFixed(0)} alqueires paulistas
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Aptidão Principal *
                  </label>
                  <select
                    value={formData.activity}
                    onChange={(e) =>
                      setFormData({ ...formData, activity: e.target.value as RuralActivity })
                    }
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite cursor-pointer"
                  >
                    <option value="pecuaria">Pecuária (Cria, Recria, Engorda)</option>
                    <option value="agricultura">Agricultura / Lavoura de Soja &amp; Milho</option>
                    <option value="investimento">Investimento / Silvicultura (Eucalipto)</option>
                    <option value="arrendamento">Arrendamento Rural</option>
                    <option value="venda">Venda Geral / Oportunidade</option>
                  </select>
                </div>
              </div>

              {/* Valor Total com CurrencyInput */}
              <div className="space-y-2">
                <CurrencyInput
                  label="Valor Total da Propriedade (R$)"
                  value={formData.price ?? 0}
                  onChange={(numVal) => setFormData({ ...formData, price: numVal === 0 ? null : numVal })}
                  placeholder="Ex: 25.000.000 ou 25 milhões"
                  helperText="Aceita valores em milhões com ponto ou texto (ex: 15.000.000 ou 15 mi)."
                  allowSobConsulta={true}
                />

                {calculatedPricePerHa && (
                  <div className="flex items-center gap-2 p-2 rounded-xs bg-mineral/5 border border-mineral/20 text-xs text-mineral font-medium">
                    <Calculator className="h-4 w-4 shrink-0" />
                    <span>
                      Custo por Hectare calculado: <strong>{formatBRL(calculatedPricePerHa)} / ha</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Descrição Detalhada da Fazenda (Opcional) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-graphite">
                    Descrição Detalhada da Fazenda <span className="text-graphite/40 font-normal">(Opcional)</span>
                  </label>
                  <span className="text-[10px] text-graphite/50">
                    Se deixado em branco, a seção não aparece no site.
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Escreva detalhes sobre a fazenda, topografia, tipo de solo, regime de chuvas, recursos hídricos, histórico de produtividade, etc. Caso não preencha, a seção não aparecerá no site."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite placeholder:text-graphite/40 leading-relaxed"
                />
              </div>

              {/* Seção: Benfeitorias e Infraestrutura Rural */}
              <div className="rounded-xs border border-areia/60 bg-offwhite/20 p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-areia/40 pb-3">
                  <div>
                    <h4 className="text-xs font-semibold text-graphite uppercase tracking-wider flex items-center gap-1.5">
                      <TreePine className="h-4 w-4 text-mineral" />
                      Benfeitorias e Infraestrutura Operacional
                    </h4>
                    <p className="text-[11px] text-graphite/60 mt-0.5">
                      Adicione itens que valorizam a fazenda (sede, currais, poços, barracões, pivôs, etc.).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleExtractFeaturesFromDescription}
                    className="inline-flex items-center gap-1.5 rounded-xs bg-mineral/10 px-3 py-1.5 text-xs font-semibold text-mineral hover:bg-mineral/20 transition-colors cursor-pointer shrink-0"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-terracota" />
                    ✨ Puxar da Descrição
                  </button>
                </div>

                {/* Input para Adicionar Novo Item */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite uma benfeitoria (ex: Sede Climatizada, Curral com Balança, Poço Artesiano...)"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    className="focus-ring flex-1 rounded-xs border border-areia/70 bg-white px-3 py-2 text-xs text-graphite placeholder:text-graphite/40"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddFeature()}
                    className="rounded-xs bg-mineral px-4 py-2 text-xs font-semibold text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shrink-0"
                  >
                    Adicionar
                  </button>
                </div>

                {/* Sugestões Rápidas de 1 Clique */}
                <div>
                  <span className="text-[11px] text-graphite/50 block mb-1.5">
                    Sugestões rápidas (clique para adicionar):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Sede com Casa Principal Climatizada",
                      "Curral Completo com Balança e Embarcadouro",
                      "Barracão de Máquinas e Oficina",
                      "Poço Artesiano com Alta Vazão",
                      "Energia Elétrica Trifásica",
                      "Cercas Novas em Aroeira e Arame Liso",
                      "Casas para Colaboradores e Alojamento",
                      "Represas, Córregos e Nascentes Próprias",
                      "Pivôs Centrais de Irrigação",
                      "Pista de Pouso Homologada",
                      "Estrutura para Confinamento Bovino",
                      "Documentação 100% Regularizada (CAR e GEO)",
                    ].map((sug, idx) => {
                      const isAdded = formData.features.includes(sug);
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddFeature(sug)}
                          className={`rounded-full px-2.5 py-1 text-[11px] transition-all cursor-pointer ${
                            isAdded
                              ? "bg-areia/40 text-graphite/40 cursor-not-allowed"
                              : "bg-white border border-areia/70 text-graphite/80 hover:border-mineral hover:text-mineral hover:bg-mineral/5"
                          }`}
                        >
                          {isAdded ? `✓ ${sug}` : `+ ${sug}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lista de Itens Adicionados */}
                {formData.features.length > 0 ? (
                  <div className="pt-2">
                    <span className="text-[11px] font-medium text-graphite/70 block mb-1.5">
                      Itens que aparecerão no anúncio ({formData.features.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 rounded-xs bg-mineral/10 border border-mineral/20 px-2.5 py-1 text-xs text-mineral font-medium"
                        >
                          <Check className="h-3 w-3 text-mineral" />
                          <span>{feat}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(idx)}
                            className="hover:text-rose-600 ml-1 cursor-pointer"
                            title="Remover"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-3 text-[11px] text-graphite/50 italic">
                    Nenhuma benfeitoria adicionada ainda. Use as sugestões acima ou clique em &quot;✨ Puxar da Descrição&quot;.
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-areia/40">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xs border border-areia/60 px-4 py-2 text-xs font-medium text-graphite hover:bg-offwhite transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xs bg-mineral px-6 py-2 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingSlug ? "Atualizar Fazenda" : "Salvar Fazenda"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
