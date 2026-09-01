export type ScCity = "porto-belo" | "itapema" | "balneario-camboriu";

export type DevelopmentStage =
  | "lancamento"
  | "em-obras"
  | "pronto"
  | "vendido";

export type PropertyBadge =
  | "exclusivo"
  | "lancamento"
  | "em-obras"
  | "pronto"
  | "frente-mar"
  | "novo"
  | "oportunidade"
  | "alto-padrao"
  | "vendido";

export interface PropertyImage {
  url: string;
  alt: string;
}

export interface Development {
  slug: string;
  code?: string;
  name: string;
  city: ScCity;
  cityLabel: string;
  neighborhood?: string;
  /** Nome oficial da construtora/incorporadora — só preencher com dado real confirmado. */
  builder?: string;
  stage: DevelopmentStage;
  deliveryDate?: string;
  shortDescription: string;
  priceFrom?: number;
  bedroomsRange: [number, number];
  suitesRange?: [number, number];
  parkingRange?: [number, number];
  areaRange: [number, number];
  distanceToSea?: string;
  badges: PropertyBadge[];
  coverImage: PropertyImage;
  gallery: PropertyImage[];
  description?: string;
  features?: string[];
}

export interface UrbanProperty {
  slug: string;
  code: string;
  title: string;
  type: string;
  neighborhood: string;
  city: "Campo Grande";
  price: number | null;
  bedrooms: number;
  suites: number;
  parking: number;
  area: number;
  badges: PropertyBadge[];
  coverImage: PropertyImage;
  gallery: PropertyImage[];
  description?: string;
  features?: string[];
}

export type RuralType = "fazenda" | "chacara" | "sitio" | "rancho";

export type RuralActivity =
  | "venda"
  | "arrendamento"
  | "agricultura"
  | "pecuaria"
  | "investimento";

export type RuralState =
  | "MS"
  | "MT"
  | "GO"
  | "MG"
  | "SP"
  | "PR"
  | "BA"
  | "PI"
  | "MA"
  | "TO"
  | "PA";

export interface RuralProperty {
  slug: string;
  code: string;
  title: string;
  type?: RuralType | string;
  state: RuralState | string;
  municipality: string;
  totalHectares: number;
  activity: RuralActivity[];
  price: number | null;
  pricePerHectare?: number;
  badges: PropertyBadge[];
  coverImage: PropertyImage;
  gallery: PropertyImage[];
  description?: string;
  features?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: PropertyImage;
  publishedAt: string;
}

export type LeadInterest =
  | "porto-belo"
  | "itapema"
  | "balneario-camboriu"
  | "campo-grande"
  | "rural"
  | "investimento";

export interface LeadFormData {
  name: string;
  whatsapp: string;
  interest: LeadInterest;
  originPage?: string;
}
