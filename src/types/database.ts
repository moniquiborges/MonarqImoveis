/**
 * Tipos do banco MONARQ — escritos manualmente para refletir
 * `supabase/migrations/*.sql`. Assim que houver um projeto Supabase real,
 * substituir por `npx supabase gen types typescript --linked` para manter
 * 100% de fidelidade com o schema aplicado.
 */

export type UserRole = "admin" | "editor";
export type ListingStatus = "draft" | "published" | "archived" | "sold";
export type DevelopmentStageDb = "lancamento" | "em-obras" | "pronto" | "vendido";
export type UnitStatus = "disponivel" | "reservado" | "vendido";
export type RuralActivityDb = "agricultura" | "pecuaria" | "investimento";
export type PropertyBadgeDb =
  | "exclusivo"
  | "lancamento"
  | "em-obras"
  | "pronto"
  | "frente-mar"
  | "novo"
  | "oportunidade"
  | "alto-padrao"
  | "vendido";
export type ScCityDb = "porto-belo" | "itapema" | "balneario-camboriu";
export type RuralStateDb = "MS" | "MT";
export type ImageEntityType = "development" | "urban_property" | "rural_property";
export type LeadInterestDb =
  | "porto-belo"
  | "itapema"
  | "balneario-camboriu"
  | "campo-grande"
  | "rural"
  | "investimento";
export type LeadStatusDb = "novo" | "contatado" | "qualificado" | "negociacao" | "convertido" | "perdido";
export type LeadTypeDb = "compra" | "venda";

type Timestamps = {
  created_at: string;
  updated_at: string;
};

export type ProfileRow = Timestamps & {
  id: string;
  full_name: string | null;
  role: UserRole;
};

export type AgentRow = Timestamps & {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  creci: string | null;
  photo_url: string | null;
  active: boolean;
};

export type DevelopmentRow = Timestamps & {
  id: string;
  slug: string;
  name: string;
  city: ScCityDb;
  neighborhood: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  builder: string | null;
  agent_id: string | null;
  short_description: string | null;
  description: string | null;
  status: ListingStatus;
  stage: DevelopmentStageDb;
  delivery_forecast: string | null;
  towers: number | null;
  total_units: number | null;
  bedrooms_min: number | null;
  bedrooms_max: number | null;
  suites_min: number | null;
  suites_max: number | null;
  parking_min: number | null;
  parking_max: number | null;
  area_min: number | null;
  area_max: number | null;
  distance_to_sea: string | null;
  price_from: number | null;
  down_payment_terms: string | null;
  amenities: string[];
  badges: PropertyBadgeDb[];
  video_url: string | null;
  tour_url: string | null;
  brochure_url: string | null;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

export type DevelopmentUnitRow = Timestamps & {
  id: string;
  development_id: string;
  unit_number: string | null;
  floor: number | null;
  tower: string | null;
  position: string | null;
  area: number | null;
  bedrooms: number | null;
  suites: number | null;
  parking: number | null;
  price: number | null;
  status: UnitStatus;
  floor_plan_url: string | null;
  notes: string | null;
};

export type UrbanPropertyRow = Timestamps & {
  id: string;
  slug: string;
  code: string;
  title: string;
  property_type: string;
  neighborhood: string;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  agent_id: string | null;
  description: string | null;
  status: ListingStatus;
  price: number | null;
  condo_fee: number | null;
  bedrooms: number | null;
  suites: number | null;
  parking: number | null;
  area: number | null;
  features: string[];
  badges: PropertyBadgeDb[];
  video_url: string | null;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

export type RuralPropertyRow = Timestamps & {
  id: string;
  slug: string;
  code: string;
  title: string;
  state: RuralStateDb;
  municipality: string;
  access_description: string | null;
  distance_to_city: string | null;
  latitude: number | null;
  longitude: number | null;
  display_precise_location: boolean;
  agent_id: string | null;
  description: string | null;
  status: ListingStatus;
  total_hectares: number;
  total_alqueires: number | null;
  productive_area: number | null;
  reserve_area: number | null;
  activity: RuralActivityDb[];
  soil_type: string | null;
  topography: string | null;
  water_sources: string[];
  has_electricity: boolean | null;
  has_main_house: boolean | null;
  has_worker_housing: boolean | null;
  has_corral: boolean | null;
  has_barn: boolean | null;
  has_silo: boolean | null;
  has_warehouse: boolean | null;
  documentation_notes: string | null;
  car_registration: string | null;
  georeferenced: boolean;
  approximate_capacity: string | null;
  price: number | null;
  price_per_hectare: number | null;
  badges: PropertyBadgeDb[];
  video_url: string | null;
  drone_video_url: string | null;
  brochure_url: string | null;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

export type PropertyImageRow = {
  id: string;
  entity_type: ImageEntityType;
  entity_id: string;
  url: string;
  alt: string;
  is_cover: boolean;
  position: number;
  created_at: string;
};

export type BlogCategoryRow = {
  id: string;
  slug: string;
  name: string;
};

export type BlogPostRow = Timestamps & {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category_id: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author_id: string | null;
  status: ListingStatus;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

export type LeadRow = Timestamps & {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  interest: LeadInterestDb | null;
  development_id: string | null;
  urban_property_id: string | null;
  rural_property_id: string | null;
  origin_page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  status: LeadStatusDb;
  lead_type: LeadTypeDb;
  notes: string | null;
};

export type FavoriteRow = {
  id: string;
  user_id: string;
  entity_type: ImageEntityType;
  entity_id: string;
  created_at: string;
};

export type SettingRow = {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
};

type TableDef<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<ProfileRow>;
      agents: TableDef<AgentRow>;
      developments: TableDef<DevelopmentRow>;
      development_units: TableDef<DevelopmentUnitRow>;
      urban_properties: TableDef<UrbanPropertyRow>;
      rural_properties: TableDef<RuralPropertyRow>;
      property_images: TableDef<PropertyImageRow>;
      blog_categories: TableDef<BlogCategoryRow>;
      blog_posts: TableDef<BlogPostRow>;
      leads: TableDef<LeadRow>;
      favorites: TableDef<FavoriteRow>;
      settings: TableDef<SettingRow>;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
