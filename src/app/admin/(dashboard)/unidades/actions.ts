"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/require-staff";
import type { UnitStatus } from "@/types/database";

export interface UnitListItem {
  id: string;
  developmentId: string;
  developmentSlug: string;
  developmentName: string;
  unitNumber: string;
  tower: string;
  floor: number | null;
  area: number;
  bedrooms: number | null;
  suites: number | null;
  parking: number | null;
  price: number | null;
  status: UnitStatus;
}

export interface DevelopmentOption {
  id: string;
  slug: string;
  name: string;
  city: string;
}

export interface ListUnitsResult {
  units: UnitListItem[];
  developments: DevelopmentOption[];
  error?: string;
}

export async function listUnits(): Promise<ListUnitsResult> {
  const staff = await requireStaff();
  if (!staff) return { units: [], developments: [], error: "Não autorizado." };

  const supabase = await createClient();

  const [unitsResult, developmentsResult] = await Promise.all([
    supabase
      .from("development_units")
      .select(
        "id, development_id, unit_number, tower, floor, area, bedrooms, suites, parking, price, status"
      )
      .order("created_at", { ascending: false }),
    supabase.from("developments").select("id, slug, name, city").order("name"),
  ]);

  if (unitsResult.error || developmentsResult.error) {
    return {
      units: [],
      developments: [],
      error:
        unitsResult.error?.message ??
        developmentsResult.error?.message ??
        "Erro ao carregar unidades.",
    };
  }

  const devMap = new Map((developmentsResult.data ?? []).map((d) => [d.id, d]));

  const units: UnitListItem[] = (unitsResult.data ?? []).map((row) => {
    const dev = devMap.get(row.development_id);
    return {
      id: row.id,
      developmentId: row.development_id,
      developmentSlug: dev?.slug ?? "",
      developmentName: dev?.name ?? "Empreendimento removido",
      unitNumber: row.unit_number ?? "—",
      tower: row.tower ?? "",
      floor: row.floor,
      area: row.area ? Number(row.area) : 0,
      bedrooms: row.bedrooms,
      suites: row.suites,
      parking: row.parking,
      price: row.price ? Number(row.price) : null,
      status: row.status,
    };
  });

  const developments: DevelopmentOption[] = (developmentsResult.data ?? []).map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    city: d.city,
  }));

  return { units, developments };
}

export interface CreateUnitInput {
  developmentId: string;
  unitNumber: string;
  tower: string;
  floor: string;
  area: string;
  bedrooms: string;
  suites: string;
  parking: string;
  price: string;
  status: UnitStatus;
}

export interface UnitActionResult {
  success: boolean;
  error?: string;
}

export async function createUnit(input: CreateUnitInput): Promise<UnitActionResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  if (!input.developmentId || !input.unitNumber.trim() || !input.area.trim()) {
    return { success: false, error: "Preencha empreendimento, número da unidade e área." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("development_units").insert({
    development_id: input.developmentId,
    unit_number: input.unitNumber.trim(),
    tower: input.tower.trim() || null,
    floor: input.floor.trim() ? Number(input.floor) : null,
    area: Number(input.area),
    bedrooms: input.bedrooms.trim() ? Number(input.bedrooms) : null,
    suites: input.suites.trim() ? Number(input.suites) : null,
    parking: input.parking.trim() ? Number(input.parking) : null,
    price: input.price.trim() ? Number(input.price) : null,
    status: input.status,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/unidades");
  return { success: true };
}

export async function updateUnitStatus(id: string, status: UnitStatus): Promise<UnitActionResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  const supabase = await createClient();
  const { error } = await supabase.from("development_units").update({ status }).eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/unidades");
  return { success: true };
}

export async function deleteUnit(id: string): Promise<UnitActionResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  const supabase = await createClient();
  const { error } = await supabase.from("development_units").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/unidades");
  return { success: true };
}
