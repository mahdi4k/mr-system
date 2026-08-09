import ClientPage from "./clientPage";
import {
  getCase,
  getCpu,
  getFan,
  getGraphic,
  getMotherboard,
  getPower,
  getRam,
  getSsd,
} from "@/_data/productCatalog";
import { fetchTorobProduct } from "@/_utils/torobProduct";

type ProductPart =
  | "graphics"
  | "powers"
  | "motherboards"
  | "cpus"
  | "cases"
  | "rams"
  | "fans"
  | "ssds";

async function getData(params: { part: ProductPart; id: string }) {
  let product = null;

  switch (params.part) {
    case "cpus":
      product = getCpu(params.id);
      break;
    case "graphics":
      product = getGraphic(params.id);
      break;
    case "motherboards":
      product = getMotherboard(params.id);
      break;
    case "powers":
      product = getPower(params.id);
      break;
    case "cases":
      product = getCase(params.id);
      break;
    case "fans":
      product = getFan(params.id);
      break;
    case "rams":
      product = getRam(params.id);
      break;
    case "ssds":
      product = getSsd(params.id);
      break;
  }

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.torobUrl) {
    try {
      const torobProduct = await fetchTorobProduct(product.torobUrl);
      product = {
        ...product,
        image: torobProduct.image ?? product.image,
        price:
          torobProduct.price == null
            ? product.price
            : String(torobProduct.price),
        links: torobProduct.url,
      };
    } catch {
      // Keep catalog data available if Torob is temporarily unreachable.
    }
  }

  return { data: product };
}
export async function generateMetadata(props: {
  params: Promise<{ part: ProductPart; id: string }>;
}) {
  const params = await props.params;
  const product = await getData(params);

  return {
    title: ` ${product.data.name} - کیوی پارت`,
  };
}
export default async function Page(props: {
  params: Promise<{ part: ProductPart; id: string }>;
}) {
  const params = await props.params;
  const { data } = await getData(params);
  return (
    <main style={{ flex: "1" }}>
      <ClientPage product={data} type={params.part} />
    </main>
  );
}
