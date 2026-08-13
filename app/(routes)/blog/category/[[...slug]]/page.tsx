import type { postsMO } from "../../../../_components/articleSection/ArticleSection";
import { getPublishedArticles } from "../../../../_features/articles/data";
import { createClient } from "../../../../_lib/supabase/server";
import PageClient from "./page.client";

export interface categoriesMO {
  id: string;
  name: string;
  slug: string;
}

export async function generateMetadata() {
  return { title: "مقالات ریگورا" };
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const category = params.slug?.[0];
  const supabase = await createClient();
  const [posts, categoryRows] = await Promise.all([
    getPublishedArticles(supabase, { category, limit: 50 }),
    supabase
      .from("articles")
      .select("category_name, category_slug")
      .eq("status", "published")
      .order("category_name"),
  ]);
  if (categoryRows.error) throw new Error(categoryRows.error.message);

  const categories: categoriesMO[] = Array.from(
    new Map(
      (categoryRows.data ?? []).map((item) => [
        item.category_slug,
        {
          id: item.category_slug,
          slug: item.category_slug,
          name: item.category_name,
        },
      ]),
    ).values(),
  );
  return <PageClient posts={posts as postsMO[]} categories={categories} />;
}
