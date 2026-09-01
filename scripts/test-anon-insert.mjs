import { createClient } from "@supabase/supabase-js";

const url = "https://gxnqfrmwjobvgcrdguay.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4bnFmcm13am9idmdjcmRndWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1ODY2NjcsImV4cCI6MjEwMzE2MjY2N30.tMwscQkJs7RURFfGO2FCOErEbIXNTq8f5vdattsbcUs";

async function testAnonInsert() {
  const supabase = createClient(url, anonKey);

  console.log("Testando inserção com ANON KEY (como faz o navegador admin)...");

  const { data, error } = await supabase
    .from("urban_properties")
    .upsert(
      {
        slug: "imovel-teste-anon",
        code: "MRQ-U999",
        title: "Imóvel Teste Anon",
        property_type: "Casa",
        neighborhood: "Centro",
        city: "Campo Grande",
        price: 900000,
        status: "published",
        badges: ["novo"],
      },
      { onConflict: "slug" }
    )
    .select("id")
    .single();

  if (error) {
    console.error("❌ ERRO na inserção com anon key:", error);
  } else {
    console.log("✓ Sucesso! ID:", data.id);
  }
}

testAnonInsert();
