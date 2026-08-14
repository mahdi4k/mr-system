import { getArticleImageUpdate } from "./imageUpdate";

describe("article featured image updates", () => {
  it("keeps the current image when no action is requested", () => {
    expect(getArticleImageUpdate(null, null, false)).toEqual({});
  });

  it("clears both image columns when removal is requested", () => {
    expect(getArticleImageUpdate(null, null, true)).toEqual({
      featured_image_path: null,
      featured_image_url: null,
    });
  });

  it("replaces both image columns when a new image was uploaded", () => {
    expect(
      getArticleImageUpdate("user/new.webp", "https://cdn/new.webp", true),
    ).toEqual({
      featured_image_path: "user/new.webp",
      featured_image_url: "https://cdn/new.webp",
    });
  });
});
