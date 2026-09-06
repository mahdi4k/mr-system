import type { CatalogPartType } from "../../types/database.types";

export interface MergedCatalogProduct {
  id: number;
  partType: CatalogPartType;
  title: string;
  price: number | null;
  priceSource: "automatic" | "manual" | null;
  image: string;
  torobProductId: string | null;
  name: string;
  staticImage: string;
  torobUrl: string | null;
  overlay: {
    syncStatus: string;
    fetchedAt: string | null;
  };
}

const MERGED_CATALOG_TIMEOUT_MS = 10_000;
const MERGED_CATALOG_MAX_ATTEMPTS = 3;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Load the merged catalog (static + Supabase overlay) for a part type.
 * Used in place of the old per-product /api/torob-product scrape.
 *
 * Retries transient failures with a small backoff and a per-attempt timeout
 * so RTK Query queryFn promises neither hang forever nor silently lose the
 * price overlay (a missing overlay means the part cannot be priced, which
 * silently removes it from build recommendations).
 */
export async function fetchMergedCatalog(
  partType: CatalogPartType,
): Promise<MergedCatalogProduct[]> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MERGED_CATALOG_MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(`/api/catalog/${partType}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(MERGED_CATALOG_TIMEOUT_MS),
      });
      if (!response.ok) {
        throw new Error(`Failed to load catalog for ${partType}`);
      }
      return (await response.json()) as MergedCatalogProduct[];
    } catch (error) {
      lastError = error;
      if (attempt < MERGED_CATALOG_MAX_ATTEMPTS) {
        await sleep(attempt * 500);
      }
    }
  }
  throw lastError;
}

/**
 * Produce the display-facing price/image/name overrides for a static product,
 * sourced from the merged catalog. Everything else on the static product
 * (socket, specs, compatibility) is left untouched.
 */
export function catalogOverridesFor(
  productId: number,
  merged: MergedCatalogProduct[] | undefined,
): { name?: string; image?: string; links?: string; price?: string } {
  const item = merged?.find((m) => m.id === productId);
  if (!item) return {};
  const overrides: {
    name?: string;
    image?: string;
    links?: string;
    price?: string;
  } = {};
  if (item.title) overrides.name = item.title;
  if (item.image) overrides.image = item.image;
  if (item.torobUrl) overrides.links = item.torobUrl;
  if (item.price != null) overrides.price = String(item.price);
  return overrides;
}

export interface CatalogPartish {
  id: number;
  name: string;
  image: string;
  links: string;
  torobUrl?: string;
  price?: string;
}

/**
 * Generic enrichment shared by all part RTK services: fetch the merged catalog
 * for a part type once and overlay price/image/title onto the static list.
 */
export async function enrichCatalogParts<
  T extends CatalogPartish = CatalogPartish,
>(items: T[], partType: CatalogPartType): Promise<T[]> {
  if (items.length === 0) return items;
  try {
    const merged = await fetchMergedCatalog(partType);
    return items.map((item) => ({
      ...item,
      // Keep the reliable static image around so the UI can fall back to it
      // when the overlay image (e.g. torob CDN) fails to load.
      staticImage: item.image,
      ...catalogOverridesFor(item.id, merged),
    }));
  } catch {
    return items;
  }
}
