export const SUPABASE_COOKIE_NAME = "sb-monarqinvest-auth-token";

export const SUPABASE_URL =
  typeof window === "undefined" && process.env.INTERNAL_SUPABASE_URL
    ? process.env.INTERNAL_SUPABASE_URL
    : process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://monarqinvest.com.br/supabase";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJpc3MiOiAic3VwYWJhc2UiLCAicmVmIjogImxvY2FsIiwgInJvbGUiOiAiYW5vbiIsICJpYXQiOiAxNzA0MDAwMDAwLCAiZXhwIjogMjAxOTM2MDAwMH0.EeyfF_Jsuy4n2iK1S411vsXzz-lUs1S1GWrujdExco0";

export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJpc3MiOiAic3VwYWJhc2UiLCAicmVmIjogImxvY2FsIiwgInJvbGUiOiAic2VydmljZV9yb2xlIiwgImlhdCI6IDE3MDQwMDAwMDAsICJleHAiOiAyMDE5MzYwMDAwfQ.8JYs2MgnSbggAC0oSmsSlb6a5A91xGU78OUXLaQQG3c";
