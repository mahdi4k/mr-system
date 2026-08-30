import ArticleSectionClient from "./ArticleSection.client";
import { getPublishedArticles } from "../../_features/articles/data";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";

function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createSupabaseClient<Database>(url, key);
}

type featuredmedia = {
  id: number;
  link: string;
  mime_type: string;
};

export type postsMO = {
  title: { rendered: string };
  excerpt: { rendered: string };
  id: string;
  date: string;
  slug: string;
  content: { rendered: string };
  _embedded: { "wp:featuredmedia": featuredmedia[] };
};

async function getData() {
  const anon = getAnonClient();
  if (!anon) return [];
  return getPublishedArticles(anon, { limit: 8 });
}

const ArticleSection = async () => {
  const posts: postsMO[] = await getData();

  return <ArticleSectionClient posts={posts} />;
};

export default ArticleSection;
