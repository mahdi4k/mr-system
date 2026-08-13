import type { Metadata } from "next";
import ArticleForm from "./ArticleForm";

export const metadata: Metadata = { title: "مقاله جدید | ریگورا" };

export default function CreateArticlePage() {
  return <ArticleForm />;
}
