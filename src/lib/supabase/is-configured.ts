import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./constants";

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
