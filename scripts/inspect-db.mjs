import { createClient } from "@supabase/supabase-js";

const url = "https://gxnqfrmwjobvgcrdguay.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4bnFmcm13am9idmdjcmRndWF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzU4NjY2NywiZXhwIjoyMTAzMTYyNjY3fQ.LdOdqyAPSGZUOghKvLVa2uiCl2UfLHnFDDLcGGtkBgI";

async function inspectDb() {
  const supabase = createClient(url, serviceRoleKey);

  console.log("=== URBAN PROPERTIES ===");
  const { data: urbans } = await supabase.from("urban_properties").select("*");
  console.log(JSON.stringify(urbans, null, 2));

  console.log("=== DEVELOPMENTS ===");
  const { data: devs } = await supabase.from("developments").select("*");
  console.log(JSON.stringify(devs, null, 2));

  console.log("=== PROPERTY IMAGES ===");
  const { data: images } = await supabase.from("property_images").select("*");
  console.log(`Total imagens: ${images?.length || 0}`);
  (images || []).forEach(img => {
    console.log(`- Entity: ${img.entity_type} | ID: ${img.entity_id} | Cover: ${img.is_cover} | Pos: ${img.position} | URL: ${img.url.substring(0, 60)}...`);
  });
}

inspectDb();
