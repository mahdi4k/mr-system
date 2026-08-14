import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "../../../../../../_lib/supabase/server";
import ArticleForm from "../../create/ArticleForm";

export const metadata: Metadata = {
  title: "ویرایش مقاله | ریگورا",
};

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data, error } = await (await createClient())
    .from("articles")
    .select(
      "id, title, slug, excerpt, content, category_name, category_slug, featured_image_url, featured_image_path, status",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) notFound();

  return (
    <ArticleForm
      article={{
        categoryName: data.category_name,
        categorySlug: data.category_slug,
        content: data.content,
        excerpt: data.excerpt,
        featuredImagePath: data.featured_image_path,
        featuredImageUrl: data.featured_image_url,
        id: data.id,
        slug: data.slug,
        status: data.status,
        title: data.title,
      }}
    />
  );
}
