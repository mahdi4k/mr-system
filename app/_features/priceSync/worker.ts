import type { SupabaseClient } from "@supabase/supabase-js";
import { getProductDetailsForPriceRefresh } from "../parseBot/provider";
import { toTorobProductId } from "../../_utils/torobUrl";
import type { CatalogPartType, Database } from "../../types/database.types";

export interface ClaimedRow {
  part_type: CatalogPartType;
  product_id: number;
  title: string | null;
  current_price: number | null;
  image_url: string | null;
  torob_product_id: string | null;
  claim_token: string;
  lease_until: string;
  failure_count: number;
}

export interface RefreshSuccess {
  partType: CatalogPartType;
  productId: number;
  price: number;
}

export interface RefreshFailure {
  partType: CatalogPartType;
  productId: number;
  error: string;
}

export const DEFAULT_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;
export const DEFAULT_LEASE_MS = 10 * 60 * 1000;
export const MAX_FAILURES = 5;

function backoffDelayMs(failures: number): number {
  if (failures <= 0) return DEFAULT_REFRESH_INTERVAL_MS;
  const factor = Math.min(2 ** Math.min(failures, 4) * 2, 64);
  return DEFAULT_REFRESH_INTERVAL_MS * factor;
}

/**
 * Claim up to `limit` due catalog rows atomically. A row is eligible when it
 * has never been scheduled (next_fetch_at null OR past) and its current lease
 * is empty or already expired. Returns the claimed rows.
 */
export async function claimDueRows(
  client: SupabaseClient<Database>,
  limit: number,
  options: { leaseMs?: number } = {},
): Promise<ClaimedRow[]> {
  const now = new Date();
  const nowIso = now.toISOString();
  const leaseUntil = new Date(
    now.getTime() + (options.leaseMs ?? DEFAULT_LEASE_MS),
  ).toISOString();
  const token = crypto.randomUUID();

  const { data, error } = await client
    .from("catalog_product_content")
    .update({
      claim_token: token,
      claimed_at: nowIso,
      lease_until: leaseUntil,
    })
    .not("torob_product_id", "is", null)
    .or(`next_fetch_at.is.null,next_fetch_at.lte.${nowIso}`)
    .or(`lease_until.is.null,lease_until.lt.${nowIso}`)
    .select("*")
    .limit(limit);

  if (error) {
    if (String(error.message).includes("could not find the function")) {
      return [];
    }
    throw new Error(error.message);
  }
  return (data ?? []) as ClaimedRow[];
}

/**
 * Refresh a single claimed row: fetch its Torob price, persist it to
 * catalog_product_content (automatic source), record price_history, and roll
 * back failure counters. Leaves the lease claimed until the caller releases it.
 */
export async function refreshClaimedRow(
  client: SupabaseClient<Database>,
  row: ClaimedRow,
): Promise<RefreshSuccess | RefreshFailure> {
  const torobProductId = row.torob_product_id ?? toTorobProductId(row.title);
  if (!torobProductId) {
    return {
      partType: row.part_type,
      productId: row.product_id,
      error: "این کالا مرجع تاروب ندارد.",
    };
  }

  try {
    const details = await getProductDetailsForPriceRefresh(torobProductId);
    const updatedAt = new Date().toISOString();

    await client.from("price_history").insert({
      part_type: row.part_type,
      product_id: row.product_id,
      provider: "torob",
      price: details.price,
    });

    const { error } = await client
      .from("catalog_product_content")
      .update({
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
        claim_token: null,
        claimed_at: null,
        lease_until: null,
      })
      .eq("part_type", row.part_type)
      .eq("product_id", row.product_id);

    if (error) throw new Error(error.message);
    return {
      partType: row.part_type,
      productId: row.product_id,
      price: details.price,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    try {
      const failures = row.failure_count + 1;
      await client
        .from("catalog_product_content")
        .update({
          sync_status: failures >= MAX_FAILURES ? "failed" : "retrying",
          last_error: message.slice(0, 500),
          failure_count: failures,
          next_fetch_at: new Date(
            Date.now() + backoffDelayMs(failures),
          ).toISOString(),
          claim_token: null,
          claimed_at: null,
          lease_until: null,
        })
        .eq("part_type", row.part_type)
        .eq("product_id", row.product_id);
    } catch {
      // Persisting the failure metadata itself failed; surface the original error.
    }
    return {
      partType: row.part_type,
      productId: row.product_id,
      error: message,
    };
  }
}
