import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedArticles } from "../../../_features/articles/data";
import { createClient } from "../../../_lib/supabase/server";
import ClientPage from "./clientPage";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const [article] = await getPublishedArticles(await createClient(), { slug });
  if (!article) return { title: "مقاله یافت نشد" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = new URL(`/blog/${article.slug}`, siteUrl).toString();
  const image = article._embedded["wp:featuredmedia"][0]?.link;

  return {
    title: `${article.title.rendered} | ریگورا`,
    description: article.excerpt.rendered.replace(/<[^>]*>/g, ""),
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title.rendered,
      description: article.excerpt.rendered.replace(/<[^>]*>/g, ""),
      url,
      images: image ? [{ url: new URL(image, siteUrl).toString() }] : undefined,
    },
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const articles = await getPublishedArticles(await createClient(), { slug });
  if (!articles.length) notFound();
  return <ClientPage post={articles} />;
}
