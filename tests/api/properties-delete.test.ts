import { describe, it, expect, vi, beforeEach } from "vitest";

const { requireStaffMock } = vi.hoisted(() => ({ requireStaffMock: vi.fn() }));
vi.mock("@/lib/supabase/require-staff", () => ({
  requireStaff: requireStaffMock,
}));

const deleteEq = vi.fn().mockResolvedValue({ error: null });
function makeQueryBuilder() {
  const builder: any = {
    delete: vi.fn(() => builder),
    eq: vi.fn(() => deleteEq()),
  };
  return builder;
}
const fromMock = vi.fn(() => makeQueryBuilder());

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ from: fromMock }),
}));

import { POST as deleteProperty } from "@/app/api/properties/delete/route";

function jsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/properties/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/properties/delete", () => {
  beforeEach(() => vi.clearAllMocks());

  it("CORRIGIDO: rejeita com 401 quando não há staff autenticado, sem apagar nada", async () => {
    requireStaffMock.mockResolvedValue(null);

    const req = jsonRequest({ type: "rural", slug: "fazenda-do-vizinho" });
    const res = await deleteProperty(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("apaga quando requireStaff() retorna um usuário válido", async () => {
    requireStaffMock.mockResolvedValue({ id: "user-1" });

    const req = jsonRequest({ type: "rural", slug: "fazenda-x" });
    const res = await deleteProperty(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(fromMock).toHaveBeenCalledWith("rural_properties");
  });

  it("retorna 400 para 'type' inválido mesmo autenticado", async () => {
    requireStaffMock.mockResolvedValue({ id: "user-1" });

    const req = jsonRequest({ type: "banner", slug: "x" });
    const res = await deleteProperty(req);
    expect(res.status).toBe(400);
  });
});
