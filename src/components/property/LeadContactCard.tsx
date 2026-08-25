"use client";

import { useState } from "react";
import { MessageCircle, Send, CheckCircle2, ShieldCheck } from "lucide-react";
import { formatBRL } from "@/lib/utils";
import { siteConfig, buildWhatsappUrl } from "@/lib/site-config";
import type { LeadInterest } from "@/types";

export interface LeadContactCardProps {
  title: string;
  code?: string;
  slug: string;
  price?: number | null;
  interest: LeadInterest;
  pricePrefix?: string;
  priceSuffix?: string;
}

export function LeadContactCard({
  title,
  code,
  slug,
  price,
  interest,
  pricePrefix,
  priceSuffix,
}: LeadContactCardProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: `Olá, tenho interesse em receber mais informações sobre ${title}.`,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultWhatsappMessage = `Olá! Gostaria de atendimento exclusivo sobre o imóvel "${title}"${code ? ` (Cód: ${code})` : ""}. Link: /imoveis/${slug}`;
  const whatsappUrl = buildWhatsappUrl(defaultWhatsappMessage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simula envio do lead
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <aside className="sticky top-24 rounded-sm border border-areia/60 bg-white p-6 shadow-sm">
      {/* Bloco de Preço */}
      <div className="border-b border-areia/40 pb-5">
        <div className="flex items-center justify-between text-xs tracking-wider uppercase text-graphite/50 mb-1">
          <span>{pricePrefix || "Valor de Investimento"}</span>
          {code && <span className="font-mono text-graphite/40">{code}</span>}
        </div>
        <div className="flex items-baseline gap-1.5">
          <p className="font-display text-2xl md:text-3xl font-semibold text-mineral">
            {price ? formatBRL(price) : "Consulte valores"}
          </p>
          {priceSuffix && <span className="text-xs text-graphite/60">{priceSuffix}</span>}
        </div>
        <p className="mt-1 text-[11px] text-graphite/60">
          Valores sujeitos a alteração e disponibilidade sem aviso prévio.
        </p>
      </div>

      {/* Ação Rápida WhatsApp */}
      {whatsappUrl && (
        <div className="py-5 border-b border-areia/40">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring group flex w-full items-center justify-center gap-2 rounded-xs bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.99] shadow-sm"
          >
            <MessageCircle className="h-5 w-5 fill-current" />
            Falar pelo WhatsApp
          </a>
          <p className="mt-2 text-center text-[11px] text-graphite/50">
            Atendimento prioritário com um consultor especialista
          </p>
        </div>
      )}

      {/* Formulário de Atendimento / Proposta */}
      <div className="pt-5">
        <h4 className="font-display text-base font-semibold text-graphite mb-1">
          Solicitar Dossiê Completo
        </h4>
        <p className="text-xs text-graphite/60 mb-4">
          Preencha seus dados para receber a ficha técnica detalhada e agendar uma visita.
        </p>

        {submitted ? (
          <div className="rounded-xs bg-mineral/5 p-4 text-center border border-mineral/20">
            <CheckCircle2 className="mx-auto h-8 w-8 text-mineral mb-2" />
            <h5 className="text-sm font-semibold text-graphite">Mensagem Enviada!</h5>
            <p className="mt-1 text-xs text-graphite/70">
              Nossa equipe entrará em contato em breve através do telefone informado.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="lead-name" className="sr-only">
                Nome completo
              </label>
              <input
                id="lead-name"
                type="text"
                required
                placeholder="Seu nome completo *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/40 px-3.5 py-2.5 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="lead-phone" className="sr-only">
                WhatsApp ou Telefone
              </label>
              <input
                id="lead-phone"
                type="tel"
                required
                placeholder="WhatsApp ou Telefone com DDD *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/40 px-3.5 py-2.5 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="lead-email" className="sr-only">
                E-mail
              </label>
              <input
                id="lead-email"
                type="email"
                placeholder="Seu melhor e-mail (opcional)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/40 px-3.5 py-2.5 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="lead-message" className="sr-only">
                Mensagem
              </label>
              <textarea
                id="lead-message"
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/40 px-3.5 py-2.5 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="focus-ring group flex w-full items-center justify-center gap-2 rounded-xs bg-mineral px-4 py-3 text-xs font-semibold uppercase tracking-wider text-offwhite transition-colors hover:bg-mineral-light disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {submitting ? "Enviando..." : "Receber Atendimento"}
            </button>
          </form>
        )}

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-graphite/50">
          <ShieldCheck className="h-3.5 w-3.5 text-mineral" />
          <span>Privacidade garantida. Não enviamos spam.</span>
        </div>
      </div>
    </aside>
  );
}
