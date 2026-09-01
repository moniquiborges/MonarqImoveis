"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Edit2,
  X,
  BedDouble,
  Bath,
  Car,
  Ruler,
  Building2,
  MapPin,
  Sparkles,
  Waves,
  Calendar,
  CheckCircle2,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { mockUrbanProperties } from "@/lib/mock/properties";
import { mockDevelopments } from "@/lib/mock/developments";
import { mockImages } from "@/lib/mock/images";
import { formatBRL, formatArea } from "@/lib/utils";
import { stageLabels } from "@/lib/labels";
import {
  getStoredUrbanProperties,
  saveStoredUrbanProperties,
  getStoredDevelopments,
  saveStoredDevelopments,
  useLiveStoredData,
} from "@/lib/storage";
import {
  fetchUrbanProperties,
  fetchDevelopments,
  saveUrbanPropertyToDb,
  deleteUrbanPropertyFromDb,
  saveDevelopmentToDb,
  deleteDevelopmentFromDb,
} from "@/lib/services/propertyService";
import { CurrencyInput } from "@/components/admin/CurrencyInput";
import { ImageUpload, ImageData } from "@/components/admin/ImageUpload";
import type { UrbanProperty, Development, ScCity, DevelopmentStage } from "@/types";

interface UnifiedPropertyItem {
  id: string;
  slug: string;
  code: string;
  state: "SC" | "MS";
  stateLabel: string;
  city: string;
  scCity?: ScCity;
  title: string;
  type: string;
  neighborhood: string;
  price: number | null;
  bedrooms: number;
  suites: number;
  parking: number;
  area: number;
  coverImage: ImageData;
  gallery: ImageData[];
  stage?: DevelopmentStage;
  distanceToSea?: string;
  deliveryDate?: string;
  shortDescription?: string;
  siteUrl: string;
}

