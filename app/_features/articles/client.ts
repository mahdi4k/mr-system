import imageCompression from "browser-image-compression";
import { createClient } from "../../_lib/supabase/client";
import type { ArticleInput } from "./types";

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
