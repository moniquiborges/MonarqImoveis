"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Newspaper, Plus, Search, ExternalLink, Trash2, X, Calendar } from "lucide-react";
import { mockBlogPosts } from "@/lib/mock/posts";
import type { BlogPost } from "@/types";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [newPost, setNewPost] = useState({
    title: "",
    category: "Mercado imobiliário",
    excerpt: "",
  });

  const filteredPosts = posts.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newPost.title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");

    const created: BlogPost = {
      slug,
      title: newPost.title,
      category: newPost.category,
      excerpt: newPost.excerpt,
      coverImage: {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        alt: newPost.title,
      },
      publishedAt: new Date().toISOString().split("T")[0],
    };

    setPosts([created, ...posts]);
    setModalOpen(false);
    setNewPost({
      title: "",
      category: "Mercado imobiliário",
      excerpt: "",
    });
  };

  const handleDelete = (slug: string) => {
    if (confirm("Deseja remover este artigo?")) {
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-terracota font-semibold">
            Hub de Conteúdo
          </span>
          <h1 className="font-display text-2xl md:text-3xl text-graphite font-normal">
            Artigos &amp; Notícias
          </h1>
          <p className="text-xs md:text-sm text-graphite/60 mt-0.5">
            Gerenciamento das publicações editoriais e análises de mercado.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xs bg-mineral px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Novo Artigo
        </button>
      </div>

      {/* Tabela de Artigos */}
      <div className="rounded-sm border border-areia/60 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-graphite">
            <thead>
              <tr className="border-b border-areia/40 bg-offwhite/50 text-graphite/60 uppercase tracking-wider text-[11px]">
                <th className="p-4 font-semibold">Artigo / Título</th>
                <th className="p-4 font-semibold">Categoria</th>
                <th className="p-4 font-semibold">Data de Publicação</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-areia/30">
              {filteredPosts.map((post) => (
                <tr key={post.slug} className="hover:bg-offwhite/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 overflow-hidden rounded-xs bg-areia/40 shrink-0">
                        <Image
                          src={post.coverImage.url}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-graphite text-sm">{post.title}</div>
                        <p className="text-[11px] text-graphite/50 line-clamp-1 max-w-md">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="rounded-xs bg-mineral/10 px-2 py-0.5 text-[11px] font-semibold text-mineral">
                      {post.category}
                    </span>
                  </td>
                  <td className="p-4 text-graphite/60">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-graphite/40" />
                      <span>{post.publishedAt}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Publicado
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/conteudo/${post.slug}`}
                        target="_blank"
                        className="rounded-xs p-1.5 text-graphite/60 hover:bg-areia/40 hover:text-mineral transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.slug)}
                        className="rounded-xs p-1.5 text-graphite/60 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/60 backdrop-blur-xs p-4 animate-fade-in"
        >
          <div className="relative w-full max-w-xl rounded-sm bg-white p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-areia/40 pb-4 mb-6">
              <div>
                <h3 className="font-display text-xl text-graphite font-medium">Novo Artigo</h3>
                <p className="text-xs text-graphite/60">Publique um artigo de análise ou notícia.</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1 text-graphite/50 hover:bg-offwhite hover:text-graphite transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Título da Publicação *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Tendências de valorização em Porto Belo para 2026"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-graphite mb-1">Categoria *</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                >
                  <option value="Mercado imobiliário">Mercado imobiliário</option>
                  <option value="Campo Grande">Campo Grande</option>
                  <option value="Mercado rural">Mercado rural</option>
                  <option value="Investimentos">Investimentos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Resumo / Linha Fina *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Breve resumo para os cards e pré-visualizações..."
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-areia/40">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xs border border-areia/60 px-4 py-2 text-xs font-medium text-graphite hover:bg-offwhite transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xs bg-mineral px-5 py-2 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors"
                >
                  Publicar Artigo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
