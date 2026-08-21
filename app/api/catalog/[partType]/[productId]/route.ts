import { NextResponse } from "next/server";
import { createClient } from "../../../../_lib/supabase/server";
import { getMergedCatalogProduct } from "../../../../_features/productCatalog/data";
import { CATALOG_PART_TYPES } from "../../../../_features/productCatalog/types";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ partType: string; productId: string }> },
) {
  const { partType, productId: productIdStr } = await context.params;

  // Validate partType
  if (
    !CATALOG_PART_TYPES.includes(
      partType as (typeof CATALOG_PART_TYPES)[number],
    )
  ) {
    return NextResponse.json({ error: "نوع قطعه معتبر نیست" }, { status: 400 });
  }

  // Validate productId
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
    // 1. Read current row for audit log
    const { data: currentRow, error: fetchError } = await supabase
      .from("catalog_product_content")
      .select("title, current_price")
      .eq("part_type", pt)
      .eq("product_id", productId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching current product:", fetchError);
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

    // 2. Parse multipart form data
    const formData = await request.formData();
    const priceField = formData.get("price");
    const imageFile = formData.get("image");

    const updatePayload: {
      current_price?: number;
      price_source?: "manual";
      image_url?: string;
      updated_at: string;
    } = {
      updated_at: new Date().toISOString(),
    };

    // Validate and set price
    if (priceField !== null && priceField !== "") {
      const price = parseInt(priceField.toString(), 10);
      if (!Number.isInteger(price) || price < 1 || price > 999999999999) {
        return NextResponse.json(
          { error: "قیمت باید بین ۱ تا ۹۹۹٬۹۹۹٬۹۹۹٬۹۹۹ تومان باشد" },
          { status: 400 },
        );
      }
      updatePayload.current_price = price;
      updatePayload.price_source = "manual";
    }

    // Handle image upload
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const ext = imageFile.name.split(".").pop() ?? "jpg";
      const storagePath = `${pt}/${productId}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("catalog-images")
        .upload(storagePath, imageFile, {
          contentType: imageFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Image upload error:", uploadError);
        return NextResponse.json(
          { error: "آپلود تصویر ناموفق بود" },
          { status: 500 },
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from("catalog-images")
        .getPublicUrl(storagePath);

      updatePayload.image_url = publicUrlData.publicUrl;
    }

    // 3. Update the row
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

    // 4. Insert audit log
    const changedBy = (await supabase.auth.getUser()).data.user?.id ?? null;

    const newPrice =
      updatePayload.current_price !== undefined
        ? updatePayload.current_price
        : currentRow.current_price;

    const { error: auditError } = await supabase
      .from("catalog_audit_history")
      .insert({
        part_type: pt,
        product_id: productId,
        action: "update",
        title_before: currentRow.title,
        title_after: currentRow.title,
        price_before: currentRow.current_price,
        price_after: newPrice,
        changed_by: changedBy,
      });

    if (auditError) {
      console.error("Audit log error:", auditError);
      // Non-fatal: log but don't fail the response
    }

    // 5. Return the updated product in client shape
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
    console.error("PATCH catalog error:", error);
    return NextResponse.json(
      { error: "بروزرسانی کاتالوگ ناموفق بود" },
      { status: 500 },
    );
  }
}
