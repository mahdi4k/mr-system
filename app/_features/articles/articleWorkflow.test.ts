import fs from "node:fs";
import path from "node:path";
import { getArticleRange } from "./data";

describe("article workflow", () => {
  it.each([
    [1, 10, { from: 0, to: 9 }],
    [2, 10, { from: 10, to: 19 }],
    [6, 10, { from: 50, to: 59 }],
  ])("calculates the database range for page %s", (page, pageSize, range) => {
    expect(getArticleRange(page, pageSize)).toEqual(range);
  });

  it("provides an admin edit route and public blog entry route", () => {
    expect(
      fs.existsSync(
        path.join(
          process.cwd(),
          "app/(routes)/dashboard/(article)/articles/[id]/edit/page.tsx",
        ),
      ),
    ).toBe(true);
    const blogRoute = fs.readFileSync(
      path.join(process.cwd(), "app/(routes)/blog/page.tsx"),
      "utf8",
    );
    expect(blogRoute).toContain("<ArticleListing page={page} />");
  });

  it("batches sitemap article queries instead of limiting them to 50", () => {
    const sitemap = fs.readFileSync(
      path.join(process.cwd(), "app/sitemap.ts"),
      "utf8",
    );
    const articleData = fs.readFileSync(
      path.join(process.cwd(), "app/_features/articles/data.ts"),
      "utf8",
    );
    expect(sitemap).toContain("getArticleSitemapRows");
    expect(sitemap).toContain("article.updatedAt");
    expect(articleData).toContain("ARTICLE_BATCH_SIZE = 500");
    expect(sitemap).not.toContain("limit: 50");
  });
});
