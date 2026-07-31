import React from "react";
import { postsMO } from "@/_components/articleSection/ArticleSection";
import PageClient from "./page.client";
import { mockBlogPosts, mockBlogCategories } from "@/_redux/services/mockData";

export type categoriesMO = {
  id: string;
  slug: string;
  name: string;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  return {
    title: `  کیوی پارت - مقالات`,
  };
}
async function getPosts(slug: string, categories: categoriesMO[]) {
  const category = categories.find((c) => c.slug === slug);

  if (category) {
    return mockBlogPosts;
  }

  return mockBlogPosts;
}

async function getCategories() {
  return mockBlogCategories;
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const categories: categoriesMO[] = await getCategories();
  const posts: postsMO[] = await getPosts(
    params.slug ? params.slug[0] : "",
    categories,
  );

  return <PageClient posts={posts} categories={categories} />;
};

export default Page;
