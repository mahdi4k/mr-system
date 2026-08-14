import type { postsMO } from "../../_components/articleSection/ArticleSection";
import {
  getPublishedArticleCategories,
  getPublishedArticlePage,
} from "../../_features/articles/data";
import { createClient } from "../../_lib/supabase/server";
import { notFound } from "next/navigation";
import PageClient from "./category/[[...slug]]/page.client";

interface ArticleListingProps {
  category?: string;
  page: number;
}

export default async function ArticleListing({
  category,
  page,
}: ArticleListingProps) {
  const supabase = await createClient();
  const [articlePage, categories] = await Promise.all([
    getPublishedArticlePage(supabase, { category, page, pageSize: 10 }),
    getPublishedArticleCategories(supabase),
  ]);
  if (articlePage.totalPages > 0 && page > articlePage.totalPages) notFound();

  return (
    <PageClient
      category={category}
      categories={categories}
      page={articlePage.page}
      posts={articlePage.articles as postsMO[]}
      totalPages={articlePage.totalPages}
    />
  );
}
