"use client";

import { useActionState, useState } from "react";
import { signIn, type LoginState } from "./actions";
import { KeyRound, ShieldCheck, Sparkles } from "lucide-react";

const initialState: LoginState = { error: null };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const [email, setEmail] = useState("admin@monarqimoveis.com.br");
  const [password, setPassword] = useState("monarq2026");

  const fillDemo = () => {
    setEmail("admin@monarqimoveis.com.br");
    setPassword("monarq2026");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-terracota">
          Painel administrativo
        </span>
        <h1 className="font-display text-2xl text-graphite">Entrar no Sistema</h1>
      </div>

      {/* Dica de Acesso Rápido */}
      <div className="rounded-xs bg-mineral/5 p-3.5 border border-mineral/15 text-xs text-graphite/80 space-y-1">
        <div className="flex items-center justify-between font-semibold text-mineral">
          <span className="inline-flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5" />
            Acesso de Demonstração
          </span>
          <button
            type="button"
            onClick={fillDemo}
            className="text-[11px] text-terracota underline hover:text-terracota-light cursor-pointer"
          >
            Preencher dados
          </button>
        </div>
        <p className="text-[11px] text-graphite/60">
          <strong>E-mail:</strong> <code className="bg-white/80 px-1 rounded">admin@monarqimoveis.com.br</code>
          <br />
          <strong>Senha:</strong> <code className="bg-white/80 px-1 rounded">monarq2026</code>
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[13px] font-medium text-graphite/70">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="focus-ring h-11 rounded-sm border border-graphite/15 bg-white px-3 text-[14px] text-graphite"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-[13px] font-medium text-graphite/70">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="focus-ring h-11 rounded-sm border border-graphite/15 bg-white px-3 text-[14px] text-graphite"
          />
        </div>

        {state.error ? <p className="text-[13px] text-terracota">{state.error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="focus-ring mt-2 flex h-11 items-center justify-center rounded-sm bg-mineral text-[13px] font-medium uppercase tracking-[0.1em] text-offwhite transition-colors hover:bg-mineral-light disabled:opacity-60 cursor-pointer shadow-xs"
        >
          {pending ? "Entrando…" : "Entrar no Painel"}
        </button>
      </form>
    </div>
  );
}
