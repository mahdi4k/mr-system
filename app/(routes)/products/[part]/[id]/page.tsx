import ClientPage from "./clientPage";
import {
  getCpu,
  getGraphic,
  getMotherboard,
  getPower,
} from "@/_data/productCatalog";

async function getData(params: { part: string; id: string }) {
  let product = null;

  switch (params.part) {
    case "cpu":
      product = getCpu(params.id);
      break;
    case "graphic":
      product = getGraphic(params.id);
      break;
    case "motherboard":
      product = getMotherboard(params.id);
      break;
    case "power":
      product = getPower(params.id);
      break;
  }

  if (!product) {
    throw new Error("Product not found");
  }

  return { data: product };
}
export async function generateMetadata({
  params,
}: {
  params: { part: "graphics" | "powers" | "motherboards" | "cpus"; id: string };
}) {
  const product = await getData(params);

  return {
    title: ` ${product.data.name} - کیوی پارت`,
  };
}
export default async function Page({
  params,
}: {
  params: { part: "graphics" | "powers" | "motherboards" | "cpus"; id: string };
}) {
  const { data } = await getData(params);
  return (
    <main style={{ flex: "1" }}>
      <ClientPage product={data} type={params.part} />
    </main>
  );
}
