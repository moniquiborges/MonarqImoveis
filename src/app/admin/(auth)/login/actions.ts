"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export interface LoginState {
  error: string | null;
}

export async function signIn(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  // Se o Supabase não estiver configurado com credenciais remotas, valida usuário de teste/demonstração
  if (!isSupabaseConfigured()) {
    if (
      (email === "admin@monarqimoveis.com.br" && password === "monarq2026") ||
      (email === "admin@monarq.com.br" && password === "admin123")
    ) {
      const cookieStore = await cookies();
      cookieStore.set("monarq_admin_session", email, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });

      redirect("/admin/dashboard");
    }

    return {
      error: "Credenciais de demonstração inválidas. Utilize: admin@monarqimoveis.com.br / monarq2026",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Credenciais inválidas." };
  }

  redirect("/admin/dashboard");
}
