import type { Metadata } from "next";
import { getSiteUrl } from "@/_utils/siteUrl";
import ArticleListing from "./ArticleListing";

const url = `${getSiteUrl()}/blog`;

export const metadata: Metadata = {
  title: "مقالات ریگورا",
  alternates: { canonical: url },
  openGraph: { url, siteName: "ریگورا" },
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
