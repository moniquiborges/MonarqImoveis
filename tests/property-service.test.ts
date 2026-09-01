import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("isSupabaseConfigured()", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("FALHA (bug real, não hipotético): mesmo com as env vars vazias, retorna true — porque lê de constants.ts, que tem fallback hardcoded para o projeto Supabase real", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.resetModules();
    const { isSupabaseConfigured } = await import("@/lib/supabase/is-configured");
    // Comportamento ATUAL do código (bug): deveria ser `false`, mas é `true`.
    // Isso torna morto todo o branch de fallback para mock em propertyService.ts,
    // login/actions.ts e admin/(dashboard)/layout.tsx — eles nunca entram no
    // modo "demo/offline", e sempre tentam falar com o projeto Supabase
    // hardcoded em src/lib/supabase/constants.ts. Diverge do proxy.ts, que
    // lê `process.env` diretamente e por isso SE comporta como esperado.
    expect(isSupabaseConfigured()).toBe(true);
  });

  it("retorna true quando ambas estão setadas", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://x.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "chave");
    vi.resetModules();
    const { isSupabaseConfigured } = await import("@/lib/supabase/is-configured");
    expect(isSupabaseConfigured()).toBe(true);
  });
});

describe("fetchUrbanPropertyBySlug() — modo mock (Supabase desconfigurado)", () => {
  beforeEach(() => {
    vi.resetModules();
    // Mocado diretamente (em vez de via env vars) porque isSupabaseConfigured()
    // real sempre retorna true — ver bug documentado acima.
    vi.doMock("@/lib/supabase/is-configured", () => ({
      isSupabaseConfigured: () => false,
    }));
  });
  afterEach(() => vi.doUnmock("@/lib/supabase/is-configured"));

  it("é case-insensitive tanto para slug quanto para code", async () => {
    const { fetchUrbanPropertyBySlug } = await import("@/lib/services/propertyService");
    const { mockUrbanProperties } = await import("@/lib/mock/properties");
    const target = mockUrbanProperties[0];

    const bySlug = await fetchUrbanPropertyBySlug(target.slug.toUpperCase());
    const byCode = await fetchUrbanPropertyBySlug(target.code.toLowerCase());

    expect(bySlug?.slug).toBe(target.slug);
    expect(byCode?.slug).toBe(target.slug);
  });

  it("retorna undefined para um slug inexistente em vez de lançar exceção", async () => {
    const { fetchUrbanPropertyBySlug } = await import("@/lib/services/propertyService");
    const result = await fetchUrbanPropertyBySlug("nao-existe-jamais-123");
    expect(result).toBeUndefined();
  });
});
