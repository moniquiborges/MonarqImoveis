import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UrbanProperty, Development, RuralProperty } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body; // type: 'urban' | 'development' | 'rural'

    const supabase = createAdminClient() as any;

    if (type === "urban") {
      const prop = data as UrbanProperty;
      
      const { data: row, error: rowError } = await supabase
        .from("urban_properties")
        .upsert(
          {
            slug: prop.slug,
            code: prop.code,
            title: prop.title,
            property_type: prop.type,
            neighborhood: prop.neighborhood,
            city: "Campo Grande",
            price: prop.price,
            bedrooms: prop.bedrooms,
            suites: prop.suites,
            parking: prop.parking,
            area: prop.area,
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
      await supabase.from("property_images").delete().eq("entity_id", entityId);

      const allImages = [
        { url: prop.coverImage.url, alt: prop.coverImage.alt || prop.title, is_cover: true, position: 0 },
        ...(prop.gallery || []).map((g, idx) => ({
          url: g.url,
          alt: g.alt || prop.title,
          is_cover: false,
          position: idx + 1,
        })),
      ];

      const imageInserts = allImages.map((img) => ({
        entity_type: "urban_property",
        entity_id: entityId,
        url: img.url,
        alt: img.alt,
        is_cover: img.is_cover,
        position: img.position,
      }));

      if (imageInserts.length > 0) {
        await supabase.from("property_images").insert(imageInserts);
      }

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
            delivery_forecast: dev.deliveryDate,
            short_description: dev.shortDescription,
            price_from: dev.priceFrom,
            bedrooms_min: dev.bedroomsRange[0],
            bedrooms_max: dev.bedroomsRange[1],
            suites_min: dev.suitesRange ? dev.suitesRange[0] : null,
            suites_max: dev.suitesRange ? dev.suitesRange[1] : null,
            parking_min: dev.parkingRange ? dev.parkingRange[0] : null,
            parking_max: dev.parkingRange ? dev.parkingRange[1] : null,
            area_min: dev.areaRange[0],
            area_max: dev.areaRange[1],
            distance_to_sea: dev.distanceToSea,
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
      await supabase.from("property_images").delete().eq("entity_id", entityId);

      const allImages = [
        { url: dev.coverImage.url, alt: dev.coverImage.alt || dev.name, is_cover: true, position: 0 },
        ...(dev.gallery || []).map((g, idx) => ({
          url: g.url,
          alt: g.alt || dev.name,
          is_cover: false,
          position: idx + 1,
        })),
      ];

      const imageInserts = allImages.map((img) => ({
        entity_type: "development",
        entity_id: entityId,
        url: img.url,
        alt: img.alt,
        is_cover: img.is_cover,
        position: img.position,
      }));

      if (imageInserts.length > 0) {
        await supabase.from("property_images").insert(imageInserts);
      }

      return NextResponse.json({ success: true, id: entityId });
    }

    if (type === "rural") {
      const rural = data as RuralProperty;

      const { data: row, error: rowError } = await supabase
        .from("rural_properties")
        .upsert(
          {
            slug: rural.slug,
            code: rural.code,
            title: rural.title,
            state: rural.state,
            municipality: rural.municipality,
            total_hectares: rural.totalHectares,
            activity: rural.activity,
            price: rural.price,
            price_per_hectare: rural.pricePerHectare,
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
      await supabase.from("property_images").delete().eq("entity_id", entityId);

      const allImages = [
        { url: rural.coverImage.url, alt: rural.coverImage.alt || rural.title, is_cover: true, position: 0 },
        ...(rural.gallery || []).map((g, idx) => ({
          url: g.url,
          alt: g.alt || rural.title,
          is_cover: false,
          position: idx + 1,
        })),
      ];

      const imageInserts = allImages.map((img) => ({
        entity_type: "rural_property",
        entity_id: entityId,
        url: img.url,
        alt: img.alt,
        is_cover: img.is_cover,
        position: img.position,
      }));

      if (imageInserts.length > 0) {
        await supabase.from("property_images").insert(imageInserts);
      }

      return NextResponse.json({ success: true, id: entityId });
    }

    return NextResponse.json({ success: false, error: "Tipo de imóvel inválido" }, { status: 400 });
  } catch (err: any) {
    console.error("Erro na rota /api/properties/save:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
