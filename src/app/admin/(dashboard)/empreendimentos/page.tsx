"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Sparkles,
  MapPin,
  Waves,
  Calendar,
  BedDouble,
  Ruler,
  Copy,
  Check,
} from "lucide-react";
import { mockDevelopments } from "@/lib/mock/developments";
import { stageLabels } from "@/lib/labels";
import { formatBRL, formatArea } from "@/lib/utils";
import {
  getStoredDevelopments,
  saveStoredDevelopments,
  useLiveStoredData,
} from "@/lib/storage";
import {
  fetchDevelopments,
  saveDevelopmentToDb,
  deleteDevelopmentFromDb,
} from "@/lib/services/propertyService";
import { CurrencyInput } from "@/components/admin/CurrencyInput";
import { ImageUpload, ImageData } from "@/components/admin/ImageUpload";
import type { Development, ScCity, DevelopmentStage } from "@/types";

export default function AdminEmpreendimentosPage() {
  const [items, setItems] = useLiveStoredData<Development[]>(
    getStoredDevelopments,
    mockDevelopments,
    "developments"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState("");

  // Sincroniza dados com o Supabase no carregamento inicial
  useEffect(() => {
    fetchDevelopments().then((dbDevs) => {
      if (dbDevs && dbDevs.length > 0) {
        setItems(() => dbDevs);
        saveStoredDevelopments(dbDevs);
      }
    });
  }, [setItems]);

  // Form State
  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    city: ScCity;
    neighborhood: string;
    stage: DevelopmentStage;
    priceFrom: number | null;
    deliveryDate: string;
    shortDescription: string;
    description: string;
    features: string[];
    bedroomsMin: number;
    bedroomsMax: number;
    areaMin: number;
    areaMax: number;
    distanceToSea: string;
    coverImage: ImageData;
    gallery: ImageData[];
  }>({
    code: "MRQ-SC101",
    name: "",
    city: "porto-belo",
    neighborhood: "Perequê",
    stage: "lancamento",
    priceFrom: 1850000,
    deliveryDate: "2028",
    shortDescription: "",
    description: "",
    features: [],
    bedroomsMin: 2,
    bedroomsMax: 4,
    areaMin: 100,
    areaMax: 220,
    distanceToSea: "Frente-mar",
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

  const handleCopyShortLink = (codeOrSlug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.monarqinvest.com.br";
    const shortUrl = `${origin}/i/${codeOrSlug}`;
    navigator.clipboard.writeText(shortUrl);
    showToast(`✓ Link curto copiado: ${shortUrl}`);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCity = item.cityLabel.toLowerCase().includes(q);
        const matchNeigh = item.neighborhood?.toLowerCase().includes(q);
        const matchCode = (item as any).code?.toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchNeigh && !matchCode) return false;
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
    const text = `${formData.name} ${formData.description} ${formData.shortDescription}`.toLowerCase();
    const extracted: string[] = [];

    const KEYWORD_MAP: Array<{ regex: RegExp; label: string }> = [
      { regex: /piscina/i, label: "Piscina com Deck Molhado" },
      { regex: /churrasqueira|gourmet/i, label: "Espaço Gourmet e Salão de Festas" },
      { regex: /academia|fitness/i, label: "Academia Equipada com Vista Panorâmica" },
      { regex: /hall|p[eé][\s-]direito/i, label: "Hall de Entrada com Pé-Direito Duplo" },
      { regex: /biom[eé]tric|facial|acesso/i, label: "Fechaduras Biométricas e Controle Facial" },
      { regex: /automa[çc][ãa]o/i, label: "Infraestrutura para Automação Residencial" },
      { regex: /el[eé]trico|recarga/i, label: "Vagas Preparadas para Carro Elétrico" },
      { regex: /spa|sauna/i, label: "Spa com Hidromassagem e Sauna" },
      { regex: /cinema|jogos|game/i, label: "Cinema Privativo e Sala de Jogos" },
      { regex: /brinquedoteca|kids/i, label: "Brinquedoteca e Espaço Kids" },
      { regex: /paisagismo|jardim/i, label: "Paisagismo Assinado" },
      { regex: /frente[\s-]mar|vista[\s-]mar/i, label: "Vista Panorâmica para o Mar" },
      { regex: /elevador/i, label: "Elevadores de Alta Velocidade" },
      { regex: /gerador/i, label: "Gerador de Energia Próprio" },
    ];

    // 1. Extrai tópicos explícitos da descrição caso haja listas (ex: "- Item", "• Item", "1. Item")
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

    // 2. Extrai por detecção de palavras-chave inteligentes
    KEYWORD_MAP.forEach(({ regex, label }) => {
      if (regex.test(text) && !extracted.includes(label) && !formData.features.includes(label)) {
        extracted.push(label);
      }
    });

    if (extracted.length > 0) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, ...extracted] }));
      showToast(`✓ ${extracted.length} diferenciais adicionados com sucesso!`);
    } else {
      showToast("Nenhum novo diferencial detectado na descrição. Você pode digitar abaixo!");
    }
  };

  const handleOpenCreate = () => {
    setEditingSlug(null);
    const nextCode = `MRQ-SC${100 + items.length + 1}`;
    setFormData({
      code: nextCode,
      name: "",
      city: "porto-belo",
      neighborhood: "Perequê",
      stage: "lancamento",
      priceFrom: 1850000,
      deliveryDate: "2028",
      shortDescription: "",
      description: "",
      features: [],
      bedroomsMin: 2,
      bedroomsMax: 4,
      areaMin: 100,
      areaMax: 220,
      distanceToSea: "Frente-mar",
      coverImage: {
        url: "",
        alt: "",
      },
      gallery: [],
    });
    setFeatureInput("");
    setModalOpen(true);
  };

  const handleOpenEdit = (dev: Development) => {
    setEditingSlug(dev.slug);
    setFormData({
      code: (dev as any).code || `MRQ-SC${100 + items.findIndex((i) => i.slug === dev.slug) + 1}`,
      name: dev.name,
      city: dev.city,
      neighborhood: dev.neighborhood || "Perequê",
      stage: dev.stage,
      priceFrom: dev.priceFrom ?? null,
      deliveryDate: dev.deliveryDate || "2028",
      shortDescription: dev.shortDescription || "",
      description: dev.description || "",
      features: dev.features || [],
      bedroomsMin: dev.bedroomsRange ? dev.bedroomsRange[0] : 2,
      bedroomsMax: dev.bedroomsRange ? dev.bedroomsRange[1] : 4,
      areaMin: dev.areaRange ? dev.areaRange[0] : 100,
      areaMax: dev.areaRange ? dev.areaRange[1] : 220,
      distanceToSea: dev.distanceToSea || "Frente-mar",
      coverImage: dev.coverImage || { url: "", alt: dev.name },
      gallery: dev.gallery || [],
    });
    setFeatureInput("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Por favor, preencha o nome do empreendimento.");
      return;
    }

    setIsSaving(true);

    try {
      const cityLabels: Record<ScCity, string> = {
        "porto-belo": "Porto Belo",
        itapema: "Itapema",
        "balneario-camboriu": "Balneário Camboriú",
      };

      const cityLabel = cityLabels[formData.city] || "Porto Belo";
      const rawSlug =
        formData.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w ]+/g, "")
          .replace(/ +/g, "-") || `dev-${Date.now()}`;

      let updated: Development[];
      const code = formData.code.trim().toUpperCase() || `MRQ-SC${100 + items.length + 1}`;

      if (editingSlug) {
        updated = items.map((item) => {
          if (item.slug === editingSlug) {
            return {
              ...item,
              code,
              name: formData.name,
              city: formData.city,
              cityLabel,
              neighborhood: formData.neighborhood || "Centro",
              stage: formData.stage,
              deliveryDate: formData.deliveryDate,
              shortDescription:
                formData.shortDescription ||
                `Empreendimento exclusivo de alto padrão em ${cityLabel}, no bairro ${formData.neighborhood}.`,
              description: formData.description.trim() || undefined,
              features: formData.features,
              priceFrom: formData.priceFrom ?? undefined,
              bedroomsRange: [Number(formData.bedroomsMin) || 2, Number(formData.bedroomsMax) || 4],
              areaRange: [Number(formData.areaMin) || 80, Number(formData.areaMax) || 200],
              distanceToSea: formData.distanceToSea,
              coverImage: {
                url: formData.coverImage.url || "",
                alt: formData.coverImage.alt || formData.name,
              },
              gallery: formData.gallery.map((g) => ({
                url: g.url,
                alt: g.alt || formData.name,
              })),
            };
          }
          return item;
        });
      } else {
        const created: Development = {
          slug: rawSlug,
          code,
          name: formData.name,
          city: formData.city,
          cityLabel,
          neighborhood: formData.neighborhood || "Centro",
          stage: formData.stage,
          deliveryDate: formData.deliveryDate,
          shortDescription:
            formData.shortDescription ||
            `Empreendimento exclusivo de alto padrão em ${cityLabel}, no bairro ${formData.neighborhood}.`,
          description: formData.description.trim() || undefined,
          features: formData.features,
          priceFrom: formData.priceFrom ?? undefined,
          bedroomsRange: [Number(formData.bedroomsMin) || 2, Number(formData.bedroomsMax) || 4],
          areaRange: [Number(formData.areaMin) || 80, Number(formData.areaMax) || 200],
          distanceToSea: formData.distanceToSea,
          badges: ["lancamento", "alto-padrao"],
          coverImage: {
            url: formData.coverImage.url || "",
            alt: formData.coverImage.alt || formData.name,
          },
          gallery: formData.gallery.map((g) => ({
            url: g.url,
            alt: g.alt || formData.name,
          })),
        };

        updated = [created, ...items];
      }

      setItems(() => updated);
      saveStoredDevelopments(updated);

      // Sincroniza diretamente com o Supabase via Server API
      const targetDev = updated.find((d) => d.slug === (editingSlug || rawSlug));
      if (targetDev) {
        const res = await saveDevelopmentToDb(targetDev);
        if (!res.success) {
          console.error("Erro no salvamento Supabase:", res.error);
        }
      }

      showToast(`✓ Empreendimento "${formData.name}" salvo e sincronizado na nuvem!`);
      setModalOpen(false);
    } catch (err: any) {
      console.error("Erro ao salvar empreendimento:", err);
      alert("Erro ao salvar empreendimento: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (confirm("Tem certeza que deseja remover este empreendimento?")) {
      const updated = items.filter((i) => i.slug !== slug);
      setItems(() => updated);
      saveStoredDevelopments(updated);

      await deleteDevelopmentFromDb(slug);
      showToast("✓ Empreendimento removido com sucesso!");
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Toast de Sucesso Flutuante */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xs bg-mineral px-4 py-3 text-xs font-semibold text-offwhite shadow-lg border border-mineral-light animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold">
            Litoral de Santa Catarina
          </span>
          <h1 className="font-display text-2xl md:text-3xl text-graphite font-normal">
            Empreendimentos
          </h1>
          <p className="text-xs md:text-sm text-graphite/60 mt-0.5">
            Gerenciamento de torres, condomínios verticais e lançamentos em SC.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xs bg-mineral px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Novo Empreendimento
        </button>
      </div>

      {/* Barra de Busca e Métricas */}
      <div className="rounded-sm border border-areia/60 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-graphite/40" />
          <input
            type="text"
            placeholder="Buscar por nome, cidade, bairro ou código..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 py-1.5 pl-9 pr-3 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
          />
        </div>

        <div className="text-xs text-graphite/60 font-medium">
          Total: {filteredItems.length} empreendimentos
        </div>
      </div>

      {/* Tabela de Empreendimentos */}
      <div className="rounded-sm border border-areia/60 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-graphite">
            <thead>
              <tr className="border-b border-areia/40 bg-offwhite/50 text-graphite/60 uppercase tracking-wider text-[11px]">
                <th className="p-4 font-semibold">Empreendimento</th>
                <th className="p-4 font-semibold">Localização (SC)</th>
                <th className="p-4 font-semibold">Estágio</th>
                <th className="p-4 font-semibold">Preço a partir de</th>
                <th className="p-4 font-semibold">Configuração</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-areia/30">
              {filteredItems.map((item, idx) => {
                const itemCode = (item as any).code || `MRQ-SC${100 + idx + 1}`;

                return (
                  <tr key={item.slug} className="hover:bg-offwhite/30 transition-colors">
                    {/* Foto e Nome */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 overflow-hidden rounded-xs bg-areia/40 shrink-0 border border-areia/60">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.coverImage?.url || "/favicon.ico"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-graphite text-sm">{item.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-graphite/50">{item.distanceToSea || "Litoral"}</span>
                            {item.gallery && item.gallery.length > 0 && (
                              <span className="text-[10px] bg-areia/40 text-graphite/70 px-1.5 py-0.2 rounded-xs">
                                +{item.gallery.length} fotos
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Localização */}
                    <td className="p-4">
                      <div className="font-medium text-graphite">{item.cityLabel}</div>
                      <div className="text-graphite/50 text-[11px]">{item.neighborhood || "Centro"}</div>
                    </td>

                    {/* Estágio */}
                    <td className="p-4">
                      <span className="inline-flex rounded-full bg-mineral/10 px-2.5 py-0.5 text-[11px] font-semibold text-mineral">
                        {stageLabels[item.stage]}
                      </span>
                    </td>

                    {/* Valor */}
                    <td className="p-4 font-semibold text-mineral text-sm">
                      {item.priceFrom ? formatBRL(item.priceFrom) : "Sob Consulta"}
                    </td>

                    {/* Configuração */}
                    <td className="p-4 text-graphite/70">
                      <div>
                        {item.bedroomsRange ? `${item.bedroomsRange[0]} a ${item.bedroomsRange[1]} dorms.` : "2 a 4 dorms."}
                      </div>
                      <div className="text-[11px] text-graphite/50">
                        {item.areaRange ? `${item.areaRange[0]} a ${item.areaRange[1]} m²` : "100 a 200 m²"}
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyShortLink(itemCode)}
                          title={`Copiar Link Curto: /i/${itemCode}`}
                          className="rounded-xs p-1.5 text-graphite/60 hover:bg-mineral/10 hover:text-mineral transition-colors cursor-pointer flex items-center gap-1 border border-areia/50 bg-white"
                        >
                          <Copy className="h-3.5 w-3.5 text-mineral" />
                          <span className="font-mono text-[10px] font-semibold">{itemCode}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          title="Editar empreendimento"
                          className="rounded-xs p-1.5 text-graphite/60 hover:bg-areia/50 hover:text-mineral transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/empreendimentos/${item.city}/${item.slug}`}
                          target="_blank"
                          title="Ver no site público"
                          className="rounded-xs p-1.5 text-graphite/60 hover:bg-areia/40 hover:text-mineral transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.slug)}
                          title="Excluir"
                          className="rounded-xs p-1.5 text-graphite/60 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Criação / Edição de Empreendimento */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/60 p-4 backdrop-blur-xs"
        >
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-sm bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 rounded-xs p-1 text-graphite/40 hover:bg-offwhite hover:text-graphite transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-display text-lg text-graphite mb-1 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-mineral" />
              {editingSlug ? "Editar Empreendimento" : "Novo Empreendimento em SC"}
            </h3>
            <p className="text-xs text-graphite/50 mb-6">
              Cadastre as informações, fotografias de alta resolução e diferenciais da torre ou condomínio.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Nome & Código / Link Curto */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Nome do Empreendimento *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Essenza Residence, Vista Brava Towers..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    placeholder="Ex: MRQ-SC101"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite font-mono uppercase font-semibold"
                  />
                  <span className="text-[10px] text-graphite/50 block mt-0.5">
                    Link curto: <code className="text-mineral">/i/{formData.code || "CODIGO"}</code>
                  </span>
                </div>
              </div>

              {/* Fotografias do Empreendimento */}
              <ImageUpload
                label="Fotografias do Empreendimento"
                helperText="Envie as imagens do empreendimento. A 1ª foto se torna a capa automaticamente ou clique na estrela (★) para escolher a capa."
                category="coastal"
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

              {/* Localização & Estágio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Cidade (SC) *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value as ScCity })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-white px-3 py-2 text-xs text-graphite cursor-pointer"
                  >
                    <option value="porto-belo">Porto Belo</option>
                    <option value="itapema">Itapema</option>
                    <option value="balneario-camboriu">Balneário Camboriú</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Bairro / Região *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Perequê, Meia Praia, Centro..."
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Estágio da Obra *</label>
                  <select
                    value={formData.stage}
                    onChange={(e) =>
                      setFormData({ ...formData, stage: e.target.value as DevelopmentStage })
                    }
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-white px-3 py-2 text-xs text-graphite cursor-pointer"
                  >
                    <option value="lancamento">Lançamento</option>
                    <option value="em-obras">Em Obras</option>
                    <option value="pronto">Pronto para Morar</option>
                    <option value="vendido">100% Vendido</option>
                  </select>
                </div>
              </div>

              {/* Distância do Mar & Previsão de Entrega */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Proximidade do Mar
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Frente-mar, Quadra do Mar, 150m da Praia..."
                    value={formData.distanceToSea}
                    onChange={(e) => setFormData({ ...formData, distanceToSea: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Previsão de Entrega
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Dezembro/2028 ou Pronto"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              {/* Configuração das Unidades (Quartos e Metragens) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Dorms. Mínimo</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.bedroomsMin}
                    onChange={(e) =>
                      setFormData({ ...formData, bedroomsMin: Number(e.target.value) || 1 })
                    }
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Dorms. Máximo</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.bedroomsMax}
                    onChange={(e) =>
                      setFormData({ ...formData, bedroomsMax: Number(e.target.value) || 1 })
                    }
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Área Mínima (m²)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.areaMin}
                    onChange={(e) =>
                      setFormData({ ...formData, areaMin: Number(e.target.value) || 1 })
                    }
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Área Máxima (m²)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.areaMax}
                    onChange={(e) =>
                      setFormData({ ...formData, areaMax: Number(e.target.value) || 1 })
                    }
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              {/* Descrição Detalhada do Empreendimento (Opcional) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-graphite">
                    Descrição Detalhada do Empreendimento <span className="text-graphite/40 font-normal">(Opcional)</span>
                  </label>
                  <span className="text-[10px] text-graphite/50">
                    Se deixado em branco, a seção não aparece no site.
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Escreva detalhes sobre a infraestrutura do condomínio, conceito arquitetônico, áreas de lazer, etc. Caso não preencha, a seção não aparecerá no site."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite placeholder:text-graphite/40 leading-relaxed"
                />
              </div>

              {/* Diferenciais e Infraestrutura (Editável com Extração Inteligente) */}
              <div className="rounded-xs border border-areia/60 bg-offwhite/20 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-graphite flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-terracota" />
                      Diferenciais e Infraestrutura ({formData.features.length})
                    </label>
                    <span className="text-[11px] text-graphite/60">
                      Itens com ícone de check exibidos na página do empreendimento.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleExtractFeaturesFromDescription}
                    className="inline-flex items-center gap-1.5 rounded-xs bg-mineral/10 px-3 py-1.5 text-xs font-semibold text-mineral hover:bg-mineral/20 transition-colors cursor-pointer w-fit"
                  >
                    <Sparkles className="h-3 w-3" />
                    Puxar da Descrição
                  </button>
                </div>

                {/* Input para Adicionar Manual */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: Piscina adulto e infantil com deck molhado, Spa com sauna..."
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    className="focus-ring flex-1 rounded-xs border border-areia/70 bg-white px-3 py-1.5 text-xs text-graphite placeholder:text-graphite/40"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddFeature()}
                    className="rounded-xs bg-mineral px-4 py-1.5 text-xs font-semibold text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shrink-0"
                  >
                    + Adicionar
                  </button>
                </div>

                {/* Lista de Diferenciais Adicionados (Chips com Remoção) */}
                {formData.features.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-xs bg-white border border-areia/80 px-2.5 py-1 text-xs text-graphite shadow-2xs font-medium group"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-mineral shrink-0" />
                        <span>{feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-graphite/40 hover:text-rose-600 ml-1 cursor-pointer transition-colors"
                          title="Remover este item"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-graphite/50 italic">
                    Nenhum diferencial adicionado ainda. Digite acima ou clique em &quot;Puxar da Descrição&quot;.
                  </p>
                )}

                {/* Sugestões Rápidas de 1 Clique */}
                <div className="pt-2 border-t border-areia/30">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-graphite/50 block mb-1.5">
                    Sugestões Rápidas (Clique para adicionar):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      "Piscina com Deck Molhado",
                      "Espaço Gourmet e Salão de Festas",
                      "Academia com Vista Panorâmica",
                      "Fechaduras Biométricas",
                      "Automação Residencial",
                      "Vagas para Carro Elétrico",
                      "Spa com Sauna",
                      "Cinema e Game Room",
                      "Brinquedoteca",
                      "Paisagismo Assinado",
                    ].map((sug, i) => {
                      const isAdded = formData.features.includes(sug);
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddFeature(sug)}
                          className={`rounded-xs px-2 py-0.5 text-[10px] font-medium border transition-colors cursor-pointer ${
                            isAdded
                              ? "bg-areia/30 text-graphite/40 border-areia/40 cursor-not-allowed"
                              : "bg-white text-graphite/70 border-areia/70 hover:border-mineral hover:text-mineral"
                          }`}
                        >
                          {isAdded ? `✓ ${sug}` : `+ ${sug}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Valor A Partir De com CurrencyInput */}
              <CurrencyInput
                label="Valor de Venda (A partir de)"
                value={formData.priceFrom ?? 0}
                onChange={(numVal) =>
                  setFormData({ ...formData, priceFrom: numVal === 0 ? null : numVal })
                }
                placeholder="Ex: 1.850.000 ou Sob Consulta"
                helperText="Aceita valores livres (ex: 2.500.000, 1.8 mi) ou opção Sob Consulta."
                allowSobConsulta={true}
              />

              {/* Botões de Ação */}
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
                  className="rounded-xs bg-mineral px-6 py-2 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving
                    ? "Sincronizando na Nuvem..."
                    : editingSlug
                    ? "Atualizar Empreendimento"
                    : "Salvar Empreendimento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
