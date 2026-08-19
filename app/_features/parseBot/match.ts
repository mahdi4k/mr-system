import type { SupabaseClient } from "@supabase/supabase-js";
import { searchProducts } from "./provider";
import { staticTitle } from "../productCatalog/data";
import type {
  CatalogPartType,
  Database,
  MatchStatus,
} from "../../types/database.types";

export interface MatchCandidateInput {
  productId: number;
  partType: CatalogPartType;
  searchQuery: string;
}

const MAX_CANDIDATES = 6;

/**
 * Search Parse.bot/Torob for a catalog product and persist the top results as
 * reviewable match candidates. Returns the current candidate list for the product.
 */
export async function suggestCandidates(
  client: SupabaseClient<Database>,
  input: MatchCandidateInput,
): Promise<number> {
  const query =
    input.searchQuery.trim() || staticTitle(input.partType, input.productId);
  const { results } = await searchProducts(query, { page: 1 });

  const ranked = results
    .slice(0, MAX_CANDIDATES)
    .map((item, index) => ({
      part_type: input.partType,
      product_id: input.productId,
      candidate_torob_product_id: String(item.random_key ?? ""),
      candidate_name: String(item.name1 ?? query),
      candidate_price: Number.isFinite(Number(item.price))
        ? Math.trunc(Number(item.price))
        : null,
      candidate_image_url:
        typeof item.image_url === "string" ? item.image_url : null,
      search_query: query,
      rank: index,
    }))
    .filter((c) => c.candidate_torob_product_id);

  if (ranked.length === 0) return 0;

  const { data, error } = await client
    .from("torob_match_candidates")
    .upsert(ranked, {
      onConflict: "candidate_torob_product_id,product_id,part_type",
    })
    .select("id");

  if (error) throw new Error(error.message);
  return data?.length ?? 0;
}

/**
 * Confirm (or reject) a candidate. Confirming writes the Torob reference into
 * catalog_product_content and schedules an immediate price refresh; it also
 * rejects any sibling pending candidates for the same product.
 */
export async function reviewCandidate(
  client: SupabaseClient<Database>,
  candidateId: string,
  status: Extract<MatchStatus, "approved" | "rejected">,
): Promise<void> {
  const { data, error } = await client
    .from("torob_match_candidates")
    .select("id, part_type, product_id, candidate_torob_product_id")
    .eq("id", candidateId)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("کاندیدا یافت نشد");

  await client
    .from("torob_match_candidates")
    .update({
      status,
      reviewed_by: null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", candidateId);

  if (status === "approved") {
    await client
      .from("catalog_product_content")
      .update({
        torob_product_id: data.candidate_torob_product_id,
        sync_status: "retrying",
        next_fetch_at: new Date().toISOString(),
      })
      .eq("part_type", data.part_type)
      .eq("product_id", data.product_id);

    await client
      .from("torob_match_candidates")
      .update({ status: "rejected" })
      .eq("part_type", data.part_type)
      .eq("product_id", data.product_id)
      .eq("status", "pending");
  }
}
