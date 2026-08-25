"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { mockImages } from "@/lib/mock/images";
import {
  Camera,
  ShieldCheck,
  Award,
  Users,
  Send,
  CheckCircle2,
  FileSearch,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export default function VendaSeuImovelPage() {
  const [formData, setFormData] = useState({
    ownerName: "",
    phone: "",
    email: "",
    propertyType: "apartamento",
    cityState: "Porto Belo - SC",
    neighborhood: "",
    estimatedPrice: "",
    area: "",
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <main className="py-8 md:py-16">
      <Container>
        {/* Trilha de Navegação */}
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Venda seu Imóvel" },
          ]}
        />

        {/* Hero de Captação */}
        <section className="mb-16 md:mb-24 mt-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold">
                Captação Seletiva de Ativos
              </p>
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-mineral font-normal tracking-tight leading-tight">
                Anuncie seu patrimônio com a sofisticação que ele merece.
              </h1>
              <p className="text-base md:text-lg text-graphite/80 leading-relaxed">
                Conectamos imóveis singulares e propriedades rurais de alta rentabilidade a investidores
                e compradores qualificados, com máxima discrição e assessoria jurídica integral.
              </p>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-md bg-areia/40">
                <Image
                  src={mockImages.livingRoom3}
                  alt="Living de alto padrão representando a curadoria da MONARQ"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Por que vender com a MONARQ */}
        <section className="mb-20 md:mb-28 border-t border-areia/40 pt-16">
          <div className="max-w-2xl mb-12">
            <p className="text-xs uppercase tracking-[0.15em] text-terracota font-semibold mb-2">
              Diferenciais de Mercado
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-mineral">
              Como valorizamos o seu imóvel
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-sm border border-areia/60 bg-white p-6 shadow-xs">
              <div className="mb-4 inline-flex rounded-xs bg-offwhite p-3 text-mineral border border-areia/40">
                <Camera className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg text-graphite font-medium mb-2">
                Produção Audiovisual
              </h3>
              <p className="text-xs text-graphite/70 leading-relaxed">
                Fotografia arquitetônica de alta resolução, vídeos cinematográficos e filmagens com drone em fazendas e coberturas.
              </p>
            </div>

            <div className="rounded-sm border border-areia/60 bg-white p-6 shadow-xs">
              <div className="mb-4 inline-flex rounded-xs bg-offwhite p-3 text-mineral border border-areia/40">
                <FileSearch className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg text-graphite font-medium mb-2">
                Auditoria Documental
              </h3>
              <p className="text-xs text-graphite/70 leading-relaxed">
                Revisão minuciosa de certidões, matrículas e regularizações para acelerar o fechamento do negócio com segurança jurídica.
              </p>
            </div>

            <div className="rounded-sm border border-areia/60 bg-white p-6 shadow-xs">
              <div className="mb-4 inline-flex rounded-xs bg-offwhite p-3 text-mineral border border-areia/40">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg text-graphite font-medium mb-2">
                Compradores Qualificados
              </h3>
              <p className="text-xs text-graphite/70 leading-relaxed">
                Filtro financeiro rigoroso para evitar visitas desnecessárias e apresentar seu imóvel apenas a quem tem real poder de compra.
              </p>
            </div>

            <div className="rounded-sm border border-areia/60 bg-white p-6 shadow-xs">
              <div className="mb-4 inline-flex rounded-xs bg-offwhite p-3 text-mineral border border-areia/40">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg text-graphite font-medium mb-2">
                Venda Discreta (Off-Market)
              </h3>
              <p className="text-xs text-graphite/70 leading-relaxed">
                Possibilidade de negociação sigilosa sem exposição pública na internet para proprietários que prezam por privacidade.
              </p>
            </div>
          </div>
        </section>

        {/* Formulário de Cadastro do Imóvel */}
        <section className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs uppercase tracking-[0.15em] text-terracota font-semibold">
              Cadastro de Imóvel
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-mineral font-normal">
              Cadastre seu imóvel para avaliação preliminar
            </h2>
            <p className="text-sm text-graphite/70 leading-relaxed">
              Preencha os dados básicos do imóvel. Nossa equipe fará um estudo mercadológico comparativo
              e entrará em contato para agendar uma visita técnica ou reunião.
            </p>

            <div className="rounded-xs bg-mineral/5 p-5 border border-mineral/15 text-xs text-graphite/80 space-y-2">
              <p className="font-semibold text-graphite">Sem compromisso inicial:</p>
              <p>
                O envio do cadastro não vincula nenhum contrato de exclusividade imediato. Avaliaremos o perfil
                do imóvel para apresentar a melhor estratégia comercial.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-sm border border-areia/60 bg-white p-6 md:p-8 shadow-xs">
              {submitted ? (
                <div className="rounded-xs bg-mineral/5 p-8 text-center border border-mineral/20 py-12">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-mineral mb-3" />
                  <h4 className="font-display text-xl text-graphite font-semibold">
                    Cadastro Enviado com Sucesso!
                  </h4>
                  <p className="mt-2 text-sm text-graphite/70 max-w-md mx-auto">
                    Recebemos os dados do seu imóvel. Um consultor especialista na sua região entrará em contato em breve para os próximos passos.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        ownerName: "",
                        phone: "",
                        email: "",
                        propertyType: "apartamento",
                        cityState: "Porto Belo - SC",
                        neighborhood: "",
                        estimatedPrice: "",
                        area: "",
                        details: "",
                      });
                    }}
                    className="mt-6 inline-flex rounded-xs bg-mineral px-5 py-2 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors"
                  >
                    Cadastrar Outro Imóvel
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-display text-xl text-graphite font-medium mb-4">
                    Dados do Proprietário &amp; Imóvel
                  </h3>

                  <div>
                    <label htmlFor="owner-name" className="block text-xs font-medium text-graphite mb-1">
                      Seu nome completo *
                    </label>
                    <input
                      id="owner-name"
                      type="text"
                      required
                      placeholder="Ex: Carlos Eduardo"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3.5 py-2.5 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="owner-phone" className="block text-xs font-medium text-graphite mb-1">
                        Telefone / WhatsApp *
                      </label>
                      <input
                        id="owner-phone"
                        type="tel"
                        required
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3.5 py-2.5 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="owner-email" className="block text-xs font-medium text-graphite mb-1">
                        E-mail *
                      </label>
                      <input
                        id="owner-email"
                        type="email"
                        required
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3.5 py-2.5 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="prop-type" className="block text-xs font-medium text-graphite mb-1">
                        Tipo de Imóvel *
                      </label>
                      <select
                        id="prop-type"
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3.5 py-2.5 text-xs text-graphite transition-colors focus:border-mineral focus:bg-white cursor-pointer"
                      >
                        <option value="apartamento">Apartamento / Studio</option>
                        <option value="cobertura">Cobertura</option>
                        <option value="casa-condominio">Casa em Condomínio Fechado</option>
                        <option value="casa-rua">Casa Urbana</option>
                        <option value="terreno">Terreno / Lote</option>
                        <option value="fazenda">Fazenda / Propriedade Rural</option>
                        <option value="empreendimento">Empreendimento / Incorporação</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="prop-city" className="block text-xs font-medium text-graphite mb-1">
                        Cidade / Região *
                      </label>
                      <select
                        id="prop-city"
                        value={formData.cityState}
                        onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                        className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3.5 py-2.5 text-xs text-graphite transition-colors focus:border-mineral focus:bg-white cursor-pointer"
                      >
                        <option value="Porto Belo - SC">Porto Belo - SC</option>
                        <option value="Itapema - SC">Itapema - SC</option>
                        <option value="Balneário Camboriú - SC">Balneário Camboriú - SC</option>
                        <option value="Campo Grande - MS">Campo Grande - MS</option>
                        <option value="Mato Grosso do Sul (Rural)">Mato Grosso do Sul (Rural)</option>
                        <option value="Mato Grosso (Rural)">Mato Grosso (Rural)</option>
                        <option value="Outra localidade">Outra localidade</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="prop-area" className="block text-xs font-medium text-graphite mb-1">
                        Área aproximada (m² ou hectares)
                      </label>
                      <input
                        id="prop-area"
                        type="text"
                        placeholder="Ex: 140 m² ou 1.200 ha"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3.5 py-2.5 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="prop-price" className="block text-xs font-medium text-graphite mb-1">
                        Expectativa de Valor (R$)
                      </label>
                      <input
                        id="prop-price"
                        type="text"
                        placeholder="Ex: 1.500.000"
                        value={formData.estimatedPrice}
                        onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
                        className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3.5 py-2.5 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="prop-details" className="block text-xs font-medium text-graphite mb-1">
                      Bairro, endereço ou detalhes relevantes
                    </label>
                    <textarea
                      id="prop-details"
                      rows={3}
                      placeholder="Ex: Edifício frente-mar, 3 suítes, totalmente mobiliado..."
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3.5 py-2.5 text-xs text-graphite placeholder:text-graphite/40 transition-colors focus:border-mineral focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="focus-ring group flex w-full items-center justify-center gap-2 rounded-xs bg-mineral px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-offwhite transition-colors hover:bg-mineral-light disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? "Enviando Proposta..." : "Solicitar Avaliação & Anúncio"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
