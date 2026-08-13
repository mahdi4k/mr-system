import type { SupabaseClient } from "@supabase/supabase-js";
import sanitizeHtml from "sanitize-html";
import type { Database } from "../../types/database.types";
import type { PublicArticle } from "./types";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function textToHtml(value: string): string {
  return value
    .trim()
    .split(/\n{2,}/)
    .map(
      (paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`,
    )
    .join("");
}

export function renderArticleContent(value: string): string {
  const html = /<\/?[a-z][\s\S]*>/i.test(value) ? value : textToHtml(value);

  return sanitizeHtml(html, {
    allowedAttributes: {
      a: ["href", "target", "rel"],
      h2: ["style"],
      h3: ["style"],
      h4: ["style"],
      p: ["style"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedStyles: {
      "*": {
        "text-align": [/^(left|right|center|justify)$/],
      },
    },
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "s",
      "code",
      "pre",
      "blockquote",
      "hr",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "a",
    ],
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: "a",
        attribs: {
          ...attribs,
          rel: "noopener noreferrer",
        },
      }),
    },
  });
}

export async function getPublishedArticles(
  client: SupabaseClient<Database>,
  filters: { category?: string; slug?: string; limit?: number } = {},
): Promise<PublicArticle[]> {
  let query = client
    .from("articles")
    .select(
      "id, title, slug, excerpt, content, featured_image_url, published_at, created_at",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (filters.category) query = query.eq("category_slug", filters.category);
  if (filters.slug) query = query.eq("slug", filters.slug);
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map((article) => ({
    id: article.id,
    slug: article.slug,
    date: article.published_at || article.created_at,
    title: { rendered: article.title },
    excerpt: { rendered: `<p>${escapeHtml(article.excerpt)}</p>` },
    content: { rendered: renderArticleContent(article.content) },
    _embedded: {
      "wp:featuredmedia": [
        {
          id: 0,
          link: article.featured_image_url || "/svg/article.svg",
          mime_type: "image/webp",
        },
      ],
    },
  }));
}
