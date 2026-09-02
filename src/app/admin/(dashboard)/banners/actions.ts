"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/require-staff";
import type { BannerLocationDb } from "@/types/database";

export interface BannerListItem {
  id: string;
  title: string;
  subtitle: string;
  location: BannerLocationDb;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  order: number;
}

export interface ListBannersResult {
  banners: BannerListItem[];
  error?: string;
}

export async function listBanners(): Promise<ListBannersResult> {
  const staff = await requireStaff();
  if (!staff) return { banners: [], error: "Não autorizado." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("banners")
    .select("id, title, subtitle, location, image_url, cta_text, cta_link, active, display_order")
    .order("display_order");

  if (error) {
    return { banners: [], error: error.message };
  }

  const banners: BannerListItem[] = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? "",
    location: row.location,
    imageUrl: row.image_url ?? "",
    ctaText: row.cta_text ?? "",
    ctaLink: row.cta_link ?? "",
    active: row.active,
    order: row.display_order,
  }));

  return { banners };
}

export interface BannerFormInput {
  title: string;
  subtitle: string;
  location: BannerLocationDb;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
}

export interface BannerActionResult {
  success: boolean;
  error?: string;
}

export async function createBanner(input: BannerFormInput): Promise<BannerActionResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  const title = input.title.trim();
  if (!title) return { success: false, error: "Informe o título do banner." };

  const supabase = await createClient();

  const { count } = await supabase
    .from("banners")
    .select("id", { count: "exact", head: true });

  const { error } = await supabase.from("banners").insert({
    title,
    subtitle: input.subtitle.trim() || null,
    location: input.location,
    image_url: input.imageUrl || null,
    cta_text: input.ctaText.trim() || null,
    cta_link: input.ctaLink.trim() || null,
    active: input.active,
    display_order: count ?? 0,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/banners");
  return { success: true };
}

export async function updateBanner(id: string, input: BannerFormInput): Promise<BannerActionResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  const title = input.title.trim();
  if (!title) return { success: false, error: "Informe o título do banner." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("banners")
    .update({
      title,
      subtitle: input.subtitle.trim() || null,
      location: input.location,
      image_url: input.imageUrl || null,
      cta_text: input.ctaText.trim() || null,
      cta_link: input.ctaLink.trim() || null,
      active: input.active,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/banners");
  return { success: true };
}

export async function toggleBannerActive(id: string, active: boolean): Promise<BannerActionResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  const supabase = await createClient();
  const { error } = await supabase.from("banners").update({ active }).eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/banners");
  return { success: true };
}

export async function deleteBanner(id: string): Promise<BannerActionResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  const supabase = await createClient();
  const { error } = await supabase.from("banners").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/banners");
  return { success: true };
}
