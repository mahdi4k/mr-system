import "server-only";

interface TorobJsonLdProduct {
  "@type"?: string;
  name?: string;
  image?: string | string[];
  url?: string;
  offers?: {
    priceCurrency?: string;
    lowPrice?: string | number;
  };
}

export interface TorobProduct {
  title: string;
  price: number | null;
  image: string | null;
  url: string;
}

export const isAllowedTorobUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "torob.com" || url.hostname === "www.torob.com") &&
      url.pathname.startsWith("/p/")
    );
  } catch {
    return false;
  }
};

export async function fetchTorobProduct(
  productUrl: string,
): Promise<TorobProduct> {
  const response = await fetch(productUrl, {
    next: { revalidate: 86400 },
    headers: {
      Accept: "text/html",
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Torob responded with status ${response.status}`);
  }

  const html = await response.text();
  const scriptPattern =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g;
  let product: TorobJsonLdProduct | undefined;
  let script = scriptPattern.exec(html);

  while (script) {
    try {
      const data = JSON.parse(script[1]) as TorobJsonLdProduct;
      if (data["@type"] === "Product") {
        product = data;
        break;
      }
    } catch {
      // Torob can include unrelated malformed structured-data blocks.
    }

    script = scriptPattern.exec(html);
  }

  if (!product) {
    throw new Error("Torob product data was not found");
  }

  const rawPrice = Number(product.offers?.lowPrice);
  const price = Number.isFinite(rawPrice)
    ? product.offers?.priceCurrency === "IRR"
      ? Math.round(rawPrice / 10)
      : rawPrice
    : null;
  const image = Array.isArray(product.image)
    ? (product.image[0] ?? null)
    : (product.image ?? null);

  return {
    title: product.name ?? "",
    price,
    image:
      image?.replace(/_\/560x560\.webp(?:\?.*)?$/, "_/280x280.webp") ?? null,
    url: product.url ?? productUrl,
  };
}
