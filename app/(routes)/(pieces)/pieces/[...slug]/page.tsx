import React from "react";
import PageClient from "./page.client";
import type { Metadata } from "next";
import { getPublishedArticles } from "../../../../_features/articles/data";
import { createClient } from "../../../../_lib/supabase/server";

export type SlugType = "motherboard" | "cpu" | "graphic";

export interface PiecesProps {
  params: {
    slug: SlugType[];
  };
}

export const metadata: Metadata = {
  title: "انتخاب قطعات",
  description: "",
};
const Page = async (props: { params: Promise<PiecesProps["params"]> }) => {
  const params = await props.params;
  const supabase = await createClient();
  const articleGroups = await Promise.all(
    Array.from(new Set(params.slug)).map((category) =>
      getPublishedArticles(supabase, { category, limit: 3 }),
    ),
  );
  const relatedArticles = Array.from(
    new Map(
      articleGroups.flat().map((article) => [article.id, article]),
    ).values(),
  ).slice(0, 3);

  return <PageClient params={params} relatedArticles={relatedArticles} />;
};

export default Page;
