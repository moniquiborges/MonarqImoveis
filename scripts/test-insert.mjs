import { createClient } from "@supabase/supabase-js";

const url = "https://gxnqfrmwjobvgcrdguay.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4bnFmcm13am9idmdjcmRndWF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzU4NjY2NywiZXhwIjoyMTAzMTYyNjY3fQ.LdOdqyAPSGZUOghKvLVa2uiCl2UfLHnFDDLcGGtkBgI";

async function testInsert() {
  const supabase = createClient(url, serviceRoleKey);

  console.log("Inserindo imóvel de teste no Supabase...");

  // 1. Inserir imóvel urbano
  const { data: urbanData, error: urbanError } = await supabase
    .from("urban_properties")
    .upsert(
      {
        slug: "casa-com-3-quartos-a-venda-189m-alphaville-campo-grande",
        code: "MRQ-U104",
        title: "Casa com 3 Quartos à venda, 189m² - Alphaville Campo Grande",
        property_type: "Casa em condomínio",
        neighborhood: "Alphaville",
        city: "Campo Grande",
        price: 1850000,
        bedrooms: 3,
        suites: 3,
        parking: 2,
        area: 189,
        status: "published",
        badges: ["novo", "alto-padrao"],
        features: ["Piscina", "Espaço Gourmet", "Churrasqueira"],
      },
      { onConflict: "slug" }
    )
    .select()
    .single();

  if (urbanError) {
    console.error("Erro ao inserir imóvel urbano:", urbanError);
    return;
  }

  console.log("✓ Imóvel urbano inserido com ID:", urbanData.id);

  // 2. Inserir imagem de capa
  const { error: imgError } = await supabase.from("property_images").upsert({
    entity_type: "urban_property",
    entity_id: urbanData.id,
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    alt: urbanData.title,
    is_cover: true,
    position: 0,
  });

  if (imgError) {
    console.error("Erro ao inserir imagem:", imgError);
  } else {
    console.log("✓ Imagem vinculada com sucesso!");
  }

  // 3. Testar leitura pública
  const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4bnFmcm13am9idmdjcmRndWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1ODY2NjcsImV4cCI6MjEwMzE2MjY2N30.tMwscQkJs7RURFfGO2FCOErEbIXNTq8f5vdattsbcUs";
  const supabaseAnon = createClient(url, anonKey);
  const { data: publicData, error: publicError } = await supabaseAnon
    .from("urban_properties")
    .select(`
      *,
      property_images (*)
    `)
    .eq("slug", "casa-com-3-quartos-a-venda-189m-alphaville-campo-grande")
    .single();

  if (publicError) {
    console.error("Erro na leitura pública:", publicError);
  } else {
    console.log("✓ Leitura pública bem-sucedida!");
    console.log("Título:", publicData.title);
    console.log("Imagens:", publicData.property_images.length);
  }
}

testInsert();
