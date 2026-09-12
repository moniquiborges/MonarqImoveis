import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaff } from "@/lib/supabase/require-staff";
import { normalizeImageUrl, normalizeVideoUrl, getNextSequentialCode } from "@/lib/utils";
import type { UrbanProperty, Development, RuralProperty } from "@/types";

// Insere as novas linhas ANTES de apagar as antigas, e só apaga o que não
// acabou de ser inserido. Assim, se o insert falhar (payload grande, erro de
// rede, etc.), as fotos/vídeos já salvos nunca são perdidos.
async function syncEntityRows(
  supabase: any,
  table: "property_images" | "property_videos",
  entityType: string,
  entityId: string,
  rows: Record<string, any>[]
): Promise<string | null> {
  const { data: inserted, error: insertError } =
    rows.length > 0
      ? await supabase.from(table).insert(rows).select("id")
      : { data: [], error: null };

  if (insertError) {
    return insertError.message;
  }

  const keepIds = (inserted || []).map((r: any) => r.id);
  const deleteQuery = supabase
    .from(table)
    .delete()
    .eq("entity_type", entityType)
    .eq("entity_id", entityId);

  const { error: deleteError } =
    keepIds.length > 0 ? await deleteQuery.not("id", "in", `(${keepIds.join(",")})`) : await deleteQuery;

  return deleteError?.message ?? null;
}

