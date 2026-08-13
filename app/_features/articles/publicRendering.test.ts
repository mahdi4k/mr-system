import { renderArticleContent } from "./data";

describe("public article rendering", () => {
  it("keeps supported rich text and removes unsafe markup", () => {
    expect(
      renderArticleContent(
        '<h2 style="text-align: center">عنوان</h2><script>alert(1)</script><a href="javascript:alert(1)">پیوند</a>',
      ),
    ).toBe(
      '<h2 style="text-align:center">عنوان</h2><a rel="noopener noreferrer">پیوند</a>',
    );
  });

  it("continues to render legacy plain text as paragraphs", () => {
    expect(renderArticleContent("پاراگراف اول\n\nپاراگراف دوم")).toBe(
      "<p>پاراگراف اول</p><p>پاراگراف دوم</p>",
    );
  });
});
