import { fetchBlogPosts } from "@/lib/services/blogService";
import { ConteudoView } from "@/components/content/ConteudoView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Conteúdo & Inteligência de Mercado | MONARQ Imóveis & Investimentos",
  description:
    "Análises, guias e tendências de mercado sobre o litoral catarinense, Campo Grande e o agronegócio.",
};

export default async function ConteudoPage() {
  const posts = await fetchBlogPosts();

  return <ConteudoView initialPosts={posts} />;
}
