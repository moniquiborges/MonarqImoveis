"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/require-staff";
import type { ListingStatus } from "@/types/database";

export interface BlogPostListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  categoryName: string;
  coverImageUrl: string;
  coverImageAlt: string;
  status: ListingStatus;
  publishedAt: string | null;
}

export interface BlogCategoryOption {
  id: string;
  slug: string;
  name: string;
}

export interface ListBlogPostsResult {
  posts: BlogPostListItem[];
  categories: BlogCategoryOption[];
  error?: string;
}

export async function listBlogPosts(): Promise<ListBlogPostsResult> {
  const staff = await requireStaff();
  if (!staff) return { posts: [], categories: [], error: "Não autorizado." };

  const supabase = await createClient();

  const [postsResult, categoriesResult] = await Promise.all([
    supabase
      .from("blog_posts")
      .select(
        "id, slug, title, excerpt, content, category_id, cover_image_url, cover_image_alt, status, published_at, created_at"
      )
      .order("created_at", { ascending: false }),
    supabase.from("blog_categories").select("id, slug, name").order("name"),
  ]);

  if (postsResult.error || categoriesResult.error) {
    return {
      posts: [],
      categories: [],
      error: postsResult.error?.message ?? categoriesResult.error?.message ?? "Erro ao carregar artigos.",
    };
  }

  const categoryMap = new Map((categoriesResult.data ?? []).map((c) => [c.id, c.name]));

  const posts: BlogPostListItem[] = (postsResult.data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content ?? "",
    categoryId: row.category_id ?? "",
    categoryName: (row.category_id && categoryMap.get(row.category_id)) || "Sem categoria",
    coverImageUrl: row.cover_image_url ?? "",
    coverImageAlt: row.cover_image_alt ?? "",
    status: row.status,
    publishedAt: row.published_at ?? row.created_at,
  }));

  const categories: BlogCategoryOption[] = (categoriesResult.data ?? []).map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
  }));

  return { posts, categories };
}

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]+/g, "")
    .replace(/ +/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `artigo-${Date.now()}`;
}

export interface BlogPostFormInput {
  title: string;
  categoryId: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImageAlt: string;
  status: "draft" | "published";
}

export interface BlogPostActionResult {
  success: boolean;
  error?: string;
}

export async function createBlogPost(input: BlogPostFormInput): Promise<BlogPostActionResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  const title = input.title.trim();
  if (!title) return { success: false, error: "Informe o título do artigo." };

  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").insert({
    slug: slugify(title),
    title,
    excerpt: input.excerpt.trim() || null,
    content: input.content.trim() || null,
    category_id: input.categoryId || null,
    cover_image_url: input.coverImageUrl || null,
    cover_image_alt: input.coverImageAlt || title,
    author_id: staff.id,
    status: input.status,
    published_at: input.status === "published" ? new Date().toISOString() : null,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/conteudo");
  return { success: true };
}

export async function updateBlogPost(
  id: string,
  input: BlogPostFormInput
): Promise<BlogPostActionResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  const title = input.title.trim();
  if (!title) return { success: false, error: "Informe o título do artigo." };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("status, published_at")
    .eq("id", id)
    .maybeSingle();

  const becamePublished = input.status === "published" && existing?.status !== "published";

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      excerpt: input.excerpt.trim() || null,
      content: input.content.trim() || null,
      category_id: input.categoryId || null,
      cover_image_url: input.coverImageUrl || null,
      cover_image_alt: input.coverImageAlt || title,
      status: input.status,
      published_at: becamePublished ? new Date().toISOString() : existing?.published_at ?? null,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/conteudo");
  return { success: true };
}

export async function deleteBlogPost(id: string): Promise<BlogPostActionResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/conteudo");
  return { success: true };
}
