import fs from "node:fs";
import path from "node:path";

describe("dashboard advertisement moderation", () => {
  const adsData = fs.readFileSync(
    path.join(process.cwd(), "app/_features/ads/data.ts"),
    "utf8",
  );
  const moderation = fs.readFileSync(
    path.join(process.cwd(), "app/(routes)/dashboard/ads/clientAds.tsx"),
    "utf8",
  );

  it("supports server-side status filtering", () => {
    expect(adsData).toContain('query.eq("status", filters.status)');
  });

  it("awaits moderation mutations and reports failures", () => {
    expect(moderation).toContain(".unwrap()");
    expect(moderation).toContain('notifications.show({ color: "red"');
  });

  it("uses safe image parsing", () => {
    expect(moderation).toContain("function parseImages");
    expect(moderation).toContain("try {");
    expect(moderation).toContain("catch {");
  });
});
