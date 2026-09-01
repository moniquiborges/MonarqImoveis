import { createClient } from "@supabase/supabase-js";

const url = "https://gxnqfrmwjobvgcrdguay.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4bnFmcm13am9idmdjcmRndWF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzU4NjY2NywiZXhwIjoyMTAzMTYyNjY3fQ.LdOdqyAPSGZUOghKvLVa2uiCl2UfLHnFDDLcGGtkBgI";

async function cleanPlaceholder() {
  const supabase = createClient(url, serviceRoleKey);
  console.log("Removendo itens placeholder...");
  await supabase.from("urban_properties").delete().eq("slug", "casa-com-3-quartos-a-venda-189m-alphaville-campo-grande");
  await supabase.from("property_images").delete().eq("entity_type", "urban_property");
  console.log("✓ Limpeza concluída!");
}

cleanPlaceholder();
