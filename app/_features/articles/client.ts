import imageCompression from "browser-image-compression";
import { createClient } from "../../_lib/supabase/client";
import { getArticleImageUpdate } from "./imageUpdate";
import type { ArticleInput, UpdateArticleInput } from "./types";

async function prepareFeaturedImage(file: File): Promise<File> {
  if (file.size <= 600 * 1024 && file.type === "image/webp") return file;
  const compressed = await imageCompression(file, {
    fileType: "image/webp",
    initialQuality: 0.84,
    maxSizeMB: 0.9,
    maxWidthOrHeight: 1800,
    useWebWorker: true,
  });
  return new File([compressed], `${file.name.replace(/\.[^.]+$/, "")}.webp`, {
    type: "image/webp",
  });
}

export async function createArticle(input: ArticleInput): Promise<string> {
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) throw new Error("نشست مدیریتی معتبر نیست.");

  let imagePath: string | null = null;
  let imageUrl: string | null = null;
  try {
    if (input.featuredImage) {
      const image = await prepareFeaturedImage(input.featuredImage);
      imagePath = `${userData.user.id}/${crypto.randomUUID()}.webp`;
      const { error } = await supabase.storage
        .from("article-images")
        .upload(imagePath, image, {
          cacheControl: "31536000",
          contentType: image.type,
        });
      if (error) throw error;
      imageUrl = supabase.storage.from("article-images").getPublicUrl(imagePath)
        .data.publicUrl;
    }

    const { data, error } = await supabase
      .from("articles")
      .insert({
        author_id: userData.user.id,
        category_name: input.categoryName.trim(),
        category_slug: input.categorySlug.trim(),
        content: input.content.trim(),
        excerpt: input.excerpt.trim(),
        featured_image_path: imagePath,
        featured_image_url: imageUrl,
        slug: input.slug.trim(),
        status: input.status,
        title: input.title.trim(),
      })
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  } catch (error) {
    if (imagePath) {
      await supabase.storage.from("article-images").remove([imagePath]);
    }
    throw error;
  }
}

export async function updateArticle(
  id: string,
  input: UpdateArticleInput,
): Promise<{ imageCleanupFailed: boolean }> {
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) throw new Error("نشست مدیریتی معتبر نیست.");

  let newImagePath: string | null = null;
  let newImageUrl: string | null = null;
  try {
    if (input.featuredImage) {
      const image = await prepareFeaturedImage(input.featuredImage);
      newImagePath = `${userData.user.id}/${crypto.randomUUID()}.webp`;
      const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(newImagePath, image, {
          cacheControl: "31536000",
          contentType: image.type,
        });
      if (uploadError) throw uploadError;
      newImageUrl = supabase.storage
        .from("article-images")
        .getPublicUrl(newImagePath).data.publicUrl;
    }

    const imageUpdate = getArticleImageUpdate(
      newImagePath,
      newImageUrl,
      input.removeFeaturedImage,
    );
    const { error: updateError } = await supabase
      .from("articles")
      .update({
        category_name: input.categoryName.trim(),
        category_slug: input.categorySlug.trim(),
        content: input.content.trim(),
        excerpt: input.excerpt.trim(),
        slug: input.slug.trim(),
        status: input.status,
        title: input.title.trim(),
        ...imageUpdate,
      })
      .eq("id", id)
      .select("id")
      .single();
    if (updateError) throw updateError;
  } catch (error) {
    if (newImagePath) {
      await supabase.storage.from("article-images").remove([newImagePath]);
    }
    throw error;
  }

  const shouldRemoveOldImage =
    input.currentFeaturedImagePath &&
    (input.featuredImage || input.removeFeaturedImage);
  if (!shouldRemoveOldImage) return { imageCleanupFailed: false };

  const { error: cleanupError } = await supabase.storage
    .from("article-images")
    .remove([input.currentFeaturedImagePath!]);
  return { imageCleanupFailed: Boolean(cleanupError) };
}