export async function POST(req: Request) {
  const staff = await requireStaff();
  if (!staff) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, data } = body; // type: 'urban' | 'development' | 'rural'

    const supabase = createAdminClient() as any;

    if (type === "urban") {
      const prop = data as UrbanProperty;

      let finalCode = prop.code?.trim().toUpperCase();
      if (!finalCode) {
        const { data: existingRows } = await supabase.from("urban_properties").select("code");
        finalCode = getNextSequentialCode(existingRows || [], "MRQ-U", 101);
      } else {
        const { data: conflict } = await supabase
          .from("urban_properties")
          .select("id, slug")
          .eq("code", finalCode)
          .maybeSingle();

        if (conflict && conflict.slug !== prop.slug) {
          const { data: allRows } = await supabase.from("urban_properties").select("code");
          finalCode = getNextSequentialCode(allRows || [], "MRQ-U", 101);
        }
      }
      
      const { data: row, error: rowError } = await supabase
        .from("urban_properties")
        .upsert(
          {
            slug: prop.slug,
            code: finalCode,
            title: prop.title,
            property_type: prop.type,
            neighborhood: prop.neighborhood,
            city: "Campo Grande",
            price: prop.price,
            bedrooms: prop.bedrooms,
            suites: prop.suites,
            parking: prop.parking,
            area: prop.area,
            description: prop.description || null,
            features: prop.features || [],
            status: "published",
            badges: prop.badges || ["novo", "alto-padrao"],
          },
          { onConflict: "slug" }
        )
        .select("id")
        .single();

      if (rowError || !row) {
        return NextResponse.json({ success: false, error: rowError?.message }, { status: 400 });
      }

      const entityId = row.id;

      const allImages = [
        ...(prop.coverImage?.url ? [{ url: prop.coverImage.url, alt: prop.coverImage.alt || prop.title, is_cover: true, position: 0 }] : []),
        ...(prop.gallery || [])
          .filter((g) => g.url && g.url.trim() !== "")
          .map((g, idx) => ({
            url: g.url,
            alt: g.alt || prop.title,
            is_cover: false,
            position: idx + 1,
          })),
      ];

      const imageInserts = allImages.map((img) => ({
        entity_type: "urban_property",
        entity_id: entityId,
        url: normalizeImageUrl(img.url),
        alt: img.alt,
        is_cover: img.is_cover,
        position: img.position,
      }));

      const imagesError = await syncEntityRows(supabase, "property_images", "urban_property", entityId, imageInserts);
      if (imagesError) {
        return NextResponse.json({ success: false, error: `Falha ao salvar fotos: ${imagesError}` }, { status: 400 });
      }

      const videoInserts = (prop.videos || [])
        .filter((v) => v.url && v.url.trim() !== "")
        .map((v, idx) => ({
          entity_type: "urban_property",
          entity_id: entityId,
          kind: v.kind,
          url: normalizeVideoUrl(v.url),
          alt: v.alt || prop.title,
          position: idx,
        }));

      const videosError = await syncEntityRows(supabase, "property_videos", "urban_property", entityId, videoInserts);
      if (videosError) {
        return NextResponse.json({ success: false, error: `Falha ao salvar vídeos: ${videosError}` }, { status: 400 });
      }

      revalidatePath("/imoveis/campo-grande");
      revalidatePath(`/imoveis/campo-grande/${prop.slug}`);
      revalidatePath(`/i/${prop.code}`);
      revalidatePath("/");

      return NextResponse.json({ success: true, id: entityId });
    }

    if (type === "development") {
      const dev = data as Development;

      const { data: row, error: rowError } = await supabase
        .from("developments")
        .upsert(
          {
            slug: dev.slug,
            name: dev.name,
            city: dev.city,
            neighborhood: dev.neighborhood,
            stage: dev.stage,
            delivery_forecast: dev.deliveryDate?.trim() || null,
            short_description: dev.shortDescription?.trim() || null,
            description: dev.description?.trim() || null,
            price_from: dev.priceFrom ?? null,
            bedrooms_min: dev.bedroomsRange ? dev.bedroomsRange[0] : null,
            bedrooms_max: dev.bedroomsRange ? dev.bedroomsRange[1] : null,
            suites_min: dev.suitesRange ? dev.suitesRange[0] : null,
            suites_max: dev.suitesRange ? dev.suitesRange[1] : null,
            parking_min: dev.parkingRange ? dev.parkingRange[0] : null,
            parking_max: dev.parkingRange ? dev.parkingRange[1] : null,
            area_min: dev.areaRange ? dev.areaRange[0] : null,
            area_max: dev.areaRange ? dev.areaRange[1] : null,
            distance_to_sea: dev.distanceToSea?.trim() || null,
            amenities: dev.features || [],
            status: "published",
            badges: dev.badges || ["lancamento", "alto-padrao"],
          },
          { onConflict: "slug" }
        )
        .select("id")
        .single();

      if (rowError || !row) {
        return NextResponse.json({ success: false, error: rowError?.message }, { status: 400 });
      }

      const entityId = row.id;

      const allImages = [
        ...(dev.coverImage?.url ? [{ url: dev.coverImage.url, alt: dev.coverImage.alt || dev.name, is_cover: true, position: 0 }] : []),
        ...(dev.gallery || [])
          .filter((g) => g.url && g.url.trim() !== "")
          .map((g, idx) => ({
            url: g.url,
            alt: g.alt || dev.name,
            is_cover: false,
            position: idx + 1,
          })),
      ];

      const imageInserts = allImages.map((img) => ({
        entity_type: "development",
        entity_id: entityId,
        url: normalizeImageUrl(img.url),
        alt: img.alt,
        is_cover: img.is_cover,
        position: img.position,
      }));

      const imagesError = await syncEntityRows(supabase, "property_images", "development", entityId, imageInserts);
      if (imagesError) {
        return NextResponse.json({ success: false, error: `Falha ao salvar fotos: ${imagesError}` }, { status: 400 });
      }

      const videoInserts = (dev.videos || [])
        .filter((v) => v.url && v.url.trim() !== "")
        .map((v, idx) => ({
          entity_type: "development",
          entity_id: entityId,
          kind: v.kind,
          url: normalizeVideoUrl(v.url),
          alt: v.alt || dev.name,
          position: idx,
        }));

      const videosError = await syncEntityRows(supabase, "property_videos", "development", entityId, videoInserts);
      if (videosError) {
        return NextResponse.json({ success: false, error: `Falha ao salvar vídeos: ${videosError}` }, { status: 400 });
      }

      revalidatePath("/empreendimentos");
      revalidatePath(`/empreendimentos/${dev.city}`);
      revalidatePath(`/empreendimentos/${dev.city}/${dev.slug}`);
      if (dev.code) revalidatePath(`/i/${dev.code}`);
      revalidatePath("/");

      return NextResponse.json({ success: true, id: entityId });
    }

    if (type === "rural") {
      const rural = data as RuralProperty;

      let finalCode = rural.code?.trim().toUpperCase();
      if (!finalCode) {
        const { data: existingRows } = await supabase.from("rural_properties").select("code");
        finalCode = getNextSequentialCode(existingRows || [], "MRQ-R", 201);
      } else {
        const { data: conflict } = await supabase
          .from("rural_properties")
          .select("id, slug")
          .eq("code", finalCode)
          .maybeSingle();

        if (conflict && conflict.slug !== rural.slug) {
          const { data: allRows } = await supabase.from("rural_properties").select("code");
          finalCode = getNextSequentialCode(allRows || [], "MRQ-R", 201);
        }
      }

      const { data: row, error: rowError } = await supabase
        .from("rural_properties")
        .upsert(
          {
            slug: rural.slug,
            code: finalCode,
            title: rural.title,
            state: rural.state,
            municipality: rural.municipality,
            total_hectares: rural.totalHectares,
            activity: rural.activity,
            price: rural.price ?? null,
            price_per_hectare: rural.pricePerHectare ?? null,
            description: rural.description?.trim() || null,
            water_sources: rural.features || [],
            status: "published",
            badges: rural.badges || ["oportunidade"],
          },
          { onConflict: "slug" }
        )
        .select("id")
        .single();

      if (rowError || !row) {
        return NextResponse.json({ success: false, error: rowError?.message }, { status: 400 });
      }

      const entityId = row.id;

      const allImages = [
        ...(rural.coverImage?.url ? [{ url: rural.coverImage.url, alt: rural.coverImage.alt || rural.title, is_cover: true, position: 0 }] : []),
        ...(rural.gallery || [])
          .filter((g) => g.url && g.url.trim() !== "")
          .map((g, idx) => ({
            url: g.url,
            alt: g.alt || rural.title,
            is_cover: false,
            position: idx + 1,
          })),
      ];

      const imageInserts = allImages.map((img) => ({
        entity_type: "rural_property",
        entity_id: entityId,
        url: normalizeImageUrl(img.url),
        alt: img.alt,
        is_cover: img.is_cover,
        position: img.position,
      }));

      const imagesError = await syncEntityRows(supabase, "property_images", "rural_property", entityId, imageInserts);
      if (imagesError) {
        return NextResponse.json({ success: false, error: `Falha ao salvar fotos: ${imagesError}` }, { status: 400 });
      }

      const videoInserts = (rural.videos || [])
        .filter((v) => v.url && v.url.trim() !== "")
        .map((v, idx) => ({
          entity_type: "rural_property",
          entity_id: entityId,
          kind: v.kind,
          url: normalizeVideoUrl(v.url),
          alt: v.alt || rural.title,
          position: idx,
        }));

      const videosError = await syncEntityRows(supabase, "property_videos", "rural_property", entityId, videoInserts);
      if (videosError) {
        return NextResponse.json({ success: false, error: `Falha ao salvar vídeos: ${videosError}` }, { status: 400 });
      }

      revalidatePath("/rural");
      revalidatePath(`/rural/${rural.slug}`);
      revalidatePath(`/i/${rural.code}`);
      revalidatePath("/");

      return NextResponse.json({ success: true, id: entityId });
    }

    return NextResponse.json({ success: false, error: "Tipo de imóvel inválido" }, { status: 400 });
  } catch (err: any) {
    console.error("Erro na rota /api/properties/save:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
