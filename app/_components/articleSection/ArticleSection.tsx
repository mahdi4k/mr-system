import ArticleSectionClient from "./ArticleSection.client";
import { getPublishedArticles } from "../../_features/articles/data";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";

function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const fetchWithTimeout: typeof fetch = (input, init) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);
    return fetch(input as RequestInfo, {
      ...(init as RequestInit),
      signal: controller.signal,
    }).finally(() => clearTimeout(id));
  };
  return createSupabaseClient<Database>(url, key, {
    global: { fetch: fetchWithTimeout },
  });
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

async function getData(): Promise<postsMO[]> {
  try {
    const anon = getAnonClient();
    if (!anon) return [];
    return await getPublishedArticles(anon, { limit: 8 });
  } catch (error) {
    console.warn("[ArticleSection] failed to load homepage articles", error);
    return [];
  }
}

const ArticleSection = async () => {
  const posts = await getData();

  return <ArticleSectionClient posts={posts} />;
};

export default ArticleSection;
