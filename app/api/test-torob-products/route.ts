import { NextResponse } from "next/server";

const TOROB_CATEGORY_URL =
  "https://torob.com/browse/519/%D9%BE%D8%B1%D8%AF%D8%A7%D8%B2%D9%86%D8%AF%D9%87-cpu/b/46/intel-%D8%A7%DB%8C%D9%86%D8%AA%D9%84/";

export const dynamic = "force-dynamic";

type TorobProduct = {
  random_key?: string;
  name1?: string;
  name2?: string;
  price?: number;
  price_text?: string;
  image_url?: string;
  web_client_absolute_url?: string;
  is_adv?: boolean;
};

export async function GET() {
  try {
    const response = await fetch(TOROB_CATEGORY_URL, {
      cache: "no-store",
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

    const nextDataMatch = html.match(
      /<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/,
    );

    if (!nextDataMatch?.[1]) {
      return NextResponse.json(
        {
          success: false,
          error: "__NEXT_DATA__ was not found",
        },
        { status: 502 },
      );
    }

    const nextData = JSON.parse(nextDataMatch[1]);

    const products: TorobProduct[] = nextData?.props?.pageProps?.products;

    if (!Array.isArray(products)) {
      return NextResponse.json(
        {
          success: false,
          error: "Products were not found",
        },
        { status: 502 },
      );
    }

    const firstTenProducts = products.slice(0, 10).map((product) => ({
      id: product.random_key,
      title: product.name1,
      englishTitle: product.name2 ?? null,
      price: product.price ?? null,
      formattedPrice: product.price_text ?? null,
      image: product.image_url ?? null,
      isAdvertisement: product.is_adv ?? false,
      url: product.web_client_absolute_url
        ? `https://torob.com${product.web_client_absolute_url}`
        : null,
    }));

    return NextResponse.json({
      success: true,
      count: firstTenProducts.length,
      products: firstTenProducts,
    });
  } catch (error) {
    console.error("Error fetching Torob products:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unexpected error while fetching Torob products",
      },
      { status: 500 },
    );
  }
}
