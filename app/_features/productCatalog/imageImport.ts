import type { SupabaseClient } from "@supabase/supabase-js";
import { getProductDetails } from "../parseBot/provider";
import type { CatalogPartType, Database } from "../../types/database.types";

export interface ImportedImage {
  partType: CatalogPartType;
  productId: number;
  source: string;
  publicUrl: string | null;
}

export interface ImageImportSummary {
  imported: ImportedImage[];
  skipped: Array<{
    partType: CatalogPartType;
    productId: number;
    reason: string;
  }>;
}

const BUCKET = "product-images";

async function downloadImage(
  url: string,
): Promise<{ bytes: ArrayBuffer; type: string }> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`دسترسی به تصویر تورب ناموفق بود (${response.status})`);
  }
  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const ext = contentType.includes("webp")
    ? "webp"
    : contentType.includes("png")
      ? "png"
      : "jpg";
  return { bytes: await response.arrayBuffer(), type: ext };
}

/**
 * One-time import: copy each catalog product's Torob source image into the
 * Rigora-owned `product-images` bucket and repoint catalog_product_content.
 * Runs server-side with the admin (secret-key) client.
 */
export async function importCatalogImages(
  client: SupabaseClient<Database>,
  options: { limit?: number } = {},
): Promise<ImageImportSummary> {
  const imported: ImportedImage[] = [];
  const skipped: ImageImportSummary["skipped"] = [];

  const { data, error } = await client
    .from("catalog_product_content")
    .select("part_type, product_id, torob_product_id, image_url")
    .not("torob_product_id", "is", null)
    .order("product_id")
    .limit(Math.min(options.limit ?? 20, 100));

  if (error) throw new Error(error.message);

  for (const row of data ?? []) {
    try {
      let imageUrl = row.image_url;
      if (!imageUrl) {
        const details = await getProductDetails(row.torob_product_id!);
        imageUrl = details.image_url ?? null;
      }
      if (!imageUrl) {
        skipped.push({
          partType: row.part_type,
          productId: row.product_id,
          reason: "no image_url returned by provider",
        });
        continue;
      }

      const { bytes, type } = await downloadImage(imageUrl);
      const objectPath = `${row.part_type}/${row.product_id}/main.${type}`;
      const { error: uploadError } = await client.storage
        .from(BUCKET)
        .upload(objectPath, bytes, {
          contentType: `image/${type}`,
          cacheControl: "31536000",
          upsert: true,
        });

      if (uploadError) {
        skipped.push({
          partType: row.part_type,
          productId: row.product_id,
          reason: uploadError.message,
        });
        continue;
      }

      const { data: publicUrlData } = client.storage
        .from(BUCKET)
        .getPublicUrl(objectPath);

      const { error: updateError } = await client
        .from("catalog_product_content")
        .update({ image_url: publicUrlData.publicUrl })
        .eq("part_type", row.part_type)
        .eq("product_id", row.product_id);

      if (updateError) {
        skipped.push({
          partType: row.part_type,
          productId: row.product_id,
          reason: updateError.message,
        });
        continue;
      }

      imported.push({
        partType: row.part_type,
        productId: row.product_id,
        source: imageUrl,
        publicUrl: publicUrlData.publicUrl,
      });
    } catch (err) {
      skipped.push({
        partType: row.part_type,
        productId: row.product_id,
        reason: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return { imported, skipped };
}
