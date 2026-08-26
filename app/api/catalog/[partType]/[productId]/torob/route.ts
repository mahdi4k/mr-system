import { NextResponse } from "next/server";
import { createClient } from "../../../../../_lib/supabase/server";
import { getMergedCatalogProduct } from "../../../../../_features/productCatalog/data";
import { getTorobProductDetailsForPriceRefresh } from "../../../../../_features/torob/provider";
import { DEFAULT_REFRESH_INTERVAL_MS } from "../../../../../_features/priceSync/worker";
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

    // Direct Torob fetch: mint a fresh search_id via title search, then
    // fetch details for the prk we already trust. No fallback — failures
    // surface here and Parse.bot remains a separate manual option.
    const details = await getTorobProductDetailsForPriceRefresh(
      currentRow.torob_product_id,
      currentRow.title,
    );

    const updatedAt = new Date().toISOString();

    // Record price history first, mirroring the background worker.
    const { error: historyError } = await supabase
      .from("price_history")
      .insert({
        part_type: pt,
        product_id: productId,
        provider: "torob",
        price: details.price,
      });

    if (historyError) {
      console.error("Price history insert error:", historyError);
      // Non-fatal: log but don't fail the sync
    }

    // Update the row with the same bookkeeping the worker applies.
    const updatePayload: {
      current_price: number;
      price_source: "automatic";
      image_url?: string;
      sync_status: "active";
      fetched_at: string;
      last_success_at: string;
      last_error: null;
      failure_count: number;
      next_fetch_at: string;
      updated_at: string;
    } = {
      current_price: details.price,
      price_source: "automatic",
      sync_status: "active",
      fetched_at: updatedAt,
      last_success_at: updatedAt,
      last_error: null,
      failure_count: 0,
      next_fetch_at: new Date(
        Date.now() + DEFAULT_REFRESH_INTERVAL_MS,
      ).toISOString(),
      updated_at: updatedAt,
    };

    if (details.image_url && typeof details.image_url === "string") {
      updatePayload.image_url = details.image_url;
    }

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

    await supabase.from("catalog_audit_history").insert({
      part_type: pt,
      product_id: productId,
      action: "update",
      title_before: currentRow.title,
      title_after: currentRow.title,
      price_before: currentRow.current_price,
      price_after: details.price,
      changed_by: changedBy,
    });

    // Return updated product
    const updatedProduct = await getMergedCatalogProduct(
      supabase,
      pt,
      productId,
    );
    if (!updatedProduct) {
      return NextResponse.json(
        { error: "محصول پس از بروزرسانی یافت نشد" },
        { status: 500 },
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Torob direct sync error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `دریافت مستقیم از تورب ناموفق بود: ${message}` },
      { status: 500 },
    );
  }
}
