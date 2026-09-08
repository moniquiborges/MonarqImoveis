import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaff } from "@/lib/supabase/require-staff";

const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

const BUCKET_BY_CATEGORY: Record<string, string> = {
  urban: "urban-property-images",
  coastal: "development-images",
  rural: "rural-property-images",
  blog: "blog-images",
  general: "blog-images",
};

export async function POST(req: Request) {
  const staff = await requireStaff();
  if (!staff) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const category = String(formData.get("category") || "general");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "O arquivo precisa ser uma imagem" }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "Imagem muito grande (limite de 15MB)" },
        { status: 400 }
      );
    }

    const bucket = BUCKET_BY_CATEGORY[category] || BUCKET_BY_CATEGORY.general;
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${crypto.randomUUID()}-${sanitizedName}`;

    const supabase = createAdminClient();
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 400 });
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({ success: true, url: publicUrlData.publicUrl });
  } catch (err: any) {
    console.error("Erro na rota /api/media/upload-image:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