export default function AdminImoveisPage() {
  const [urbanItems, setUrbanItems] = useLiveStoredData<UrbanProperty[]>(
    getStoredUrbanProperties,
    mockUrbanProperties,
    "urban"
  );
  const [devItems, setDevItems] = useLiveStoredData<Development[]>(
    getStoredDevelopments,
    mockDevelopments,
    "developments"
  );

  // Sincroniza dados com o Supabase no carregamento
  useEffect(() => {
    fetchUrbanProperties().then((dbUrbans) => {
      if (dbUrbans && dbUrbans.length > 0) {
        setUrbanItems(() => dbUrbans);
        saveStoredUrbanProperties(dbUrbans);
      }
    });
    fetchDevelopments().then((dbDevs) => {
      if (dbDevs && dbDevs.length > 0) {
        setDevItems(() => dbDevs);
        saveStoredDevelopments(dbDevs);
      }
    });
  }, [setUrbanItems, setDevItems]);

  const [stateFilter, setStateFilter] = useState<"all" | "SC" | "MS">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<UnifiedPropertyItem | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    state: "SC" | "MS";
    code: string;
    scCity: ScCity;
    cityMS: string;
    neighborhood: string;
    title: string;
    type: string;
    stage: DevelopmentStage;
    distanceToSea: string;
    deliveryDate: string;
    shortDescription: string;
    price: number | null;
    bedrooms: number;
    suites: number;
    parking: number;
    area: number;
    coverImage: ImageData;
    gallery: ImageData[];
  }>({
    state: "SC",
    code: "MRQ-U101",
    scCity: "porto-belo",
    cityMS: "Campo Grande",
    neighborhood: "Perequê",
    title: "",
    type: "Apartamento",
    stage: "lancamento",
    distanceToSea: "Frente-mar",
    deliveryDate: "2028",
    shortDescription: "",
    price: 1850000,
    bedrooms: 3,
    suites: 3,
    parking: 2,
    area: 140,
    coverImage: {
      url: "",
      alt: "",
    },
    gallery: [],
  });

  // Converte a lista unificada de itens
  const allUnifiedItems: UnifiedPropertyItem[] = useMemo(() => {
    const scList: UnifiedPropertyItem[] = devItems.map((dev, idx) => ({
      id: `dev-${dev.slug}`,
      slug: dev.slug,
      code: (dev as any).code || `MRQ-SC${100 + idx + 1}`,
      state: "SC",
      stateLabel: "Santa Catarina",
      city: dev.cityLabel,
      scCity: dev.city,
      title: dev.name,
      type: "Empreendimento / Lançamento",
      neighborhood: dev.neighborhood || "Centro",
      price: dev.priceFrom ?? null,
      bedrooms: dev.bedroomsRange ? dev.bedroomsRange[0] : 2,
      suites: dev.suitesRange ? dev.suitesRange[0] : 2,
      parking: dev.parkingRange ? dev.parkingRange[0] : 2,
      area: dev.areaRange ? dev.areaRange[0] : 100,
      coverImage: dev.coverImage || { url: "", alt: dev.name },
      gallery: dev.gallery || [],
      stage: dev.stage,
      distanceToSea: dev.distanceToSea,
      deliveryDate: dev.deliveryDate,
      shortDescription: dev.shortDescription,
      siteUrl: `/empreendimentos/${dev.city}/${dev.slug}`,
    }));

    const msList: UnifiedPropertyItem[] = urbanItems.map((urban, idx) => ({
      id: `urban-${urban.slug}`,
      slug: urban.slug,
      code: urban.code || `MRQ-U${100 + idx + 1}`,
      state: "MS",
      stateLabel: "Mato Grosso do Sul",
      city: "Campo Grande",
      title: urban.title,
      type: urban.type,
      neighborhood: urban.neighborhood,
      price: urban.price,
      bedrooms: urban.bedrooms,
      suites: urban.suites,
      parking: urban.parking,
      area: urban.area,
      coverImage: urban.coverImage || { url: "", alt: urban.title },
      gallery: urban.gallery || [],
      siteUrl: `/imoveis/campo-grande/${urban.slug}`,
    }));

    return [...scList, ...msList];
  }, [devItems, urbanItems]);

  // Filtro por Estado e Busca
  const filteredItems = useMemo(() => {
    return allUnifiedItems.filter((item) => {
      if (stateFilter !== "all" && item.state !== stateFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        const matchCity = item.city.toLowerCase().includes(q);
        const matchNeigh = item.neighborhood.toLowerCase().includes(q);
        const matchType = item.type.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchCity && !matchNeigh && !matchType) return false;
      }
      return true;
    });
  }, [allUnifiedItems, stateFilter, searchQuery]);

  const countSC = useMemo(() => devItems.length, [devItems]);
  const countMS = useMemo(() => urbanItems.length, [urbanItems]);

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

  const handleOpenCreate = (preselectedState?: "SC" | "MS") => {
    const selectedState = preselectedState || (stateFilter === "MS" ? "MS" : "SC");
    const nextCode =
      selectedState === "SC"
        ? `MRQ-SC${100 + devItems.length + 1}`
        : `MRQ-U${100 + urbanItems.length + 1}`;

    setEditingItem(null);
    setFormData({
      state: selectedState,
      code: nextCode,
      scCity: "porto-belo",
      cityMS: "Campo Grande",
      neighborhood: selectedState === "SC" ? "Perequê" : "Jardim dos Estados",
      title: "",
      type: selectedState === "SC" ? "Apartamento Frente Mar" : "Apartamento",
      stage: "lancamento",
      distanceToSea: "Frente-mar",
      deliveryDate: "2028",
      shortDescription: "",
      price: selectedState === "SC" ? 2200000 : 1250000,
      bedrooms: 3,
      suites: selectedState === "SC" ? 3 : 2,
      parking: 2,
      area: selectedState === "SC" ? 160 : 130,
      coverImage: {
        url: "",
        alt: "",
      },
      gallery: [],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: UnifiedPropertyItem) => {
    setEditingItem(item);
    setFormData({
      state: item.state,
      code: item.code,
      scCity: item.scCity || "porto-belo",
      cityMS: item.city || "Campo Grande",
      neighborhood: item.neighborhood,
      title: item.title,
      type: item.type,
      stage: item.stage || "lancamento",
      distanceToSea: item.distanceToSea || "Frente-mar",
      deliveryDate: item.deliveryDate || "2028",
      shortDescription: item.shortDescription || "",
      price: item.price,
      bedrooms: item.bedrooms,
      suites: item.suites,
      parking: item.parking,
      area: item.area,
      coverImage: item.coverImage,
      gallery: item.gallery,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Por favor, preencha o título do imóvel.");
      return;
    }

    setIsSaving(true);

    try {
      const isSC = formData.state === "SC";
      const rawSlug =
        formData.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w ]+/g, "")
          .replace(/ +/g, "-") || `anuncio-${Date.now()}`;

      if (isSC) {
        // Salva / Atualiza em Empreendimentos SC
        const cityLabels: Record<ScCity, string> = {
          "porto-belo": "Porto Belo",
          itapema: "Itapema",
          "balneario-camboriu": "Balneário Camboriú",
        };

        const cityLabel = cityLabels[formData.scCity] || "Porto Belo";
        let updatedDevs: Development[];

        if (editingItem && editingItem.state === "SC") {
          updatedDevs = devItems.map((dev) => {
            if (dev.slug === editingItem.slug) {
              return {
                ...dev,
                name: formData.title,
                city: formData.scCity,
                cityLabel,
                neighborhood: formData.neighborhood,
                stage: formData.stage,
                deliveryDate: formData.deliveryDate,
                shortDescription:
                  formData.shortDescription ||
                  `Empreendimento exclusivo de alto padrão em ${cityLabel}, no bairro ${formData.neighborhood}.`,
                priceFrom: formData.price ?? undefined,
                bedroomsRange: [Number(formData.bedrooms) || 2, Number(formData.bedrooms) + 1],
                suitesRange: [Number(formData.suites) || 2, Number(formData.suites) + 1],
                parkingRange: [Number(formData.parking) || 2, Number(formData.parking) + 1],
                areaRange: [Number(formData.area) || 120, Number(formData.area) + 40],
                distanceToSea: formData.distanceToSea,
                coverImage: {
                  url: formData.coverImage.url || mockImages.coastalHouse1,
                  alt: formData.coverImage.alt || formData.title,
                },
                gallery: formData.gallery.map((g) => ({
                  url: g.url,
                  alt: g.alt || formData.title,
                })),
              };
            }
            return dev;
          });
        } else {
          const newDev: Development = {
            slug: rawSlug,
            name: formData.title,
            city: formData.scCity,
            cityLabel,
            neighborhood: formData.neighborhood,
            stage: formData.stage,
            deliveryDate: formData.deliveryDate,
            shortDescription:
              formData.shortDescription ||
              `Empreendimento exclusivo de alto padrão em ${cityLabel}, no bairro ${formData.neighborhood}.`,
            priceFrom: formData.price ?? undefined,
            bedroomsRange: [Number(formData.bedrooms) || 2, Number(formData.bedrooms) + 1],
            suitesRange: [Number(formData.suites) || 2, Number(formData.suites) + 1],
            parkingRange: [Number(formData.parking) || 2, Number(formData.parking) + 1],
            areaRange: [Number(formData.area) || 120, Number(formData.area) + 40],
            distanceToSea: formData.distanceToSea,
            badges: ["lancamento", "alto-padrao"],
            coverImage: {
              url: formData.coverImage.url || mockImages.coastalHouse1,
              alt: formData.coverImage.alt || formData.title,
            },
            gallery: formData.gallery.map((g) => ({
              url: g.url,
              alt: g.alt || formData.title,
            })),
          };
          updatedDevs = [newDev, ...devItems];
        }

        setDevItems(() => updatedDevs);
        saveStoredDevelopments(updatedDevs);
        const targetDev = updatedDevs.find((d) => d.slug === (editingItem?.slug || rawSlug));
        if (targetDev) {
          const res = await saveDevelopmentToDb(targetDev);
          if (!res.success) {
            console.error("Erro no salvamento Supabase:", res.error);
          }
        }
        showToast(`✓ Imóvel em Santa Catarina (${cityLabel}) salvo e sincronizado na nuvem!`);
      } else {
        // Salva / Atualiza em Imóveis Urbanos MS
        let updatedUrban: UrbanProperty[];

        if (editingItem && editingItem.state === "MS") {
          updatedUrban = urbanItems.map((item) => {
            if (item.slug === editingItem.slug) {
              return {
                ...item,
                code: formData.code.trim().toUpperCase() || item.code,
                title: formData.title,
                type: formData.type,
                neighborhood: formData.neighborhood,
                price: formData.price,
                bedrooms: Number(formData.bedrooms) || 0,
                suites: Number(formData.suites) || 0,
                parking: Number(formData.parking) || 0,
                area: Number(formData.area) || 0,
                coverImage: {
                  url: formData.coverImage.url || mockImages.livingRoom1,
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
          const newUrban: UrbanProperty = {
            slug: rawSlug,
            code: formData.code.trim().toUpperCase() || `MRQ-U${100 + urbanItems.length + 1}`,
            title: formData.title,
            type: formData.type,
            neighborhood: formData.neighborhood,
            city: "Campo Grande",
            price: formData.price,
            bedrooms: Number(formData.bedrooms) || 3,
            suites: Number(formData.suites) || 2,
            parking: Number(formData.parking) || 2,
            area: Number(formData.area) || 120,
            badges: ["novo", "alto-padrao"],
            coverImage: {
              url: formData.coverImage.url || mockImages.livingRoom1,
              alt: formData.coverImage.alt || formData.title,
            },
            gallery: formData.gallery.map((g) => ({
              url: g.url,
              alt: g.alt || formData.title,
            })),
          };
          updatedUrban = [newUrban, ...urbanItems];
        }

        setUrbanItems(() => updatedUrban);
        saveStoredUrbanProperties(updatedUrban);
        const targetUrban = updatedUrban.find((u) => u.slug === (editingItem?.slug || rawSlug));
        if (targetUrban) {
          const res = await saveUrbanPropertyToDb(targetUrban);
          if (!res.success) {
            console.error("Erro no salvamento Supabase:", res.error);
          }
        }
        showToast("✓ Imóvel em Campo Grande / MS salvo e sincronizado na nuvem!");
      }

      setModalOpen(false);
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (item: UnifiedPropertyItem) => {
    if (confirm(`Tem certeza que deseja remover "${item.title}"?`)) {
      if (item.state === "SC") {
        const updated = devItems.filter((d) => d.slug !== item.slug);
        setDevItems(() => updated);
        saveStoredDevelopments(updated);
        deleteDevelopmentFromDb(item.slug);
        showToast("✓ Imóvel de Santa Catarina removido.");
      } else {
        const updated = urbanItems.filter((u) => u.slug !== item.slug);
        setUrbanItems(() => updated);
        saveStoredUrbanProperties(updated);
        deleteUrbanPropertyFromDb(item.slug);
        showToast("✓ Imóvel de Campo Grande removido.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Toast de Sucesso */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xs bg-mineral px-4 py-3 text-xs font-semibold text-offwhite shadow-xl animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold">
            Gestão de Imóveis &amp; Lançamentos
          </span>
          <h1 className="font-display text-2xl md:text-3xl text-graphite font-normal">
            Catálogo de Anúncios
          </h1>
          <p className="text-xs md:text-sm text-graphite/60 mt-0.5">
            Cadastre e gerencie anúncios de Santa Catarina (Litoral) e Mato Grosso do Sul (Campo Grande).
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenCreate()}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xs bg-mineral px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Novo Anúncio de Imóvel
        </button>
      </div>

      {/* Filtros por Estado e Barra de Busca */}
      <div className="rounded-sm border border-areia/60 bg-white p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Abas de Estado */}
        <div className="flex items-center gap-1.5 bg-offwhite p-1 rounded-xs border border-areia/60">
          <button
            type="button"
            onClick={() => setStateFilter("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
              stateFilter === "all"
                ? "bg-mineral text-offwhite font-semibold shadow-xs"
                : "text-graphite/70 hover:text-graphite"
            }`}
          >
            Todos os Estados ({allUnifiedItems.length})
          </button>

          <button
            type="button"
            onClick={() => setStateFilter("SC")}
            className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              stateFilter === "SC"
                ? "bg-mineral text-offwhite font-semibold shadow-xs"
                : "text-graphite/70 hover:text-graphite"
            }`}
          >
            <span>🌊 Santa Catarina ({countSC})</span>
          </button>

          <button
            type="button"
            onClick={() => setStateFilter("MS")}
            className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              stateFilter === "MS"
                ? "bg-mineral text-offwhite font-semibold shadow-xs"
                : "text-graphite/70 hover:text-graphite"
            }`}
          >
            <span>🏙️ Campo Grande / MS ({countMS})</span>
          </button>
        </div>

        {/* Busca por Texto */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-graphite/40" />
          <input
            type="text"
            placeholder="Buscar por título, cidade, bairro ou tipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 py-1.5 pl-9 pr-3 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
          />
        </div>
      </div>

      {/* Tabela de Imóveis */}
      <div className="rounded-sm border border-areia/60 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-graphite">
            <thead>
              <tr className="border-b border-areia/40 bg-offwhite/50 text-graphite/60 uppercase tracking-wider text-[11px]">
                <th className="p-4 font-semibold">Imóvel &amp; Localização</th>
                <th className="p-4 font-semibold">Destino no Site</th>
                <th className="p-4 font-semibold">Configuração</th>
                <th className="p-4 font-semibold">Valor</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-areia/30">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-offwhite/30 transition-colors">
                  {/* Foto e Título */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded-xs bg-areia/40 shrink-0 border border-areia/60">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.coverImage.url}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-graphite text-sm">{item.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-graphite/60 text-[11px]">
                            {item.neighborhood}, {item.city}
                          </span>
                          {item.gallery && item.gallery.length > 0 && (
                            <span className="text-[10px] bg-areia/40 text-graphite/70 px-1.5 py-0.2 rounded-xs">
                              +{item.gallery.length} fotos
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Destino no Site / Estado */}
                  <td className="p-4">
                    {item.state === "SC" ? (
                      <div className="inline-flex flex-col gap-0.5">
                        <span className="inline-flex items-center gap-1 rounded-xs bg-cyan-900/10 px-2 py-0.5 text-[10px] font-bold uppercase text-cyan-900 border border-cyan-900/20 w-fit">
                          🌊 SC • {item.city}
                        </span>
                        <span className="text-[10px] text-graphite/50">Empreendimentos SC</span>
                      </div>
                    ) : (
                      <div className="inline-flex flex-col gap-0.5">
                        <span className="inline-flex items-center gap-1 rounded-xs bg-amber-900/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-900 border border-amber-900/20 w-fit">
                          🏙️ MS • Campo Grande
                        </span>
                        <span className="text-[10px] text-graphite/50">{item.type}</span>
                      </div>
                    )}
                  </td>

                  {/* Quartos / Banheiros / Vagas / Área */}
                  <td className="p-4 text-graphite/70">
                    <div>
                      {item.bedrooms} dorms ({item.suites} banheiros) &bull; {item.parking} vagas
                    </div>
                    <div className="text-[11px] text-graphite/50">{formatArea(item.area)}</div>
                  </td>

                  {/* Valor */}
                  <td className="p-4 font-semibold text-mineral text-sm">
                    {item.price ? formatBRL(item.price) : "Sob Consulta"}
                  </td>

                  {/* Ações */}
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyShortLink(item.code)}
                        title={`Copiar Link Curto: /i/${item.code}`}
                        className="rounded-xs p-1.5 text-graphite/60 hover:bg-mineral/10 hover:text-mineral transition-colors cursor-pointer flex items-center gap-1 border border-areia/50 bg-white"
                      >
                        <Copy className="h-3.5 w-3.5 text-mineral" />
                        <span className="font-mono text-[10px] font-semibold">{item.code}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        title="Editar anúncio"
                        className="rounded-xs p-1.5 text-graphite/60 hover:bg-areia/50 hover:text-mineral transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <Link
                        href={item.siteUrl}
                        target="_blank"
                        title="Ver página no site"
                        className="rounded-xs p-1.5 text-graphite/60 hover:bg-areia/40 hover:text-mineral transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        title="Excluir"
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

      {/* Modal de Criação / Edição de Anúncio com Seletor de Estado */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/60 backdrop-blur-xs p-4 animate-fade-in"
        >
          <div className="relative w-full max-w-2xl rounded-sm bg-white p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-areia/40 pb-4 mb-6">
              <div>
                <h3 className="font-display text-xl text-graphite font-medium">
                  {editingItem ? "Editar Anúncio de Imóvel" : "Criar Novo Anúncio de Imóvel"}
                </h3>
                <p className="text-xs text-graphite/60">
                  Selecione o estado para direcionar o anúncio à seção correta no site.
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

            <form onSubmit={handleSave} className="space-y-5">
              {/* Seletor de Estado / Região */}
              <div className="rounded-xs border border-mineral/20 bg-mineral/5 p-3.5 space-y-2">
                <label className="block text-xs font-semibold text-graphite uppercase tracking-wider">
                  Estado / Região de Destino do Imóvel *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xs border cursor-pointer transition-all ${
                      formData.state === "SC"
                        ? "border-mineral bg-white shadow-xs text-mineral font-semibold"
                        : "border-areia/60 bg-offwhite/50 text-graphite/70 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="stateSelector"
                      checked={formData.state === "SC"}
                      onChange={() => setFormData({ ...formData, state: "SC", neighborhood: "Perequê" })}
                      className="accent-mineral"
                    />
                    <div>
                      <div className="text-xs font-semibold">🌊 Santa Catarina (SC)</div>
                      <div className="text-[10px] text-graphite/60 font-normal">
                        Vai para o menu &quot;Empreendimentos SC&quot; (Porto Belo, Itapema, BC)
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xs border cursor-pointer transition-all ${
                      formData.state === "MS"
                        ? "border-mineral bg-white shadow-xs text-mineral font-semibold"
                        : "border-areia/60 bg-offwhite/50 text-graphite/70 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="stateSelector"
                      checked={formData.state === "MS"}
                      onChange={() =>
                        setFormData({ ...formData, state: "MS", neighborhood: "Jardim dos Estados" })
                      }
                      className="accent-mineral"
                    />
                    <div>
                      <div className="text-xs font-semibold">🏙️ Mato Grosso do Sul (MS)</div>
                      <div className="text-[10px] text-graphite/60 font-normal">
                        Vai para a seção &quot;Campo Grande&quot; do site
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Título do Anúncio & Código de Referência (Link Curto) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-medium text-graphite mb-1">
                    Título do Anúncio / Nome do Empreendimento *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      formData.state === "SC"
                        ? "Ex: Essenza Residence - Frente Mar em Porto Belo"
                        : "Ex: Cobertura duplex com vista panorâmica no Jardim dos Estados"
                    }
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
                    placeholder="Ex: MRQ-U101"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite font-mono uppercase font-semibold"
                  />
                  <span className="text-[10px] text-graphite/50 block mt-0.5">
                    Gera o link curto: <code className="text-mineral">/i/{formData.code || "CODIGO"}</code>
                  </span>
                </div>
              </div>

              {/* Fotografias (Galeria com Seleção de Capa por Estrela) */}
              <ImageUpload
                label="Fotografias do Imóvel"
                helperText="Envie várias fotos de uma vez. A 1ª foto se torna a capa automaticamente ou clique na estrela (★) para escolher a capa."
                category={formData.state === "SC" ? "coastal" : "urban"}
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

              {/* Campos Específicos para Santa Catarina (SC) */}
              {formData.state === "SC" && (
                <div className="rounded-xs border border-areia/60 bg-offwhite/20 p-3.5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-graphite mb-1">
                        Cidade em Santa Catarina *
                      </label>
                      <select
                        value={formData.scCity}
                        onChange={(e) =>
                          setFormData({ ...formData, scCity: e.target.value as ScCity })
                        }
                        className="focus-ring w-full rounded-xs border border-areia/70 bg-white px-3 py-2 text-xs text-graphite cursor-pointer"
                      >
                        <option value="porto-belo">Porto Belo</option>
                        <option value="itapema">Itapema</option>
                        <option value="balneario-camboriu">Balneário Camboriú</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-graphite mb-1">
                        Bairro / Região *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Perequê, Meia Praia, Centro, Barra Sul..."
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                        className="focus-ring w-full rounded-xs border border-areia/70 bg-white px-3 py-2 text-xs text-graphite"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-graphite mb-1">
                        Estágio da Obra *
                      </label>
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

                    <div>
                      <label className="block text-xs font-medium text-graphite mb-1">
                        Proximidade do Mar
                      </label>
                      <select
                        value={formData.distanceToSea}
                        onChange={(e) => setFormData({ ...formData, distanceToSea: e.target.value })}
                        className="focus-ring w-full rounded-xs border border-areia/70 bg-white px-3 py-2 text-xs text-graphite cursor-pointer"
                      >
                        <option value="Frente-mar">Frente-mar</option>
                        <option value="Quadra Mar (50m)">Quadra Mar (50m)</option>
                        <option value="Segunda Quadra (100m)">Segunda Quadra (100m)</option>
                        <option value="Vista Panorâmica do Mar">Vista Panorâmica do Mar</option>
                        <option value="Centro">Centro / Urbano</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-graphite mb-1">
                        Previsão de Entrega
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Dez/2028 ou Pronto"
                        value={formData.deliveryDate}
                        onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                        className="focus-ring w-full rounded-xs border border-areia/70 bg-white px-3 py-2 text-xs text-graphite"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Campos Específicos para Mato Grosso do Sul (MS) */}
              {formData.state === "MS" && (
                <div className="rounded-xs border border-areia/60 bg-offwhite/20 p-3.5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-graphite mb-1">
                        Tipo de Imóvel *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="focus-ring w-full rounded-xs border border-areia/70 bg-white px-3 py-2 text-xs text-graphite cursor-pointer"
                      >
                        <option value="Apartamento">Apartamento</option>
                        <option value="Cobertura">Cobertura</option>
                        <option value="Casa em condomínio">Casa em condomínio</option>
                        <option value="Casa">Casa</option>
                        <option value="Sobrado">Sobrado</option>
                        <option value="Terreno">Terreno</option>
                        <option value="Comercial">Comercial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-graphite mb-1">
                        Bairro em Campo Grande *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Jardim dos Estados, Alphaville, Carandá..."
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                        className="focus-ring w-full rounded-xs border border-areia/70 bg-white px-3 py-2 text-xs text-graphite"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Configurações (Quartos, Suítes, Vagas, Área) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Dormitórios</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) || 0 })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Banheiros</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.suites}
                    onChange={(e) => setFormData({ ...formData, suites: Number(e.target.value) || 0 })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Vagas</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.parking}
                    onChange={(e) => setFormData({ ...formData, parking: Number(e.target.value) || 0 })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Área Privativa (m²)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) || 0 })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                  />
                </div>
              </div>

              {/* Valor de Venda com CurrencyInput */}
              <CurrencyInput
                label={formData.state === "SC" ? "Valor de Venda (A partir de)" : "Valor de Venda"}
                value={formData.price ?? 0}
                onChange={(numVal) => setFormData({ ...formData, price: numVal === 0 ? null : numVal })}
                placeholder="Ex: 2.500.000 ou 1,8 mi"
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
                  {isSaving ? "Sincronizando na Nuvem..." : editingItem ? "Atualizar Anúncio" : "Salvar Anúncio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
