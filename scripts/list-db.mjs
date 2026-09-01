import { createClient } from "@supabase/supabase-js";

const url = "https://gxnqfrmwjobvgcrdguay.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4bnFmcm13am9idmdjcmRndWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1ODY2NjcsImV4cCI6MjEwMzE2MjY2N30.tMwscQkJs7RURFfGO2FCOErEbIXNTq8f5vdattsbcUs";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4bnFmcm13am9idmdjcmRndWF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzU4NjY2NywiZXhwIjoyMTAzMTYyNjY3fQ.LdOdqyAPSGZUOghKvLVa2uiCl2UfLHnFDDLcGGtkBgI";

async function listAll() {
  const supabase = createClient(url, anonKey);
  const { data, error } = await supabase.from("urban_properties").select("id, slug, title, status, price");
  console.log("Erro:", error);
  console.log("Linhas encontradas com anonKey:", data);

  const supabaseAdmin = createClient(url, serviceRoleKey);
  const { data: allAdmin } = await supabaseAdmin.from("urban_properties").select("id, slug, title, status, price");
  console.log("Linhas encontradas com serviceRoleKey:", allAdmin);
}

listAll();
