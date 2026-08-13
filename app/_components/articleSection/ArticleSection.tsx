import ArticleSectionClient from "./ArticleSection.client";
import { getPublishedArticles } from "../../_features/articles/data";
import { createClient } from "../../_lib/supabase/server";

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
  return getPublishedArticles(await createClient(), { limit: 8 });
}

const ArticleSection = async () => {
  const posts: postsMO[] = await getData();

  return <ArticleSectionClient posts={posts} />;
};

export default ArticleSection;
