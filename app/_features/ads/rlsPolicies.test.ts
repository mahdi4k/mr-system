import fs from "node:fs";
import path from "node:path";

describe("Rigora advertisement RLS migration", () => {
  const migration = fs.readFileSync(
    path.join(
      process.cwd(),
      "supabase/migrations/20260809000000_initial_rigora.sql",
    ),
    "utf8",
  );

  it("enables RLS on every user-owned table", () => {
    expect(migration).toContain(
      "alter table public.profiles enable row level security",
    );
    expect(migration).toContain(
      "alter table public.ads enable row level security",
    );
    expect(migration).toContain(
      "alter table public.ad_images enable row level security",
    );
  });

  it("checks the authenticated owner for ad writes", () => {
    expect(migration).toContain(
      "with check ((select auth.uid()) = user_id and status = 'pending')",
    );
    expect(migration).toContain("using ((select auth.uid()) = user_id)");
  });

  it("only exposes published ads or an owner's own ads", () => {
    expect(migration).toContain(
      "status = 'published' or (select auth.uid()) = user_id",
    );
  });

  it("does not contain a service-role credential", () => {
    expect(migration.toLowerCase()).not.toContain("service_role");
  });

  it("requires an owned ad for storage uploads", () => {
    expect(migration).toContain("ads.id::text = (storage.foldername(name))[2]");
  });

  it("reserves moderation changes for administrators", () => {
    expect(migration).toContain("protect_ad_moderation_fields");
    expect(migration).toContain("Administrators update all ads");
  });
});
