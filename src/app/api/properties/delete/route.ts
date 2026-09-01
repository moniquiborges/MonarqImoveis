import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaff } from "@/lib/supabase/require-staff";

export async function POST(req: Request) {
  const staff = await requireStaff();
  if (!staff) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { type, slug } = await req.json();
    const supabase = createAdminClient() as any;

    if (type === "urban") {
      await supabase.from("urban_properties").delete().eq("slug", slug);
      return NextResponse.json({ success: true });
    }

    if (type === "development") {
      await supabase.from("developments").delete().eq("slug", slug);
      return NextResponse.json({ success: true });
    }

    if (type === "rural") {
      await supabase.from("rural_properties").delete().eq("slug", slug);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Tipo inválido" }, { status: 400 });
  } catch (err: any) {
    console.error("Erro na rota /api/properties/delete:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
