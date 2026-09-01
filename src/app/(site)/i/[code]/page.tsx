import { redirect, notFound } from "next/navigation";
import { resolveShortCode } from "@/lib/services/propertyService";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function ShortLinkPage({ params }: Props) {
  const { code } = await params;
  const targetUrl = await resolveShortCode(code);

  if (targetUrl) {
    redirect(targetUrl);
  }

  return (
    <main className="py-24 text-center">
      <Container>
        <span className="rounded-xs bg-mineral/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-mineral">
          Código: {code.toUpperCase()}
        </span>
        <h1 className="font-display text-3xl text-graphite mt-4 mb-2">
          Imóvel não encontrado
        </h1>
        <p className="text-sm text-graphite/60 max-w-md mx-auto mb-8">
          Não localizamos nenhum imóvel ativo com a referência <strong>{code.toUpperCase()}</strong>.
          O anúncio pode ter sido vendido ou o código digitado está incorreto.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/imoveis/campo-grande"
            className="rounded-xs bg-mineral px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors"
          >
            Imóveis Campo Grande
          </Link>
          <Link
            href="/empreendimentos"
            className="rounded-xs border border-areia/70 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-graphite hover:bg-offwhite transition-colors"
          >
            Litoral Catarinense
          </Link>
        </div>
      </Container>
    </main>
  );
}
