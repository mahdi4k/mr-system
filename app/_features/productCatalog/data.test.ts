import { toOverlay, mergeCatalogProduct, getStaticProduct } from "./data";
import type { CatalogOverlay } from "./types";

describe("productCatalog overlay helpers", () => {
  const row = {
    title: "Intel Core i5-12400F",
    current_price: 21500000,
    price_source: "automatic" as const,
    image_url: "https://img/app.webp",
    torob_product_id: "e574cfea-f9ae-4acc-8f42-0008270884fe",
    fetched_at: "2026-08-18T00:00:00.000Z",
    last_success_at: "2026-08-18T00:00:00.000Z",
    sync_status: "active" as const,
    updated_at: "2026-08-18T00:00:00.000Z",
  };

  it("maps a DB row into a catalog overlay", () => {
    const overlay = toOverlay(row);
    expect(overlay).toMatchObject({
      title: row.title,
      price: row.current_price,
      priceSource: "automatic",
      image: row.image_url,
      syncStatus: "active",
    });
  });

  it("falls back to never status when sync_status is null", () => {
    const overlay = toOverlay({ ...row, sync_status: null });
    expect(overlay.syncStatus).toBe("never");
  });

  it("merges a static product with an overlay, preferring overlay title and image", () => {
    const cpu = getStaticProduct("cpu", 3)!;
    const overlay: CatalogOverlay = {
      title: "پردازنده Core i5-12400F",
      price: 21500000,
      priceSource: "automatic",
      image: "https://img/torob.webp",
      torobProductId: "e574cfea-f9ae-4acc-8f42-0008270884fe",
      fetchedAt: null,
      lastSuccessAt: null,
      syncStatus: "active",
      updatedAt: null,
    };
    const merged = mergeCatalogProduct("cpu", cpu, overlay);
    expect(merged.id).toBe(3);
    expect(merged.title).toBe("پردازنده Core i5-12400F");
    expect(merged.image).toBe("https://img/torob.webp");
    expect(merged.price).toBe(21500000);
    expect(merged.torobProductId).toBe("e574cfea-f9ae-4acc-8f42-0008270884fe");
    expect(merged.torobUrl).toBe(cpu.torobUrl);
  });

  it("falls back to static name and image when the overlay is empty", () => {
    const cpu = getStaticProduct("cpu", 3)!;
    const merged = mergeCatalogProduct("cpu", cpu, {
      title: null,
      price: null,
      priceSource: null,
      image: null,
      torobProductId: null,
      fetchedAt: null,
      lastSuccessAt: null,
      syncStatus: "never",
      updatedAt: null,
    });
    expect(merged.title).toBe(cpu.name);
    expect(merged.price).toBeNull();
    expect(merged.image).toBe(cpu.image);
  });
});
