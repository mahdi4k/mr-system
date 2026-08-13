import fs from "node:fs";
import path from "node:path";

describe("Rigora article RLS migration", () => {
  const migration = fs.readFileSync(
    path.join(process.cwd(), "supabase/migrations/20260812020000_articles.sql"),
    "utf8",
  );

  it("publishes only published articles publicly", () => {
    expect(migration).toContain("Published articles are publicly readable");
    expect(migration).toContain("status = 'published'");
  });

  it("reserves all article writes for administrators", () => {
    expect(migration).toContain("Administrators create articles");
    expect(migration).toContain("Administrators update articles");
    expect(migration).toContain("Administrators delete articles");
    expect(migration).toContain("app_metadata");
  });

  it("protects article image writes", () => {
    expect(migration).toContain("Administrators upload article images");
    expect(migration).toContain("bucket_id = 'article-images'");
  });
});
