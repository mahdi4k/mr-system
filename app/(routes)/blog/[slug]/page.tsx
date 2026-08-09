import React from "react";
import ClientPage from "./clientPage";
import { postsMO } from "@/_components/articleSection/ArticleSection";
import { mockBlogPosts } from "@/_redux/services/mockData";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
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

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const post: postsMO[] = await getData(params.slug);

  return <ClientPage post={post} />;
};

export default Page;
