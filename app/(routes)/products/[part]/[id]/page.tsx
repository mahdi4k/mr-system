import ClientPage from "./clientPage";
import {
  getMockCpu,
  getMockGraphic,
  getMockMotherboard,
  getMockPower,
} from "@/_redux/services/mockData";

async function getData(params: { part: string; id: string }) {
  let product = null;

  switch (params.part) {
    case "cpu":
      product = getMockCpu(params.id);
      break;
    case "graphic":
      product = getMockGraphic(params.id);
      break;
    case "motherboard":
      product = getMockMotherboard(params.id);
      break;
    case "power":
      product = getMockPower(params.id);
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
