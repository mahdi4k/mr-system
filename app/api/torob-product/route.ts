import { NextRequest, NextResponse } from "next/server";
import { fetchTorobProduct, isAllowedTorobUrl } from "@/_utils/torobProduct";

export const revalidate = 86400;

export async function GET(request: NextRequest) {
  const productUrl = request.nextUrl.searchParams.get("url");

  if (!productUrl || !isAllowedTorobUrl(productUrl)) {
    return NextResponse.json(
      { success: false, error: "A valid Torob product URL is required" },
      { status: 400 },
    );
  }

  try {
    const product = await fetchTorobProduct(productUrl);

    return NextResponse.json(
      {
        success: true,
        product,
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
