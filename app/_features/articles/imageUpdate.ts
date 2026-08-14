interface ArticleImageUpdate {
  featured_image_path?: string | null;
  featured_image_url?: string | null;
}

export function getArticleImageUpdate(
  newImagePath: string | null,
  newImageUrl: string | null,
  removeFeaturedImage: boolean,
): ArticleImageUpdate {
  if (newImagePath && newImageUrl) {
    return {
      featured_image_path: newImagePath,
      featured_image_url: newImageUrl,
    };
  }
  return removeFeaturedImage
    ? { featured_image_path: null, featured_image_url: null }
    : {};
}
