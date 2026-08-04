import { NextRequest, NextResponse } from "next/server";

export const revalidate = 86400;

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

const isAllowedTorobUrl = (value: string): boolean => {
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

export async function GET(request: NextRequest) {
  const productUrl = request.nextUrl.searchParams.get("url");

  if (!productUrl || !isAllowedTorobUrl(productUrl)) {
    return NextResponse.json(
      { success: false, error: "A valid Torob product URL is required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(productUrl, {
      next: { revalidate: 86400 },
      headers: {
        Accept: "text/html",
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Torob responded with status ${response.status}`,
        },
        { status: 502 },
      );
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
      return NextResponse.json(
        { success: false, error: "Torob product data was not found" },
        { status: 502 },
      );
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
    const optimizedImage = image?.replace(
      /_\/560x560\.webp(?:\?.*)?$/,
      "_/280x280.webp",
    );

    return NextResponse.json(
      {
        success: true,
        product: {
          title: product.name ?? "",
          price,
          image: optimizedImage,
          url: product.url ?? productUrl,
        },
      },
      {
        headers: {
          "Cache-Control":
            "public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching Torob product:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unexpected error while fetching Torob product",
      },
      { status: 500 },
    );
  }
}
