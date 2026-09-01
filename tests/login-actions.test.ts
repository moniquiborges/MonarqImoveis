import { describe, it, expect, vi, beforeEach } from "vitest";

const { redirectSpy, signInWithPassword } = vi.hoisted(() => ({
  redirectSpy: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
  signInWithPassword: vi.fn(),
}));

vi.mock("next/navigation", () => ({ redirect: redirectSpy }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { signInWithPassword } }),
}));

import { signIn } from "@/app/admin/(auth)/login/actions";

function formData(fields: Record<string, string>) {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.set(k, v));
  return fd;
}

describe("signIn()", () => {
  beforeEach(() => vi.clearAllMocks());

  it("redireciona para /admin/dashboard em credenciais válidas", async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    const fd = formData({ email: "admin@monarqimoveis.com.br", password: "senha-real" });

    await expect(signIn({ error: null }, fd)).rejects.toThrow("REDIRECT:/admin/dashboard");
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "admin@monarqimoveis.com.br",
      password: "senha-real",
    });
  });

  it("mapeia erro do Supabase para mensagem genérica 'Credenciais inválidas.'", async () => {
    signInWithPassword.mockResolvedValue({ error: { message: "invalid_grant" } });
    const fd = formData({ email: "x@x.com", password: "errada" });

    const result = await signIn({ error: null }, fd);
    expect(result.error).toBe("Credenciais inválidas.");
  });

  it("rejeita quando email ou senha vêm vazios sem chamar o Supabase", async () => {
    const fd = formData({ email: "", password: "" });
    const result = await signIn({ error: null }, fd);
    expect(result.error).toBe("Informe e-mail e senha.");
    expect(signInWithPassword).not.toHaveBeenCalled();
  });
});
