import { MetadataRoute } from "next";
import { getSiteUrl } from "./_utils/siteUrl";
import {
  getArticleSitemapRows,
  getPublishedArticleCategories,
} from "./_features/articles/data";
import { createClient } from "./_lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const client = await createClient();
  const [articles, categories] = await Promise.all([
    getArticleSitemapRows(client),
    getPublishedArticleCategories(client),
  ]);

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },

    {
      url: new URL("/blog", siteUrl).toString(),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...categories.map((category) => ({
      url: new URL(`/blog/category/${category.slug}`, siteUrl).toString(),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...articles.map((article) => ({
      url: new URL(`/blog/${article.slug}`, siteUrl).toString(),
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
