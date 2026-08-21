import { NextResponse } from "next/server";
import { createClient } from "../../../../../_lib/supabase/server";
import { getMergedCatalogProduct } from "../../../../../_features/productCatalog/data";
import { getProductDetails } from "../../../../../_features/parseBot/provider";
import { CATALOG_PART_TYPES } from "../../../../../_features/productCatalog/types";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ partType: string; productId: string }> },
) {
  const { partType, productId: productIdStr } = await context.params;

  if (
    !CATALOG_PART_TYPES.includes(
      partType as (typeof CATALOG_PART_TYPES)[number],
    )
  ) {
    return NextResponse.json({ error: "نوع قطعه معتبر نیست" }, { status: 400 });
  }

  const productId = parseInt(productIdStr, 10);
  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json(
      { error: "شناسه محصول معتبر نیست" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const pt = partType as (typeof CATALOG_PART_TYPES)[number];

  try {
    // Read the current row to get torob_product_id
    const { data: currentRow, error: fetchError } = await supabase
      .from("catalog_product_content")
      .select("title, current_price, torob_product_id")
      .eq("part_type", pt)
      .eq("product_id", productId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching product:", fetchError);
      return NextResponse.json(
        { error: "خطا در دریافت اطلاعات محصول" },
        { status: 500 },
      );
    }

    if (!currentRow) {
      return NextResponse.json(
        { error: "محصول مورد نظر یافت نشد" },
        { status: 404 },
      );
    }

    if (!currentRow.torob_product_id) {
      return NextResponse.json(
        { error: "این محصول مرجع تورب ندارد" },
        { status: 400 },
      );
    }

    // Call parse.bot get_product_details
    const details = await getProductDetails(currentRow.torob_product_id);

    // Build update payload
    const updatePayload: {
      current_price?: number;
      price_source?: "manual";
      image_url?: string;
      updated_at: string;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (details.price) {
      updatePayload.current_price = details.price;
      updatePayload.price_source = "manual";
    }

    if (details.image_url) {
      updatePayload.image_url = details.image_url;
    }

    // Update the row
    const { error: updateError } = await supabase
      .from("catalog_product_content")
      .update(updatePayload)
      .eq("part_type", pt)
      .eq("product_id", productId);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { error: "بروزرسانی محصول ناموفق بود" },
        { status: 500 },
      );
    }

    // Insert audit log
    const changedBy = (await supabase.auth.getUser()).data.user?.id ?? null;

    const newPrice =
      updatePayload.current_price !== undefined
        ? updatePayload.current_price
        : currentRow.current_price;

    await supabase.from("catalog_audit_history").insert({
      part_type: pt,
      product_id: productId,
      action: "update",
      title_before: currentRow.title,
      title_after: currentRow.title,
      price_before: currentRow.current_price,
      price_after: newPrice,
      changed_by: changedBy,
    });

    // Return updated product
    const updatedProduct = await getMergedCatalogProduct(supabase, pt, productId);
    if (!updatedProduct) {
      return NextResponse.json(
        { error: "محصول پس از بروزرسانی یافت نشد" },
        { status: 500 },
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Parse.bot sync error:", error);
    const message =
      error instanceof Error ? error.message : "خطا در همگام‌سازی از تورب";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
