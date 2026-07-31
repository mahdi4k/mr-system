import PageClient from "./page.client";
import { postsMO } from "@/_components/articleSection/ArticleSection";
import { mockAdCategories } from "@/_redux/services/mockData";

export interface CategoryProdcut {
  id: number;
  value: string;
  name: string;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  return {
    title: "آگهی قطعات",
  };
}

async function getData(slug: string) {
  return mockAdCategories;
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const categories: CategoryProdcut[] = await getData(params.slug);

  return <PageClient categories={categories} />;
};

export default Page;
