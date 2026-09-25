import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient as createBrowserClient } from "../../_lib/supabase/client";
import type { Database } from "../../types/database.types";
import type {
  AdsFilters,
  AdsResponse,
  AdCreationProgress,
  CreateAdInput,
  Product,
  UpdateAdImagesInput,
  UpdateAdInput,
  UpdateAdResult,
} from "./types";

const AD_SELECT = `
  id,
  user_id,
  title,
  description,
  price,
  province_id,
  city_id,
  status,
  created_at,
  source,
  telegram_channel,
  telegram_channel_username,
  telegram_username,
  category:ad_categories!inner(id, name, value, icon),
  user:profiles!inner(id, display_name, phone),
  images:ad_images(url, sort_order)
`;

interface AdQueryRow {
  category: { icon: string; id: number; name: string; value: string };
  city_id: number;
  created_at: string;
  description: string;
  id: string;
  images: Array<{ sort_order: number; url: string }>;
  price: number | null;
  province_id: number;
  source: string | null;
  status: Product["status"];
  telegram_channel: string | null;
  telegram_channel_username: string | null;
  telegram_username: string | null;
  title: string;
  user: { display_name: string | null; id: string; phone: string | null };
  user_id: string;
}

function toProduct(row: AdQueryRow): Product {
  const images = [...(row.images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(({ url }) => url);

  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    description: row.description,
    category: row.category,
    user: {
      id: row.user.id,
      name: row.user.display_name || "کاربر ریگورا",
      phone: row.user.phone || "",
    },
    image: JSON.stringify(images),
    price: row.price?.toString() ?? "",
    created_at: row.created_at,
    status: row.status,
    city: row.city_id.toString(),
    ostan: row.province_id.toString(),
    source: row.source,
    telegram_channel: row.telegram_channel,
    telegram_channel_username: row.telegram_channel_username,
    telegram_username: row.telegram_username,
  };
}

export async function getAds(
  filters: AdsFilters = {},
  client: SupabaseClient<Database> = createBrowserClient(),
  ownerId?: string,
  includeAll = false,
): Promise<AdsResponse> {
  const page = Math.max(Number(filters.page) || 1, 1);
  const perPage = 12;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  let query = client
    .from("ads")
    .select(AD_SELECT, { count: "exact" })
    .range(from, to);

  if (ownerId) {
    query = query.eq("user_id", ownerId);
  } else if (!includeAll) {
    query = query.eq("status", "published");
  }

  if (filters.category) {
    query = query.eq("ad_categories.value", filters.category);
  }
  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }
  if (filters.price_from) {
    query = query.gte("price", Number(filters.price_from));
  }
  if (filters.price_to) {
    query = query.lte("price", Number(filters.price_to));
  }
  if (filters.ostan) {
    const provinceIds = filters.ostan
      .split(",")
      .map(Number)
      .filter(Number.isInteger);
    if (provinceIds.length) {
      query = query.in("province_id", provinceIds);
    }
  }
  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.sort === "price_asc") {
    query = query.order("price", { ascending: true, nullsFirst: false });
  } else if (filters.sort === "price_desc") {
    query = query.order("price", { ascending: false, nullsFirst: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;
  return {
    data: ((data ?? []) as unknown as AdQueryRow[]).map(toProduct),
    current_page: page,
    last_page: Math.max(Math.ceil(total / perPage), 1),
    per_page: perPage,
    total,
  };
}

export async function getAdById(
  id: string,
  client: SupabaseClient<Database>,
): Promise<Product | null> {
  const { data, error } = await client
    .from("ads")
    .select(AD_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? toProduct(data as unknown as AdQueryRow) : null;
}

export async function createAd(
  input: CreateAdInput,
  onProgress?: (progress: AdCreationProgress) => void,
): Promise<Product> {
  const client = createBrowserClient();
  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (authError || !user) {
    throw new Error("برای ثبت آگهی ابتدا وارد حساب کاربری شوید.");
  }
  if (input.images.length > 3) {
    throw new Error("حداکثر سه تصویر قابل بارگذاری است.");
  }

  onProgress?.({ stage: "creating", completed: 0, total: input.images.length });
  const { data: ad, error: insertError } = await client
    .from("ads")
    .insert({
      user_id: user.id,
      category_id: input.categoryId,
      city_id: input.cityId,
      description: input.description.trim(),
      price: input.price,
      province_id: input.provinceId,
      title: input.title.trim(),
    })
    .select("id")
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  const uploadedPaths: string[] = [];
  try {
    let completedUploads = 0;
    onProgress?.({
      stage: "uploading",
      completed: completedUploads,
      total: input.images.length,
    });
    const uploadResults = await Promise.allSettled(
      input.images.map(async (image, index) => {
        const extension = image.name.split(".").pop()?.toLowerCase() || "webp";
        const storagePath = `${user.id}/${ad.id}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await client.storage
          .from("ad-images")
          .upload(storagePath, image, {
            cacheControl: "31536000",
            contentType: image.type,
            upsert: false,
          });
        if (uploadError) throw uploadError;

        uploadedPaths.push(storagePath);
        completedUploads += 1;
        onProgress?.({
          stage: "uploading",
          completed: completedUploads,
          total: input.images.length,
        });
        const { data: publicUrl } = client.storage
          .from("ad-images")
          .getPublicUrl(storagePath);
        return {
          ad_id: ad.id,
          storage_path: storagePath,
          url: publicUrl.publicUrl,
          sort_order: index,
        };
      }),
    );
    const failedUpload = uploadResults.find(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    );
    if (failedUpload) throw failedUpload.reason;

    const imageRows = uploadResults.map(
      (result) =>
        (
          result as PromiseFulfilledResult<{
            ad_id: string;
            storage_path: string;
            url: string;
            sort_order: number;
          }>
        ).value,
    );

    if (imageRows.length) {
      onProgress?.({
        stage: "saving",
        completed: input.images.length,
        total: input.images.length,
      });
      const { error: imageError } = await client
        .from("ad_images")
        .insert(imageRows);
      if (imageError) {
        throw imageError;
      }
    }
  } catch (error) {
    if (uploadedPaths.length) {
      await client.storage.from("ad-images").remove(uploadedPaths);
    }
    await client.from("ads").delete().eq("id", ad.id);
    throw new Error(
      error instanceof Error ? error.message : "بارگذاری تصویر ناموفق بود.",
    );
  }

  const product = await getAdById(ad.id, client);
  if (!product) {
    throw new Error("آگهی ثبت شد اما بازیابی آن ناموفق بود.");
  }

  return product;
}

export async function updateAd(
  id: string,
  input: UpdateAdInput,
  imageUpdate?: UpdateAdImagesInput,
): Promise<UpdateAdResult> {
  const client = createBrowserClient();
  const uploadedPaths: string[] = [];
  let imageRows: Array<{
    sort_order: number;
    storage_path: string;
    url: string;
  }> | null = null;
  let updateCommitted = false;

  try {
    if (imageUpdate) {
      const {
        data: { user },
        error: authError,
      } = await client.auth.getUser();
      if (authError || !user) {
        throw new Error("برای ویرایش تصاویر ابتدا وارد حساب کاربری شوید.");
      }

      const { data: existingImages, error: readError } = await client
        .from("ad_images")
        .select("storage_path, url")
        .eq("ad_id", id)
        .order("sort_order");
      if (readError) throw readError;

      const existingByUrl = new Map(
        existingImages.map((image) => [image.url, image]),
      );
      const retainedImages = imageUpdate.retainedUrls.map((url) =>
        existingByUrl.get(url),
      );
      if (
        new Set(imageUpdate.retainedUrls).size !==
          imageUpdate.retainedUrls.length ||
        retainedImages.some((image) => !image) ||
        retainedImages.length + imageUpdate.newImages.length > 3
      ) {
        throw new Error("فهرست تصاویر آگهی معتبر نیست.");
      }

      const uploadResults = await Promise.allSettled(
        imageUpdate.newImages.map(async (image, index) => {
          const extension =
            image.name.split(".").pop()?.toLowerCase() || "webp";
          const storagePath = `${user.id}/${id}/${crypto.randomUUID()}.${extension}`;
          const { error: uploadError } = await client.storage
            .from("ad-images")
            .upload(storagePath, image, {
              cacheControl: "31536000",
              contentType: image.type,
              upsert: false,
            });
          if (uploadError) throw uploadError;
          uploadedPaths.push(storagePath);

          const { data: publicUrl } = client.storage
            .from("ad-images")
            .getPublicUrl(storagePath);
          return {
            sort_order: retainedImages.length + index,
            storage_path: storagePath,
            url: publicUrl.publicUrl,
          };
        }),
      );
      const failedUpload = uploadResults.find(
        (result): result is PromiseRejectedResult =>
          result.status === "rejected",
      );
      if (failedUpload) throw failedUpload.reason;

      imageRows = [
        ...retainedImages.map((image, index) => ({
          sort_order: index,
          storage_path: image!.storage_path,
          url: image!.url,
        })),
        ...uploadResults.map(
          (result) =>
            (
              result as PromiseFulfilledResult<{
                sort_order: number;
                storage_path: string;
                url: string;
              }>
            ).value,
        ),
      ];
    }

    const { data: removedPaths, error: updateError } = await client.rpc(
      "update_owned_ad",
      {
        p_ad_id: id,
        p_category_id: input.category_id,
        p_city_id: input.city_id,
        p_description: input.description,
        p_images: imageRows,
        p_price: input.price,
        p_province_id: input.province_id,
        p_title: input.title,
      },
    );
    if (updateError) throw updateError;
    updateCommitted = true;

    let storageCleanupFailed = false;
    if (removedPaths?.length) {
      const { error: storageError } = await client.storage
        .from("ad-images")
        .remove(removedPaths);
      storageCleanupFailed = Boolean(storageError);
    }

    const product = await getAdById(id, client);
    if (!product) {
      throw new Error("آگهی یافت نشد.");
    }
    return { product, storageCleanupFailed };
  } catch (error) {
    if (!updateCommitted && uploadedPaths.length) {
      await client.storage.from("ad-images").remove(uploadedPaths);
    }
    throw new Error(
      error instanceof Error ? error.message : "ویرایش آگهی ناموفق بود.",
    );
  }
}

export async function moderateAd(
  id: string,
  status: "published" | "rejected",
): Promise<void> {
  const client = createBrowserClient();
  const { data, error } = await client
    .from("ads")
    .update({ status })
    .eq("id", id)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "ویرایش وضعیت آگهی ناموفق بود.");
  }
}

export async function updateOwnerAdStatus(
  id: string,
  status: "sold" | "archived",
): Promise<void> {
  const client = createBrowserClient();
  const { data, error } = await client
    .from("ads")
    .update({ status })
    .eq("id", id)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      error?.message || "تغییر وضعیت آگهی ناموفق بود یا اجازه آن را ندارید.",
    );
  }
}

export async function deleteAd(id: string): Promise<void> {
  const client = createBrowserClient();
  const { data: images, error: imageError } = await client
    .from("ad_images")
    .select("storage_path")
    .eq("ad_id", id);

  if (imageError) {
    throw new Error(imageError.message);
  }

  const { data: deleted, error } = await client
    .from("ads")
    .delete()
    .eq("id", id)
    .select("id")
    .single();
  if (error || !deleted) {
    throw new Error(
      error?.message || "آگهی یافت نشد یا اجازه حذف آن را ندارید.",
    );
  }

  const paths = images.map(({ storage_path }) => storage_path);
  if (paths.length) {
    const { error: storageError } = await client.storage
      .from("ad-images")
      .remove(paths);
    if (storageError) {
      throw new Error("آگهی حذف شد اما پاک‌سازی تصاویر ناموفق بود.");
    }
  }
}
