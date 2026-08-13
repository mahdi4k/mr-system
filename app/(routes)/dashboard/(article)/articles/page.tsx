import { createClient } from "../../../../_lib/supabase/server";
import type { ArticleStatus } from "../../../../types/database.types";
import type { Metadata } from "next";
import ArticlesClient from "./ArticlesClient";

export const metadata: Metadata = {
  title: "مدیریت مقالات | ریگورا",
};

export interface DashboardArticle {
  category_name: string;
  created_at: string;
  excerpt: string;
  featured_image_path: string | null;
  featured_image_url: string | null;
  id: string;
  published_at: string | null;
  slug: string;
  status: ArticleStatus;
  title: string;
}

export default async function ArticlesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, title, slug, excerpt, category_name, featured_image_url, featured_image_path, status, published_at, created_at",
    )
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return <ArticlesClient initialArticles={data ?? []} />;
}
