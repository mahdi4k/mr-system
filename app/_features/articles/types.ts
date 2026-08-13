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
