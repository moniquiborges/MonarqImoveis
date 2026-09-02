import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { mockBlogPosts } from "@/lib/mock/posts";
import { fetchBlogPosts, fetchBlogPostBySlug } from "@/lib/services/blogService";
import { Calendar, Clock, ArrowLeft, UserCheck, Sparkles } from "lucide-react";

import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

export function generateStaticParams() {
  return mockBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: `${post.title} | MONARQ Insights`,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      images: [
        {
          url: post.coverImage.url,
          alt: post.coverImage.alt || post.title,
        },
      ],
    },
  };
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await fetchBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug);

  const bodyParagraphs = post.content
    ? post.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : null;

  return (
    <main className="py-8 md:py-16">
      <Container>
        {/* Trilha de Navegação */}
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Conteúdo", href: "/conteudo" },
            { label: post.category, href: "/conteudo" },
            { label: post.title },
          ]}
        />

        {/* Artigo Centralizado em Formato Editorial */}
        <article className="mx-auto max-w-3xl mt-4">
          {/* Categoria e Metadados */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-xs bg-mineral/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-mineral">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-graphite/60">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </div>
            <span className="text-xs text-graphite/40">&bull;</span>
            <div className="flex items-center gap-1.5 text-xs text-graphite/60">
              <Clock className="h-3.5 w-3.5" />
              <span>4 min de leitura</span>
            </div>
          </div>

          {/* Título e Subtítulo */}
          <h1 className="font-display text-3xl md:text-5xl text-graphite font-normal tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="mt-4 text-base md:text-xl text-graphite/70 font-light leading-relaxed">
            {post.excerpt}
          </p>

          {/* Autor */}
          <div className="mt-6 flex items-center justify-between border-y border-areia/40 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-mineral/10 p-2 text-mineral">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="font-medium text-xs md:text-sm text-graphite block">
                  Inteligência Imobiliária MONARQ
                </span>
                <span className="text-[11px] text-graphite/50 block">
                  Curadoria &amp; Análise de Mercado
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-graphite/60">
              <Sparkles className="h-4 w-4 text-terracota" />
              <span>Conteúdo Exclusivo</span>
            </div>
          </div>

          {/* Imagem de Capa */}
          <div className="relative my-8 aspect-[16/9] overflow-hidden rounded-sm bg-areia/30 shadow-md">
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt}
              fill
              priority
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
            />
          </div>

          {/* Corpo do Artigo */}
          <div className="prose prose-stone max-w-none text-graphite/80 leading-relaxed space-y-6 text-base md:text-lg">
            {bodyParagraphs ? (
              bodyParagraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)
            ) : (
              <>
                <p>
                  O mercado imobiliário de alto padrão no Brasil vem passando por transformações profundas impulsionadas pela busca por segurança patrimonial, qualidade de vida e liquidez estratégica. Regiões com vocação turística consolidada ou forte tração do agronegócio continuam liderando os índices de valorização real acima da inflação.
                </p>

                <h2 className="font-display text-2xl md:text-3xl text-graphite font-medium pt-4">
                  Fundamentos de Valorização e Vetores de Expansão
                </h2>

                <p>
                  Ao analisar o comportamento dos compradores nos últimos trimestres, observa-se uma preferência nítida por imóveis com projeto arquitetônico autoral, plantas inteligentes e empreendimentos respaldados por incorporadoras consolidadas e compliance jurídico impecável.
                </p>

                <blockquote className="my-8 border-y border-areia/60 py-6 text-center text-xl md:text-2xl font-display italic text-mineral font-normal leading-snug">
                  &ldquo;Investir em imóveis não é apenas adquirir metros quadrados; é posicionar capital em ativos resilientes capazes de atravessar ciclos econômicos com valorização consistente.&rdquo;
                </blockquote>

                <h2 className="font-display text-2xl md:text-3xl text-graphite font-medium pt-4">
                  Diretrizes para o Investidor Consciente
                </h2>

                <p>
                  Antes de aportar recursos em novos lançamentos ou áreas rurais, é indispensável a realização de um estudo detalhado de viabilidade, conferência da matrícula imobiliária, análise de custo de oportunidade e clareza sobre o horizonte de retorno pretendido (seja via renda de locação, valorização de capital ou expansão operacional).
                </p>

                <p>
                  A equipe da MONARQ permanece à disposição para conduzir reuniões consultivas individuais, apresentando estudos de mercado customizados para cada perfil de investidor.
                </p>
              </>
            )}
          </div>

          {/* Box de CTA Consultivo */}
          <div className="mt-12 rounded-sm bg-mineral p-8 text-offwhite text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-medium text-areia">
                Deseja aprofundar esta análise para o seu patrimônio?
              </h3>
              <p className="mt-1 text-xs md:text-sm text-offwhite/80">
                Agende uma conversa reservada com nossos diretores de investimento.
              </p>
            </div>
            <ButtonLink href="/contato" variant="primary" className="mt-4 sm:mt-0 shrink-0">
              Falar com Especialista
            </ButtonLink>
          </div>

          {/* Voltar */}
          <div className="mt-8 pt-6 border-t border-areia/40 flex items-center justify-between text-xs">
            <Link
              href="/conteudo"
              className="inline-flex items-center gap-1.5 font-medium text-graphite/70 hover:text-mineral transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para todos os artigos
            </Link>
          </div>
        </article>

        {/* Artigos Relacionados */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 border-t border-areia/40 pt-16">
            <div className="mb-8 max-w-xl">
              <p className="text-xs uppercase tracking-[0.15em] text-terracota font-semibold mb-1">
                Leituras Recomendadas
              </p>
              <h2 className="font-display text-2xl md:text-3xl text-graphite">
                Outros Artigos &amp; Análises
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.slice(0, 2).map((rel) => (
                <article key={rel.slug} className="group flex flex-col">
                  <Link
                    href={`/conteudo/${rel.slug}`}
                    className="relative aspect-[16/9] overflow-hidden rounded-xs bg-areia/40 block mb-4"
                  >
                    <Image
                      src={rel.coverImage.url}
                      alt={rel.coverImage.alt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </Link>
                  <div>
                    <span className="text-[11px] font-semibold text-terracota uppercase tracking-wider block mb-1">
                      {rel.category}
                    </span>
                    <Link href={`/conteudo/${rel.slug}`} className="focus-ring">
                      <h3 className="font-display text-lg text-graphite font-medium group-hover:text-mineral transition-colors line-clamp-2">
                        {rel.title}
                      </h3>
                    </Link>
                    <p className="mt-2 text-xs text-graphite/70 line-clamp-2 leading-relaxed">
                      {rel.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}
