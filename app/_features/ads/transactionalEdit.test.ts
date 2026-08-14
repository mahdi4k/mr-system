import fs from "node:fs";
import path from "node:path";

describe("transactional advertisement edits", () => {
  const migration = fs.readFileSync(
    path.join(
      process.cwd(),
      "supabase/migrations/20260814020000_transactional_ad_edits.sql",
    ),
    "utf8",
  );

  it("locks the owned advertisement before changing it", () => {
    expect(migration).toContain("and user_id = current_user_id");
    expect(migration).toContain("for update");
    expect(migration).toContain("security invoker");
  });

  it("updates metadata and image rows in one database function", () => {
    expect(migration).toContain("update public.ads");
    expect(migration).toContain("delete from public.ad_images");
    expect(migration).toContain("insert into public.ad_images");
  });

  it("returns obsolete storage paths only after validating replacements", () => {
    expect(migration).toContain("removed_storage_paths");
    expect(migration).toContain("jsonb_array_length(p_images) > 3");
    expect(migration).toContain(
      "image.storage_path not like current_user_id::text",
    );
  });

  it("allows only authenticated callers to execute the function", () => {
    expect(migration).toContain("from public, anon");
    expect(migration).toContain("to authenticated");
  });
});
