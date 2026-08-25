import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { mockBlogPosts } from "@/lib/mock/posts";

export function EditorialSection() {
  return (
    <section className="py-24">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Inteligência imobiliária"
            title="Conteúdo para decisões melhores"
            description="Análises de mercado, guias práticos e panoramas regionais assinados pela MONARQ."
          />
          <ButtonLink href="/conteudo" variant="ghost" className="shrink-0 px-0">
            Ver todo o conteúdo
          </ButtonLink>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-3">
          {mockBlogPosts.map((post) => (
            <Link key={post.slug} href={`/conteudo/${post.slug}`} className="focus-ring group flex flex-col gap-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image
                  src={post.coverImage.url}
                  alt={post.coverImage.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[12px] uppercase tracking-[0.1em] text-terracota">{post.category}</span>
                <h3 className="font-display text-lg leading-snug text-graphite">{post.title}</h3>
                <p className="text-[14px] leading-relaxed text-graphite/60">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
