import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { mockBlogPosts } from "@/lib/mock/posts";
import { mockImages } from "@/lib/mock/images";
import type { BlogPost } from "@/types";

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) {
    return mockBlogPosts;
  }

  try {
    const supabase = createBrowserSupabaseClient();
    const { data: postRows, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error || !postRows || postRows.length === 0) {
      return mockBlogPosts;
    }

    const { data: categoryRows } = await supabase.from("blog_categories").select("*");
    const categoryMap = new Map((categoryRows || []).map((c) => [c.id, c.name]));

    return postRows.map((row) => ({
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt || "",
      category: (row.category_id ? categoryMap.get(row.category_id) : undefined) || "Mercado imobiliário",
      coverImage: {
        url: row.cover_image_url || mockImages.urbanBuilding1,
        alt: row.cover_image_alt || row.title,
      },
      publishedAt: row.published_at || row.created_at,
      content: row.content || undefined,
    }));
  } catch (err) {
    console.error("Erro ao buscar artigos do Supabase:", err);
    return mockBlogPosts;
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (!isSupabaseConfigured()) {
    return mockBlogPosts.find((p) => p.slug === slug);
  }

  try {
    const supabase = createBrowserSupabaseClient();
    const { data: row, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !row) {
      return mockBlogPosts.find((p) => p.slug === slug);
    }

    let categoryName = "Mercado imobiliário";
    if (row.category_id) {
      const { data: category } = await supabase
        .from("blog_categories")
        .select("name")
        .eq("id", row.category_id)
        .maybeSingle();
      if (category?.name) categoryName = category.name;
    }

    return {
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt || "",
      category: categoryName,
      coverImage: {
        url: row.cover_image_url || mockImages.urbanBuilding1,
        alt: row.cover_image_alt || row.title,
      },
      publishedAt: row.published_at || row.created_at,
      content: row.content || undefined,
    };
  } catch (err) {
    console.error("Erro ao buscar artigo por slug no Supabase:", err);
    return mockBlogPosts.find((p) => p.slug === slug);
  }
}
