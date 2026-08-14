import fs from "node:fs";
import path from "node:path";

describe("PWA caching", () => {
  const config = fs.readFileSync(
    path.join(process.cwd(), "next.config.mjs"),
    "utf8",
  );
  const worker = fs.readFileSync(
    path.join(process.cwd(), "worker/index.ts"),
    "utf8",
  );

  it("does not runtime-cache pages, APIs, or authenticated data", () => {
    expect(config).toContain("cacheStartUrl: false");
    expect(config).toContain("dynamicStartUrl: false");
    expect(config).toContain("cacheOnFrontEndNav: false");
    expect(config).toContain("runtimeCaching: []");
    expect(config).toContain('"!worker-*.js"');
    expect(config).toContain('"!workbox-*.js"');
    expect(config).not.toContain('document: "/offline"');
  });

  it("removes caches created by earlier runtime-caching workers", () => {
    expect(worker).toContain('!cacheName.startsWith("workbox-precache")');
    expect(worker).toContain("caches.delete(cacheName)");
  });
});
