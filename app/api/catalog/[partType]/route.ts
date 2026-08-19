import { NextResponse } from "next/server";
import { createClient } from "../../../_lib/supabase/server";
import { getMergedCatalog } from "../../../_features/productCatalog/data";
import { CATALOG_PART_TYPES } from "../../../_features/productCatalog/types";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ partType: string }> },
) {
  const { partType } = await context.params;
  if (
    !CATALOG_PART_TYPES.includes(
      partType as (typeof CATALOG_PART_TYPES)[number],
    )
  ) {
    return NextResponse.json({ error: "نوع قطعه معتبر نیست" }, { status: 400 });
  }
  const supabase = await createClient();
  try {
    const products = await getMergedCatalog(
      supabase,
      partType as (typeof CATALOG_PART_TYPES)[number],
    );
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "دریافت کاتالوگ ناموفق بود" },
      { status: 500 },
    );
  }
}
