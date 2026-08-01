import { NextResponse } from "next/server";

const PRODUCT_KEY = "7af4bb43-81b0-4160-92ff-7db0d5da3dfa";

export const dynamic = "force-dynamic";

export async function GET() {
  const url =
    `https://api.torob.com/v4/base-product/details/` +
    `?prk=${PRODUCT_KEY}&max_seller_count=1`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Torob returned status ${response.status}`,
        },
        { status: 502 },
      );
    }

    const data = await response.json();

    const possiblePrices = [
      data?.min_price,
      data?.price,
      data?.baseProduct?.min_price,
      data?.baseProduct?.price,
      data?.base_product?.min_price,
      data?.base_product?.price,
      data?.result?.min_price,
      data?.result?.price,
    ];

    const price = possiblePrices.find(
      (value) => typeof value === "number" && value > 0,
    );

    if (price === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Price was not found",
          topLevelKeys:
            data && typeof data === "object" ? Object.keys(data) : [],
          torobResponse: data,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      productKey: PRODUCT_KEY,
      price,
      formattedPrice: `${price.toLocaleString("fa-IR")} تومان`,
    });
  } catch (error) {
    console.error("Error fetching Torob price:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unexpected error while fetching Torob price",
      },
      { status: 500 },
    );
  }
}