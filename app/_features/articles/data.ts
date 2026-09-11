import type { SupabaseClient } from "@supabase/supabase-js";
import sanitizeHtml from "sanitize-html";
import type { Database } from "../../types/database.types";
import type {
  ArticleSitemapRow,
  PublicArticle,
  PublicArticleCategory,
  PublicArticlePage,
} from "./types";

const ARTICLE_BATCH_SIZE = 500;

export function getArticleRange(
  page: number,
  pageSize: number,
): { from: number; to: number } {
  const from = (page - 1) * pageSize;
  return { from, to: from + pageSize - 1 };
}

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
      a: ["href", "target", "rel", "class", "id", "style"],
      h2: ["style", "class", "id"],
      h3: ["style", "class", "id"],
      h4: ["style", "class", "id"],
      p: ["style", "class", "id"],
      img: [
        "src",
        "srcset",
        "alt",
        "title",
        "width",
        "height",
        "loading",
        "sizes",
        "class",
        "id",
        "style",
      ],
      figure: ["class", "id", "style"],
      figcaption: ["class", "id", "style"],
      div: ["class", "id", "style"],
      span: ["class", "id", "style"],
      table: ["class", "id", "style"],
      thead: ["class", "id", "style"],
      tbody: ["class", "id", "style"],
      tr: ["class", "id", "style"],
      th: ["class", "id", "style", "colspan", "rowspan"],
      td: ["class", "id", "style", "colspan", "rowspan"],
      ul: ["class", "id", "style"],
      ol: ["class", "id", "style"],
      li: ["class", "id", "style"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel", "data"],
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
      "img",
      "figure",
      "figcaption",
      "div",
      "span",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
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

export async function getPublishedArticlePage(
  client: SupabaseClient<Database>,
  options: { category?: string; page: number; pageSize?: number },
): Promise<PublicArticlePage> {
  const page = Math.max(Math.trunc(options.page) || 1, 1);
  const pageSize = Math.min(Math.max(options.pageSize ?? 10, 1), 24);
  const { from, to } = getArticleRange(page, pageSize);
  let query = client
    .from("articles")
    .select(
      "id, title, slug, excerpt, featured_image_url, published_at, created_at",
      { count: "exact" },
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("id", { ascending: false })
    .range(from, to);

  if (options.category) query = query.eq("category_slug", options.category);
  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  const articles = (data ?? []).map((article) => ({
    id: article.id,
    slug: article.slug,
    date: article.published_at || article.created_at,
    title: { rendered: article.title },
    excerpt: { rendered: `<p>${escapeHtml(article.excerpt)}</p>` },
    content: { rendered: "" },
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
  const total = count ?? 0;
  return {
    articles,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPublishedArticleCategories(
  client: SupabaseClient<Database>,
): Promise<PublicArticleCategory[]> {
  const categories = new Map<string, PublicArticleCategory>();
  for (let from = 0; ; from += ARTICLE_BATCH_SIZE) {
    const { data, error } = await client
      .from("articles")
      .select("category_name, category_slug")
      .eq("status", "published")
      .order("category_slug")
      .range(from, from + ARTICLE_BATCH_SIZE - 1);
    if (error) throw new Error(error.message);
    for (const item of data ?? []) {
      categories.set(item.category_slug, {
        id: item.category_slug,
        name: item.category_name,
        slug: item.category_slug,
      });
    }
    if ((data ?? []).length < ARTICLE_BATCH_SIZE) break;
  }
  return Array.from(categories.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "fa"),
  );
}

export async function getArticleSitemapRows(
  client: SupabaseClient<Database>,
): Promise<ArticleSitemapRow[]> {
  const rows: ArticleSitemapRow[] = [];
  for (let from = 0; ; from += ARTICLE_BATCH_SIZE) {
    const { data, error } = await client
      .from("articles")
      .select("slug, updated_at")
      .eq("status", "published")
      .order("updated_at", { ascending: false })
      .range(from, from + ARTICLE_BATCH_SIZE - 1);
    if (error) throw new Error(error.message);
    rows.push(
      ...(data ?? []).map((article) => ({
        slug: article.slug,
        updatedAt: article.updated_at,
      })),
    );
    if ((data ?? []).length < ARTICLE_BATCH_SIZE) break;
  }
  return rows;
}
