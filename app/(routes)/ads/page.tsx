import PageClient from "./page.client";
import { postsMO } from "@/_components/articleSection/ArticleSection";
import { mockAdCategories } from "@/_redux/services/mockData";

export interface CategoryProdcut {
  id: number;
  value: string;
  name: string;
}

export async function generateMetadata() {
  return {
    title: "آگهی قطعات",
  };
}

async function getData() {
  return mockAdCategories;
}

const Page = async () => {
  const categories: CategoryProdcut[] = await getData();

  return <PageClient categories={categories} />;
};

export default Page;
