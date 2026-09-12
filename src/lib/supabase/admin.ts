import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "./constants";
import type { Database } from "@/types/database";

/**
 * Cliente com a service role key — ignora RLS. Uso restrito a Server Actions
 * e Route Handlers de confiança.
 */
export function createAdminClient() {
  const url = SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY;

  return createSupabaseClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
