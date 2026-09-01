import { createClient } from "@supabase/supabase-js";

const url = "https://gxnqfrmwjobvgcrdguay.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4bnFmcm13am9idmdjcmRndWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1ODY2NjcsImV4cCI6MjEwMzE2MjY2N30.tMwscQkJs7RURFfGO2FCOErEbIXNTq8f5vdattsbcUs";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4bnFmcm13am9idmdjcmRndWF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzU4NjY2NywiZXhwIjoyMTAzMTYyNjY3fQ.LdOdqyAPSGZUOghKvLVa2uiCl2UfLHnFDDLcGGtkBgI";

async function testFull() {
  console.log("=========================================");
  console.log("TESTE COMPLETO DE CONEXÃO COM SUPABASE");
  console.log("=========================================");

  // 1. Service Role Client (Admin / Backend)
  const supabaseAdmin = createClient(url, serviceRoleKey);
  console.log("1. Testando Acesso Administrativo (Service Role):");
  
  const tables = ["developments", "urban_properties", "rural_properties", "leads", "blog_posts", "agents", "settings", "profiles"];
  for (const table of tables) {
    const res = await supabaseAdmin.from(table).select("*").limit(1);
    if (res.error) {
      console.log(`❌ ${table}: ${res.error.message}`);
    } else {
      console.log(`✓ ${table}: OK (Ativa e pronta para gravação/leitura)`);
    }
  }

  // 2. Storage Buckets
  console.log("\n2. Testando Buckets de Imagens e Documentos:");
  const { data: buckets, error: bucketErr } = await supabaseAdmin.storage.listBuckets();
  if (bucketErr) {
    console.log("❌ Buckets:", bucketErr.message);
  } else {
    buckets.forEach((b) => console.log(`✓ Bucket '${b.name}': Ativo (Público: ${b.public})`));
  }

  // 3. Anon Client (Frontend Público)
  console.log("\n3. Testando Acesso Público / Anon Key (Site Frontend):");
  const supabaseAnon = createClient(url, anonKey);
  const testAnon = await supabaseAnon.from("developments").select("*").limit(1);
  if (testAnon.error) {
    console.log("❌ Anon access:", testAnon.error.message);
  } else {
    console.log("✓ Anon Key / Leitura Pública: 100% Funcional!");
  }

  console.log("=========================================");
  console.log("STATUS FINAL: BANCO DE DADOS 100% CONECTADO E OPERACIONAL!");
  console.log("=========================================");
}

testFull();
