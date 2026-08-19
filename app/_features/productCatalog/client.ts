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

/**
 * Load the merged catalog (static + Supabase overlay) for a part type.
 * Used in place of the old per-product /api/torob-product scrape.
 */
export async function fetchMergedCatalog(
  partType: CatalogPartType,
): Promise<MergedCatalogProduct[]> {
  const response = await fetch(`/api/catalog/${partType}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to load catalog for ${partType}`);
  }
  return (await response.json()) as MergedCatalogProduct[];
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
      ...catalogOverridesFor(item.id, merged),
    }));
  } catch {
    return items;
  }
}
