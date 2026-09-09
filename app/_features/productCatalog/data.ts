import type { SupabaseClient } from "@supabase/supabase-js";
import {
  cases,
  cpus,
  fans,
  graphics,
  motherboards,
  powers,
  rams,
  ssds,
} from "../../_data/productCatalog";
import type {
  CatalogPartType,
  CatalogSyncStatus,
  Database,
  PriceSource,
} from "../../types/database.types";
import { toTorobProductId } from "../../_utils/torobUrl";
import type { CatalogOverlay } from "./types";

type StaticProduct = {
  id: number;
  name: string;
  image?: string;
  torobUrl?: string;
  price?: string;
};

/**
 * The canonical static catalog per part type. Each entry carries the product's
 * own id (used as catalog_product_content.product_id) and either a configured
 * Torob reference (torobUrl) or no reference at all.
 */
export const STATIC_CATALOG_BY_TYPE: Record<CatalogPartType, StaticProduct[]> =
  {
    cpu: cpus,
    motherboard: motherboards,
    graphic: graphics,
    power: powers,
    ram: rams,
    fan: fans,
    ssd: ssds,
    case: cases,
  };

export function getStaticProduct(
  partType: CatalogPartType,
  productId: number,
): StaticProduct | undefined {
  return STATIC_CATALOG_BY_TYPE[partType]?.find((p) => p.id === productId);
}

/**
 * Deterministic fallback title for a static catalog product.
 * Prefers an explicit product title resolved by the caller, then the static name.
 */
export function staticTitle(
  partType: CatalogPartType,
  productId: number,
): string {
  const product = getStaticProduct(partType, productId);
  return product?.name ?? `کالای #${productId}`;
}

export const EMPTY_OVERLAY: CatalogOverlay = {
  title: null,
  price: null,
  priceSource: null,
  image: null,
  torobProductId: null,
  fetchedAt: null,
  lastSuccessAt: null,
  syncStatus: "never",
  updatedAt: null,
};

export interface MergedCatalogProduct {
  id: number;
  partType: CatalogPartType;
  title: string;
  price: number | null;
  priceSource: PriceSource | null;
  image: string;
  torobProductId: string | null;
  name: string;
  staticImage: string;
  torobUrl: string | null;
  overlay: CatalogOverlay;
}

/**
 * Build a merged-catalog view: static product shape overlaid with the
 * authoritative Supabase catalog content (editable title/price/image + sync state).
 */
export function mergeCatalogProduct(
  partType: CatalogPartType,
  product: StaticProduct,
  overlay: CatalogOverlay,
): MergedCatalogProduct {
  const torobProductId = toTorobProductId(product.torobUrl);
  return {
    id: product.id,
    partType,
    title: overlay.title ?? product.name,
    price: overlay.price,
    priceSource: overlay.priceSource,
    image: overlay.image ?? product.image ?? "/svg/item.svg",
    torobProductId,
    name: product.name,
    staticImage: product.image ?? "/svg/item.svg",
    torobUrl: product.torobUrl ?? null,
    overlay,
  };
}

export function toOverlay(row: {
  title: string | null;
  current_price: number | null;
  price_source: PriceSource | null;
  image_url: string | null;
  torob_product_id: string | null;
  fetched_at: string | null;
  last_success_at: string | null;
  sync_status: CatalogSyncStatus | null;
  updated_at: string | null;
}): CatalogOverlay {
  return {
    title: row.title,
    price: row.current_price,
    priceSource: row.price_source,
    image: row.image_url,
    torobProductId: row.torob_product_id,
    fetchedAt: row.fetched_at,
    lastSuccessAt: row.last_success_at,
    syncStatus: row.sync_status ?? "never",
    updatedAt: row.updated_at,
  };
}

/**
 * Product ids excluded (admin-deleted) for a part type. The static catalog is
 * code-defined, so a "delete" records an exclusion instead of removing a row.
 */
export async function getExcludedProductIds(
  client: SupabaseClient<Database>,
  partType: CatalogPartType,
): Promise<Set<number>> {
  const { data, error } = await client
    .from("catalog_product_exclusions")
    .select("product_id")
    .eq("part_type", partType);

  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((row) => row.product_id));
}

/**
 * Record an admin deletion for a static catalog product. `count: "exact"` is
 * required so an RLS-blocked insert surfaces as an error instead of silence.
 */
export async function deleteCatalogProduct(
  client: SupabaseClient<Database>,
  partType: CatalogPartType,
  productId: number,
): Promise<void> {
  const changedBy = (await client.auth.getUser()).data.user?.id ?? null;

  const { count, error } = await client
    .from("catalog_product_exclusions")
    .upsert(
      { part_type: partType, product_id: productId, deleted_by: changedBy },
      {
        onConflict: "part_type,product_id",
        count: "exact",
        ignoreDuplicates: true,
      },
    );

  if (error) {
    throw new Error(error.message);
  }
  if (count === 0) {
    throw new Error("حذف انجام نشد: دسترسی مدیر لازم است");
  }
}

export async function getMergedCatalog(
  client: SupabaseClient<Database>,
  partType: CatalogPartType,
): Promise<MergedCatalogProduct[]> {
  const rows = await client
    .from("catalog_product_content")
    .select(
      "product_id, title, current_price, price_source, image_url, torob_product_id, fetched_at, last_success_at, sync_status, updated_at",
    )
    .eq("part_type", partType)
    .order("product_id");

  const { data, error } = rows;
  if (error) throw new Error(error.message);

  const byId = new Map<number, CatalogOverlay>();
  for (const row of data ?? []) {
    byId.set(row.product_id, toOverlay(row));
  }

  const excluded = await getExcludedProductIds(client, partType);

  return (STATIC_CATALOG_BY_TYPE[partType] ?? [])
    .filter((product) => !excluded.has(product.id))
    .map((product) => {
      const overlay = byId.get(product.id) ?? EMPTY_OVERLAY;
      return mergeCatalogProduct(partType, product as StaticProduct, overlay);
    });
}

export async function getMergedCatalogProduct(
  client: SupabaseClient<Database>,
  partType: CatalogPartType,
  productId: number,
): Promise<MergedCatalogProduct | null> {
  const product = getStaticProduct(partType, productId);
  if (!product) return null;

  const excluded = await getExcludedProductIds(client, partType);
  if (excluded.has(productId)) return null;

  const { data, error } = await client
    .from("catalog_product_content")
    .select(
      "title, current_price, price_source, image_url, torob_product_id, fetched_at, last_success_at, sync_status, updated_at",
    )
    .eq("part_type", partType)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  const overlay = data ? toOverlay(data) : EMPTY_OVERLAY;
  return mergeCatalogProduct(partType, product as StaticProduct, overlay);
}
