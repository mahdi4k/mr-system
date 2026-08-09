import PageClient from "./page.client";
import { notFound } from "next/navigation";
import { getAdById } from "../../../_features/ads/data";
import type { Product } from "../../../_features/ads/types";
import { createClient } from "../../../_lib/supabase/server";
import { getCurrentUser } from "../../../_lib/supabase/auth";

async function getData(params: { id: string }): Promise<Product> {
  const product = await getAdById(params.id, await createClient());

  if (!product) {
    notFound();
  }

  return product;
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const product = await getData(params);
  return {
    title: ` ${product.title} - ریگورا`,
  };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getCurrentUser();
  const data = await getData(params);
  return (
    <main style={{ flex: "1" }}>
      <PageClient product={data} currentUserId={user?.id} />
    </main>
  );
}
