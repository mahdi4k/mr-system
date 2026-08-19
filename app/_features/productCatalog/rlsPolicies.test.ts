import fs from "node:fs";
import path from "node:path";

describe("Rigora catalog price-sync migrations", () => {
  const catalogMigration = fs.readFileSync(
    path.join(
      process.cwd(),
      "supabase/migrations/20260816000000_catalog_price_sync.sql",
    ),
    "utf8",
  );
  const uniqueMigration = fs.readFileSync(
    path.join(
      process.cwd(),
      "supabase/migrations/20260817000000_match_candidate_unique.sql",
    ),
    "utf8",
  );

  it("keeps catalog content publicly readable", () => {
    expect(catalogMigration).toContain("Catalog content is publicly readable");
  });

  it("reserves all catalog writes for administrators", () => {
    expect(catalogMigration).toContain("Administrators insert catalog content");
    expect(catalogMigration).toContain("Administrators update catalog content");
    expect(catalogMigration).toContain("app_metadata");
  });

  it("protects product image writes in the product-images bucket", () => {
    expect(catalogMigration).toContain("Administrators upload product images");
    expect(catalogMigration).toContain("bucket_id = 'product-images'");
  });

  it("introduces immutable audit history for admin edits", () => {
    expect(catalogMigration).toContain("catalog_audit_history");
    expect(catalogMigration).toContain("audit_catalog_content");
  });

  it("adds a unique constraint so match candidates upsert deterministically", () => {
    expect(uniqueMigration).toContain("torob_match_candidates");
    expect(uniqueMigration).toContain("unique index");
  });
});
