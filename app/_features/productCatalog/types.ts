import type {
  CatalogPartType,
  CatalogSyncStatus,
  PriceSource,
} from "../../types/database.types";

export interface CatalogContentRow {
  part_type: CatalogPartType;
  product_id: number;
  title: string;
  current_price: number | null;
  price_source: PriceSource;
  image_url: string | null;
  torob_product_id: string | null;
  sync_status: CatalogSyncStatus;
  fetched_at: string | null;
  next_fetch_at: string | null;
  last_success_at: string | null;
  last_error: string | null;
  failure_count: number;
  updated_at: string;
}

/**
 * The dynamic overlay applied on top of a static catalog product.
 */
export interface CatalogOverlay {
  title: string | null;
  price: number | null;
  priceSource: PriceSource | null;
  image: string | null;
  torobProductId: string | null;
  fetchedAt: string | null;
  lastSuccessAt: string | null;
  syncStatus: CatalogSyncStatus;
  updatedAt: string | null;
}

export const CATALOG_PART_TYPES: CatalogPartType[] = [
  "cpu",
  "motherboard",
  "graphic",
  "power",
  "ram",
  "fan",
  "ssd",
  "case",
];
