import PageClient from "./page.client";
import { cookies } from "next/headers";
import { getMockProduct } from "@/_redux/services/mockData";
import { Product } from "@/_redux/services/adsApi";

async function getData(params: { id: string }): Promise<Product> {
  const product = getMockProduct(params.id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const product = await getData(params);
  return {
    title: ` ${product.title} - کیوی پارت`,
  };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const token = (await cookies()).get("authToken")?.value;
  const data = await getData(params);
  return (
    <main style={{ flex: "1" }}>
      <PageClient product={data} token={token} />
    </main>
  );
}
