import PageClient from "./page.client";
import { postsMO } from "@/_components/articleSection/ArticleSection";
import { mockAdCategories } from "@/_redux/services/mockData";
import { Suspense } from "react";
import { Loader } from "@mantine/core";

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

  return (
    <Suspense fallback={<Loader color="green" m="xl" />}>
      <PageClient categories={categories} />
    </Suspense>
  );
};

export default Page;
