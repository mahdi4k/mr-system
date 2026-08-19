import type { SupabaseClient } from "@supabase/supabase-js";
import { STATIC_CATALOG_BY_TYPE } from "./data";
import { toTorobProductId } from "../../_utils/torobUrl";
import type { CatalogPartType, Database } from "../../types/database.types";

export interface BackfillResult {
  updated: number;
  skippedNoRef: number;
}

/**
 * Populate catalog_product_content.torob_product_id from the static catalog's
 * embedded Torob references, and schedule any newly-referenced rows for an
 * immediate refresh. Idempotent: already-set and empty references are left as-is.
 */
export async function backfillTorobReferences(
  client: SupabaseClient<Database>,
): Promise<BackfillResult> {
  let updated = 0;
  let skippedNoRef = 0;

  for (const [partType, products] of Object.entries(STATIC_CATALOG_BY_TYPE) as [
    CatalogPartType,
    Array<{ id: number; torobUrl?: string }>,
  ][]) {
    for (const product of products) {
      const torobProductId = toTorobProductId(product.torobUrl);
      if (!torobProductId) {
        skippedNoRef += 1;
        continue;
      }
      const { data, error } = await client
        .from("catalog_product_content")
        .update({
          torob_product_id: torobProductId,
          sync_status: "retrying",
          next_fetch_at: new Date().toISOString(),
        })
        .eq("part_type", partType)
        .eq("product_id", product.id)
        .select("product_id");

      if (error) throw new Error(error.message);
      if (data && data.length > 0) updated += 1;
    }
  }

  return { updated, skippedNoRef };
}
