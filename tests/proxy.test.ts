import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const getUserMock = vi.fn();
const maybeSingleMock = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    auth: { getUser: getUserMock },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: maybeSingleMock,
        }),
      }),
    }),
  }),
}));

import { proxy } from "@/proxy";

function makeRequest(path: string) {
  return new NextRequest(new URL(path, "http://localhost"));
}

describe("proxy() — CORRIGIDO: sempre valida sessão real do Supabase (sem cookie 'monarq_admin_session')", () => {
  beforeEach(() => vi.clearAllMocks());

  it("redireciona visitante sem sessão para /admin/login", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });

    const res = await proxy(makeRequest("/admin/dashboard"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/admin/login");
  });

  it("um cookie forjado sozinho não basta mais: sem usuário real do Supabase, não há acesso", async () => {
    // O antigo backdoor checava apenas a presença do cookie 'monarq_admin_session'.
    // Agora a validação é 100% via supabase.auth.getUser() — um cookie qualquer
    // setado pelo atacante não influencia mais o resultado.
    const req = makeRequest("/admin/dashboard");
    req.cookies.set("monarq_admin_session", "valor-forjado-pelo-atacante");
    getUserMock.mockResolvedValue({ data: { user: null } });

    const res = await proxy(req);
    expect(res.headers.get("location")).toContain("/admin/login");
  });

  it("redireciona para '/' um usuário autenticado que não é staff (nem admin nem editor)", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "u1" } } });
    maybeSingleMock.mockResolvedValue({ data: { role: "cliente" } });

    const res = await proxy(makeRequest("/admin/dashboard"));
    expect(res.headers.get("location")).toBe("http://localhost/");
  });

  it("libera o acesso para um usuário com role 'admin' ou 'editor'", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "u1" } } });
    maybeSingleMock.mockResolvedValue({ data: { role: "editor" } });

    const res = await proxy(makeRequest("/admin/dashboard"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("redireciona staff autenticado para /admin/dashboard se tentar acessar /admin/login", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "u1" } } });
    maybeSingleMock.mockResolvedValue({ data: { role: "admin" } });

    const res = await proxy(makeRequest("/admin/login"));
    expect(res.headers.get("location")).toContain("/admin/dashboard");
  });
});
