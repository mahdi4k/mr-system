import React from "react";
import ClientPage from "./clientPage";
import { postsMO } from "@/_components/articleSection/ArticleSection";
import { mockBlogPosts } from "@/_redux/services/mockData";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  return {
    title: ` ${params.slug} - کیوی پارت`,
  };
}
async function getData(slug: string): Promise<postsMO[]> {
  const post = mockBlogPosts.find((p) => p.slug === slug);
  if (post) {
    return [post];
  }
  return mockBlogPosts;
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const post: postsMO[] = await getData(params.slug);

  return <ClientPage post={post} />;
};

export default Page;
