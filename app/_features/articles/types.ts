import type { ArticleStatus } from "../../types/database.types";

export interface ArticleInput {
  categoryName: string;
  categorySlug: string;
  content: string;
  excerpt: string;
  featuredImage: File | null;
  slug: string;
  status: ArticleStatus;
  title: string;
}

export interface ArticleEditRecord {
  categoryName: string;
  categorySlug: string;
  content: string;
  excerpt: string;
  featuredImagePath: string | null;
  featuredImageUrl: string | null;
  id: string;
  slug: string;
  status: ArticleStatus;
  title: string;
}

export interface UpdateArticleInput extends ArticleInput {
  currentFeaturedImagePath: string | null;
  removeFeaturedImage: boolean;
}

export interface PublicArticlePage {
  articles: PublicArticle[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PublicArticleCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleSitemapRow {
  slug: string;
  updatedAt: string;
}

export interface PublicArticle {
  _embedded: {
    "wp:featuredmedia": Array<{
      id: number;
      link: string;
      mime_type: string;
    }>;
  };
  content: { rendered: string };
  date: string;
  excerpt: { rendered: string };
  id: string;
  slug: string;
  title: { rendered: string };
}
