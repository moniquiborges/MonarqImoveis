"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ExternalLink, Trash2, Edit2, X, Calendar, Search } from "lucide-react";
import { ImageUpload, type ImageData } from "@/components/admin/ImageUpload";
import { mockImages } from "@/lib/mock/images";
import {
  createBlogPost,
  deleteBlogPost,
  updateBlogPost,
  type BlogCategoryOption,
  type BlogPostListItem,
} from "./actions";

interface BlogViewProps {
  initialPosts: BlogPostListItem[];
  categories: BlogCategoryOption[];
  initialError: string | null;
}

const emptyForm = (defaultCategoryId: string) => ({
  title: "",
  categoryId: defaultCategoryId,
  excerpt: "",
  content: "",
  coverImage: { url: mockImages.urbanBuilding1, alt: "Imagem de Capa da Notícia" } as ImageData,
  status: "published" as "draft" | "published",
});

const statusLabel: Record<string, string> = {
  published: "Publicado",
  draft: "Rascunho",
  archived: "Arquivado",
};

const statusColor: Record<string, string> = {
  published: "text-emerald-700 bg-emerald-50 border-emerald-200",
  draft: "text-amber-700 bg-amber-50 border-amber-200",
  archived: "text-graphite/60 bg-offwhite border-areia/60",
};

export function BlogView({ initialPosts, categories, initialError }: BlogViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [formData, setFormData] = useState(emptyForm(categories[0]?.id ?? ""));

  const filteredPosts = initialPosts.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(emptyForm(categories[0]?.id ?? ""));
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPostListItem) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      categoryId: post.categoryId || categories[0]?.id || "",
      excerpt: post.excerpt,
      content: post.content,
      coverImage: {
        url: post.coverImageUrl || mockImages.urbanBuilding1,
        alt: post.coverImageAlt || post.title,
      },
      status: post.status === "draft" ? "draft" : "published",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const input = {
      title: formData.title,
      categoryId: formData.categoryId,
      excerpt: formData.excerpt,
      content: formData.content,
      coverImageUrl: formData.coverImage.url,
      coverImageAlt: formData.coverImage.alt || formData.title,
      status: formData.status,
    };

    const result = editingId ? await updateBlogPost(editingId, input) : await createBlogPost(input);

    setIsSubmitting(false);
    if (result.success) {
      setModalOpen(false);
      router.refresh();
    } else {
      setFormError(result.error ?? "Não foi possível salvar o artigo.");
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Deseja remover o artigo "${title}"?`)) return;

    setActionError(null);
    startTransition(async () => {
      const result = await deleteBlogPost(id);
      if (result.success) {
        router.refresh();
      } else {
        setActionError(result.error ?? "Não foi possível excluir o artigo.");
      }
    });
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
          onClick={handleOpenCreate}
          disabled={categories.length === 0}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xs bg-mineral px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          Novo Artigo
        </button>
      </div>

      {initialError && (
        <div className="rounded-xs border border-rose-300 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {initialError}
        </div>
      )}
      {actionError && (
        <div className="rounded-xs border border-rose-300 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {actionError}
        </div>
      )}

      {/* Busca */}
      <div className="flex items-center justify-between bg-white p-4 rounded-sm border border-areia/60 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-graphite/40" />
          <input
            type="text"
            placeholder="Buscar por título ou categoria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 pl-9 pr-3 py-2 text-xs text-graphite placeholder:text-graphite/40"
          />
        </div>
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
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-offwhite/30 transition-colors">
                    <td className="p-4 font-medium text-graphite">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-14 overflow-hidden rounded-xs bg-areia/40 shrink-0 border border-areia/60">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.coverImageUrl || mockImages.urbanBuilding1}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="line-clamp-1 max-w-md font-semibold text-graphite">
                          {post.title}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block bg-areia/40 text-graphite/80 px-2 py-0.5 rounded-xs text-[11px] font-medium">
                        {post.categoryName}
                      </span>
                    </td>
                    <td className="p-4 text-graphite/60 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("pt-BR")
                          : "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-xs border ${
                          statusColor[post.status] ?? statusColor.draft
                        }`}
                      >
                        {statusLabel[post.status] ?? post.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(post)}
                          title="Editar Artigo"
                          className="rounded-xs p-1.5 text-graphite/60 hover:bg-areia/50 hover:text-mineral transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/conteudo/${post.slug}`}
                          target="_blank"
                          className="rounded-xs p-1.5 text-graphite/60 hover:bg-areia/40 hover:text-mineral transition-colors"
                          title="Ver no site"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={isPending}
                          className="rounded-xs p-1.5 text-graphite/60 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-40"
                          title="Remover"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-graphite/50 text-xs">
                    Nenhum artigo encontrado.
                  </td>
                </tr>
              )}
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
          <div className="relative w-full max-w-2xl rounded-sm bg-white p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-areia/40 pb-4 mb-6">
              <div>
                <h3 className="font-display text-xl text-graphite font-medium">
                  {editingId ? "Editar Artigo" : "Novo Artigo"}
                </h3>
                <p className="text-xs text-graphite/60">Publique um artigo de análise ou notícia.</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1.5 text-graphite/50 hover:bg-offwhite hover:text-graphite transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {formError && (
                <div className="rounded-xs border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Título da Publicação *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Tendências de valorização em Porto Belo para 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite"
                />
              </div>

              {/* Upload de Imagem de Capa do Artigo */}
              <ImageUpload
                label="Imagem de Capa do Artigo"
                helperText="Selecione uma imagem ilustrativa para a matéria."
                category="blog"
                coverImage={formData.coverImage}
                onCoverChange={(img) => setFormData({ ...formData, coverImage: img })}
                allowGallery={false}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Categoria *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-graphite mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as "draft" | "published" })
                    }
                    className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite cursor-pointer"
                  >
                    <option value="published">Publicado</option>
                    <option value="draft">Rascunho</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Resumo / Linha Fina *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Breve resumo para os cards e pré-visualizações..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-graphite mb-1">
                  Corpo do Artigo
                </label>
                <p className="text-[11px] text-graphite/50 mb-1.5">
                  Separe os parágrafos com uma linha em branco. Deixe vazio para usar o texto de
                  demonstração padrão.
                </p>
                <textarea
                  rows={10}
                  placeholder="Escreva o conteúdo completo do artigo aqui..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="focus-ring w-full rounded-xs border border-areia/70 bg-offwhite/30 px-3 py-2 text-xs text-graphite resize-y font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-areia/40">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xs border border-areia/60 px-4 py-2 text-xs font-medium text-graphite hover:bg-offwhite transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xs bg-mineral px-5 py-2 text-xs font-semibold uppercase tracking-wider text-offwhite hover:bg-mineral-light transition-colors cursor-pointer shadow-xs disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Salvando…"
                    : editingId
                    ? "Atualizar Artigo"
                    : "Publicar Artigo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
