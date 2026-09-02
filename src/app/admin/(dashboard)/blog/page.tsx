import { listBlogPosts } from "./actions";
import { BlogView } from "./BlogView";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const { posts, categories, error } = await listBlogPosts();

  return <BlogView initialPosts={posts} categories={categories} initialError={error ?? null} />;
}
