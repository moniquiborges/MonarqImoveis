"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useSiteConfig } from "@/contexts/SiteConfigContext";
import { submitContactLead } from "./actions";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  ShieldCheck,
  Building,
  Scale,
} from "lucide-react";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "empreendimentos-sc",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { config: siteConfig, buildWhatsappUrl } = useSiteConfig();

  const whatsappDirectUrl = buildWhatsappUrl("Olá! Gostaria de falar com um consultor da MONARQ.");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const result = await submitContactLead(formData);

    setSubmitting(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setSubmitError(result.error ?? "Não foi possível enviar sua mensagem.");
    }
  };

  return (
    <main className="py-8 md:py-16">
      <Container>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Contato" },
          ]}
        />

        {/* Cabeçalho */}
        <div className="mb-12 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold mb-2">
            Atendimento Personalizado
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-mineral font-normal tracking-tight">
            Fale com a MONARQ
          </h1>
          <p className="mt-3 text-sm md:text-base text-graphite/70 leading-relaxed">
            <strong>Construímos. Avaliamos. Vendemos. Regularizamos.</strong>
            <br />
            Apoio jurídico especializado e inteligência de mercado para decisões patrimoniais sólidas no litoral catarinense, mercado urbano e agronegócio.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Coluna Esquerda: Canais Diretos & Informações Físicas */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-sm border border-areia/60 bg-white p-6 md:p-8 shadow-xs">
              <h3 className="font-display text-xl text-graphite font-medium mb-6">
                Canais de Atendimento
              </h3>

              <div className="space-y-5 text-sm">
                {/* WhatsApp MS */}
                {whatsappDirectUrl && (
                  <div className="flex items-start gap-3.5">
                    <div className="rounded-xs bg-[#25D366]/10 p-2.5 text-[#25D366] shrink-0">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs text-graphite/60 block">WhatsApp Oficial (MS)</span>
                      <a
                        href={whatsappDirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-graphite hover:text-mineral transition-colors"
                      >
                        {siteConfig.whatsappDisplay}
                      </a>
                    </div>
                  </div>
                )}

                {/* Telefone SC */}
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xs bg-mineral/10 p-2.5 text-mineral shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-graphite/60 block">Telefone Comercial (Litoral SC)</span>
                    <a
                      href={`tel:${siteConfig.contactPhone.replace(/\D/g, "")}`}
                      className="font-medium text-graphite hover:text-mineral transition-colors"
                    >
                      {siteConfig.contactPhone}
                    </a>
                  </div>
                </div>

                {/* E-mail */}
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xs bg-mineral/10 p-2.5 text-mineral shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-graphite/60 block">E-mail Institucional</span>
                    <a
                      href={`mailto:${siteConfig.contactEmail}`}
                      className="font-medium text-graphite hover:text-mineral transition-colors"
                    >
                      {siteConfig.contactEmail}
                    </a>
                  </div>
                </div>

                {/* Endereço Sede */}
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xs bg-mineral/10 p-2.5 text-mineral shrink-0">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-graphite/60 block">Escritório Central</span>
                    <p className="font-medium text-graphite leading-snug">
                      Av. Afonso Pena, 1.897 – 4° Andar
                      <br />
                      <span className="text-xs text-graphite/70 font-normal">
                        Edifício Executive Center – Campo Grande/MS
                      </span>
                    </p>
                  </div>
                </div>

                {/* Horário */}
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xs bg-mineral/10 p-2.5 text-mineral shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-graphite/60 block">Horário de Atendimento</span>
                    <p className="font-medium text-graphite">
                      Segunda a Sexta: 08h às 18h
                      <br />
                      <span className="text-xs text-graphite/70 font-normal">
                        Plantões e visitas sob agendamento prévio
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Redes Sociais */}
              <div className="mt-8 border-t border-areia/40 pt-6">
                <span className="text-xs uppercase tracking-wider text-graphite/60 font-semibold block mb-3">
                  Siga a MONARQ
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={siteConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring flex items-center gap-2 rounded-xs border border-areia/70 bg-offwhite/50 px-3 py-2 text-xs font-medium text-graphite hover:bg-offwhite hover:text-terracota transition-colors"
                  >
                    <InstagramIcon className="h-4 w-4" />
                    <span>{siteConfig.instagramHandle}</span>
                  </a>

                  <a
                    href={siteConfig.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring flex items-center gap-2 rounded-xs border border-areia/70 bg-offwhite/50 px-3 py-2 text-xs font-medium text-graphite hover:bg-offwhite hover:text-mineral transition-colors"
                  >
                    <FacebookIcon className="h-4 w-4" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Atendimento Rápido via WhatsApp */}
            {whatsappDirectUrl && (
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring group flex w-full items-center justify-center gap-2 rounded-xs bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-105 shadow-sm"
              >
                <MessageCircle className="h-5 w-5 fill-current" />
                Iniciar Atendimento no WhatsApp
              </a>
            )}
          </div>

          {/* Coluna Direita: Formulário de Mensagem */}
          <div className="lg:col-span-7">
            <div className="rounded-sm border border-areia/60 bg-white p-6 md:p-8 shadow-xs">
              <h3 className="font-display text-xl text-graphite font-medium mb-2">
                Envie uma Mensagem
              </h3>
              <p className="text-xs md:text-sm text-graphite/60 mb-6">
                Preencha o formulário abaixo e nosso time direcionará seu contato para o especialista mais indicado.
              </p>

              {submitted ? (
                <div className="rounded-xs bg-mineral/5 p-8 text-center border border-mineral/20 py-12">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-mineral mb-3" />
                  <h4 className="font-display text-xl text-graphite font-semibold">
                    Mensagem Recebida com Sucesso!
                  </h4>
                  <p className="mt-2 text-sm text-graphite/70 max-w-md mx-auto">
                    Agradecemos o contato. Um consultor da equipe MONARQ entrará em contato em breve através do WhatsApp ou e-mail informado.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        phone: "",
                        email: "",
                        interest: "empreendimentos-sc",
                        message: "",
                      });
                    }}
                    className="mt-6 inline-flex rounded-xs bg-mineral px-5 py-2 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors"
                  >
                    Enviar Nova Mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <div className="rounded-xs border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label htmlFor="form-name" className="block text-xs font-medium text-graphite mb-1">
                      Nome completo *
                    </label>
                    <input
                      id="form-name"
                      type="text"
                      required
                      placeholder="Ex: Roberto Silveira"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3.5 py-2.5 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="form-phone" className="block text-xs font-medium text-graphite mb-1">
                        Telefone / WhatsApp *
                      </label>
                      <input
                        id="form-phone"
                        type="tel"
                        required
                        placeholder="(67) 98213-3789"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3.5 py-2.5 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="form-email" className="block text-xs font-medium text-graphite mb-1">
                        E-mail *
                      </label>
                      <input
                        id="form-email"
                        type="email"
                        required
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3.5 py-2.5 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="form-interest" className="block text-xs font-medium text-graphite mb-1">
                      Área de Interesse Principal *
                    </label>
                    <select
                      id="form-interest"
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3.5 py-2.5 text-xs text-graphite transition-colors focus:border-mineral focus:bg-white cursor-pointer"
                    >
                      <option value="empreendimentos-sc">Empreendimentos SC (Porto Belo, Itapema, BC)</option>
                      <option value="campo-grande">Imóveis em Campo Grande / MS</option>
                      <option value="rural">Propriedades Rurais &amp; Fazendas (MS / MT)</option>
                      <option value="avaliacao">Avaliação Mercadológica (PTAM)</option>
                      <option value="regularizacao">Regularização Imobiliária &amp; Apoio Jurídico</option>
                      <option value="outro">Outro assunto institucional</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="form-message" className="block text-xs font-medium text-graphite mb-1">
                      Mensagem / Detalhes da sua solicitação
                    </label>
                    <textarea
                      id="form-message"
                      rows={4}
                      placeholder="Descreva brevemente seu objetivo ou imóvel de interesse..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3.5 py-2.5 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="focus-ring group flex w-full items-center justify-center gap-2 rounded-xs bg-mineral px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-offwhite transition-colors hover:bg-mineral-light disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? "Enviando Mensagem..." : "Enviar Mensagem"}
                  </button>
                </form>
              )}

              <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-graphite/60">
                <ShieldCheck className="h-4 w-4 text-mineral" />
                <span>Seus dados são confidenciais e protegidos por sigilo profissional.</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
