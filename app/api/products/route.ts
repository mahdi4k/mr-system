import { getDb } from "@/_db/index";
import { products, productTypes, ProductType } from "@/_db/schema";
import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const isProductType = (value: string): value is ProductType =>
  productTypes.some((type) => type === value);

export async function GET(request: NextRequest) {
  try {
    const typeParam = request.nextUrl.searchParams.get("type");

    if (typeParam && !isProductType(typeParam)) {
      return NextResponse.json(
        { success: false, error: "Invalid product type" },
        { status: 400 },
      );
    }

    const requestedType = typeParam as ProductType | null;
    const db = getDb();
    const data = requestedType
      ? await db
          .select()
          .from(products)
          .where(eq(products.type, requestedType))
          .orderBy(asc(products.legacyId))
      : await db
          .select()
          .from(products)
          .orderBy(asc(products.type), asc(products.legacyId));

    return NextResponse.json({
      success: true,
      count: data.length,
      products: data,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    return NextResponse.json(
      { success: false, error: "Unable to fetch products" },
      { status: 500 },
    );
  }
}
