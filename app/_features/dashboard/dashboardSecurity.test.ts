import fs from "node:fs";
import path from "node:path";

describe("dashboard production safeguards", () => {
  const dashboardLayout = fs.readFileSync(
    path.join(process.cwd(), "app/(routes)/dashboard/layout.tsx"),
    "utf8",
  );
  const proxy = fs.readFileSync(
    path.join(process.cwd(), "app/_lib/supabase/proxy.ts"),
    "utf8",
  );
  const legacyLayout = fs.readFileSync(
    path.join(process.cwd(), "app/(routes)/dashboard/(pcParts)/layout.tsx"),
    "utf8",
  );

  it("checks trusted admin metadata in both proxy and server layout", () => {
    expect(proxy).toContain('user.app_metadata.role !== "admin"');
    expect(dashboardLayout).toContain('user.app_metadata.role !== "admin"');
  });

  it("redirects unauthenticated dashboard requests to login", () => {
    expect(dashboardLayout).toContain('redirect("/login?next=/dashboard")');
  });

  it("marks non-persistent catalog administration as legacy", () => {
    expect(legacyLayout).toContain("ابزار قدیمی کاتالوگ");
    expect(legacyLayout).toContain("در Supabase ذخیره نمی‌شود");
  });
});
