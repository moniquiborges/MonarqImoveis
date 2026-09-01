import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const { requireStaffMock } = vi.hoisted(() => ({ requireStaffMock: vi.fn() }));
vi.mock("@/lib/supabase/require-staff", () => ({
  requireStaff: requireStaffMock,
}));

const upsertSingle = vi.fn();
const deleteEq = vi.fn().mockResolvedValue({ error: null });
const insert = vi.fn().mockResolvedValue({ error: null });

function makeQueryBuilder() {
  const builder: any = {
    upsert: vi.fn(() => builder),
    select: vi.fn(() => builder),
    single: vi.fn(() => upsertSingle()),
    delete: vi.fn(() => builder),
    eq: vi.fn(() => deleteEq()),
    insert: vi.fn(() => insert()),
  };
  return builder;
}

const fromMock = vi.fn(() => makeQueryBuilder());

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ from: fromMock }),
}));

import { POST as saveProperty } from "@/app/api/properties/save/route";

function jsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/properties/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/properties/save", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    upsertSingle.mockResolvedValue({ data: { id: "entity-123" }, error: null });
  });

  it("CORRIGIDO: rejeita com 401 quando não há staff autenticado, sem tocar no banco", async () => {
    requireStaffMock.mockResolvedValue(null);

    const req = jsonRequest({
      type: "urban",
      data: { slug: "teste-sem-auth", code: "MRQ-U999", title: "Invasão", price: 1 },
    });

    const res = await saveProperty(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("permite gravar quando requireStaff() retorna um usuário staff válido", async () => {
    requireStaffMock.mockResolvedValue({ id: "user-1" });

    const req = jsonRequest({
      type: "urban",
      data: { slug: "ok", code: "MRQ-U1", title: "Apto" },
    });
    const res = await saveProperty(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(fromMock).toHaveBeenCalledWith("urban_properties");
  });

  it("retorna 400 quando o Supabase rejeita o upsert", async () => {
    requireStaffMock.mockResolvedValue({ id: "user-1" });
    upsertSingle.mockResolvedValue({ data: null, error: { message: "duplicate slug" } });

    const req = jsonRequest({ type: "urban", data: { slug: "dup", code: "MRQ-U1" } });
    const res = await saveProperty(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it("retorna 400 para um 'type' desconhecido em vez de lançar exceção", async () => {
    requireStaffMock.mockResolvedValue({ id: "user-1" });

    const req = jsonRequest({ type: "invalido", data: {} });
    const res = await saveProperty(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it("ALERTA (ainda pendente): aceita payload sem nenhuma validação de schema (sem Zod) para um staff válido", async () => {
    requireStaffMock.mockResolvedValue({ id: "user-1" });

    const req = jsonRequest({ type: "urban", data: {} });
    const res = await saveProperty(req);

    expect(res.status).toBe(200);
  });

  it("body malformado (JSON inválido) derruba a rota com 500 em vez de 400", async () => {
    requireStaffMock.mockResolvedValue({ id: "user-1" });

    const req = new Request("http://localhost/api/properties/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ isso não é json",
    });

    const res = await saveProperty(req);
    expect(res.status).toBe(500);
  });
});
