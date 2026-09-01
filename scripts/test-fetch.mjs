import { createClient } from "@supabase/supabase-js";

const url = "https://gxnqfrmwjobvgcrdguay.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4bnFmcm13am9idmdjcmRndWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1ODY2NjcsImV4cCI6MjEwMzE2MjY2N30.tMwscQkJs7RURFfGO2FCOErEbIXNTq8f5vdattsbcUs";

async function testFetch() {
  const supabase = createClient(url, anonKey);
  const slug = "casa-com-3-quartos-a-venda-189m-alphaville-campo-grande";

  const { data: prop, error } = await supabase
    .from("urban_properties")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Erro ao buscar imóvel:", error);
    return;
  }

  console.log("✓ Imóvel encontrado:", prop.title);
  console.log("Preço:", prop.price);
  console.log("Status:", prop.status);

  // Busca fotos
  const { data: images } = await supabase
    .from("property_images")
    .select("*")
    .eq("entity_id", prop.id)
    .order("position", { ascending: true });

  console.log("✓ Imagens encontradas:", images?.length ?? 0);
  if (images && images.length > 0) {
    console.log("Primeira imagem:", images[0].url);
  }
}

testFetch();
