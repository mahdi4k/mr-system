import type { Metadata } from "next";
import ArticleListing from "./ArticleListing";

export const metadata: Metadata = {
  title: "مقالات ریگورا",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const requestedPage = Number((await searchParams).page);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  return <ArticleListing page={page} />;
}
