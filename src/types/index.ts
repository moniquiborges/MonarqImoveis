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
}

export type RuralActivity =
  | "venda"
  | "arrendamento"
  | "agricultura"
  | "pecuaria"
  | "investimento";

export interface RuralProperty {
  slug: string;
  code: string;
  title: string;
  state: "MS" | "MT";
  municipality: string;
  totalHectares: number;
  activity: RuralActivity[];
  price: number | null;
  pricePerHectare?: number;
  badges: PropertyBadge[];
  coverImage: PropertyImage;
  gallery: PropertyImage[];
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
