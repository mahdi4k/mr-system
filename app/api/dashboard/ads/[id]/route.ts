import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../_lib/supabase/admin";
import { getAdminForSession } from "../../../../_lib/supabase/adminAuth";
import type { Database } from "../../../../types/database.types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

// GET single ad for admin dashboard (bypasses RLS, returns any ad)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminForSession();
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ message: "Invalid ad ID" }, { status: 400 });
  }

  const { data: ad, error } = await admin
    .from("ads")
    .select(
      "id, user_id, title, description, price, province_id, city_id, category_id, status, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  if (!ad) {
    return NextResponse.json({ message: "Ad not found" }, { status: 404 });
  }

  const { data: images } = await admin
    .from("ad_images")
    .select("url, storage_path, sort_order")
    .eq("ad_id", id)
    .order("sort_order");

  const { data: category } = await admin
    .from("ad_categories")
    .select("id, name, value, icon")
    .eq("id", ad.category_id)
    .maybeSingle();

  return NextResponse.json({
    ad: {
      ...ad,
      category: category ?? {
        id: ad.category_id,
        name: "",
        value: "",
        icon: "",
      },
      images: images ?? [],
    },
  });
}

// PATCH update any ad as admin (all fields + images)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminForSession();
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ message: "Invalid ad ID" }, { status: 400 });
  }

  // Load existing ad to get owner for storage path and to validate
  const { data: existingAd, error: loadError } = await admin
    .from("ads")
    .select("id, user_id")
    .eq("id", id)
    .maybeSingle();

  if (loadError) {
    return NextResponse.json({ message: loadError.message }, { status: 500 });
  }
  if (!existingAd) {
    return NextResponse.json({ message: "Ad not found" }, { status: 404 });
  }

  const ownerId = existingAd.user_id;

  let title: string | null = null;
  let description: string | null = null;
  let price: number | null = null;
  let hasPrice = false;
  let categoryId: number | null = null;
  let provinceId: number | null = null;
  let cityId: number | null = null;
  let retainedUrls: string[] | null = null;
  let newFiles: File[] = [];

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    title = (formData.get("title") as string | null)?.trim() ?? null;
    description =
      (formData.get("description") as string | null)?.trim() ?? null;
    const priceRaw = formData.get("price") as string | null;
    if (priceRaw !== null) {
      hasPrice = true;
      const trimmed = priceRaw.trim();
      price = trimmed === "" ? null : Number(trimmed);
      if (price !== null && (!Number.isFinite(price) || price < 0)) {
        return NextResponse.json(
          { message: "قیمت معتبر نیست" },
          { status: 400 },
        );
      }
    }
    const catRaw = formData.get("category_id") as string | null;
    if (catRaw !== null) categoryId = Number(catRaw);
    const provRaw = formData.get("province_id") as string | null;
    if (provRaw !== null) provinceId = Number(provRaw);
    const cityRaw = formData.get("city_id") as string | null;
    if (cityRaw !== null) cityId = Number(cityRaw);

    const retainedRaw = formData.get("retainedUrls") as string | null;
    if (retainedRaw) {
      try {
        const parsed = JSON.parse(retainedRaw) as unknown;
        if (Array.isArray(parsed)) {
          retainedUrls = parsed.filter(
            (x): x is string => typeof x === "string",
          );
        }
      } catch {
        return NextResponse.json(
          { message: "retainedUrls is not valid JSON" },
          { status: 400 },
        );
      }
    }
    newFiles = formData
      .getAll("newImages")
      .filter((v): v is File => v instanceof File && v.size > 0);
  } else {
    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    if (!body) {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 },
      );
    }
    if (typeof body.title === "string") title = body.title.trim();
    if (typeof body.description === "string")
      description = body.description.trim();
    if ("price" in body) {
      hasPrice = true;
      if (body.price === null || body.price === "") price = null;
      else if (typeof body.price === "number") price = body.price;
      else if (typeof body.price === "string") {
        const n = body.price.trim() === "" ? null : Number(body.price);
        price = n;
      }
    }
    if (typeof body.category_id === "number") categoryId = body.category_id;
    if (typeof body.province_id === "number") provinceId = body.province_id;
    if (typeof body.city_id === "number") cityId = body.city_id;
    if (Array.isArray(body.retainedUrls)) {
      retainedUrls = body.retainedUrls.filter(
        (x): x is string => typeof x === "string",
      );
    }
  }

  // Validate at least one field to update
  if (
    title === null &&
    description === null &&
    !hasPrice &&
    categoryId === null &&
    provinceId === null &&
    cityId === null &&
    retainedUrls === null &&
    newFiles.length === 0
  ) {
    return NextResponse.json(
      { message: "No fields to update" },
      { status: 400 },
    );
  }

  // Validate fields if provided
  if (title !== null && (title.length < 3 || title.length > 120)) {
    return NextResponse.json(
      { message: "عنوان باید بین ۳ تا ۱۲۰ نویسه باشد" },
      { status: 400 },
    );
  }
  if (
    description !== null &&
    (description.length < 10 || description.length > 5000)
  ) {
    return NextResponse.json(
      { message: "توضیحات باید بین ۱۰ تا ۵۰۰۰ نویسه باشد" },
      { status: 400 },
    );
  }

  // Handle images if requested
  let imageRows: Array<{
    storage_path: string;
    url: string;
    sort_order: number;
  }> | null = null;
  const uploadedPaths: string[] = [];
  let shouldUpdateImages = retainedUrls !== null || newFiles.length > 0;

  if (shouldUpdateImages) {
    // Normalize retainedUrls to array (if null, means no change? but we treat null as not provided, so empty array if explicitly provided)
    if (retainedUrls === null) retainedUrls = [];

    const { data: existingImages, error: readError } = await admin
      .from("ad_images")
      .select("storage_path, url")
      .eq("ad_id", id)
      .order("sort_order");

    if (readError) {
      return NextResponse.json({ message: readError.message }, { status: 500 });
    }

    const existingByUrl = new Map(
      (existingImages ?? []).map((img) => [img.url, img]),
    );
    const retained = retainedUrls.map((url) => existingByUrl.get(url));

    if (
      new Set(retainedUrls).size !== retainedUrls.length ||
      retained.some((v) => !v) ||
      retained.length + newFiles.length > 3
    ) {
      return NextResponse.json(
        { message: "فهرست تصاویر معتبر نیست. حداکثر ۳ تصویر." },
        { status: 400 },
      );
    }

    // Upload new files to owner's folder (important for storage RLS and consistency)
    const uploadResults = await Promise.allSettled(
      newFiles.map(async (file, index) => {
        const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
        const storagePath = `${ownerId}/${id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await admin.storage
          .from("ad-images")
          .upload(storagePath, file, {
            cacheControl: "31536000",
            contentType: file.type || "image/webp",
            upsert: false,
          });
        if (uploadError) throw uploadError;
        uploadedPaths.push(storagePath);
        const { data: publicUrl } = admin.storage
          .from("ad-images")
          .getPublicUrl(storagePath);
        return {
          storage_path: storagePath,
          url: publicUrl.publicUrl,
          sort_order: retained.length + index,
        };
      }),
    );

    const failed = uploadResults.find(
      (r): r is PromiseRejectedResult => r.status === "rejected",
    );
    if (failed) {
      if (uploadedPaths.length)
        await admin.storage.from("ad-images").remove(uploadedPaths);
      return NextResponse.json(
        { message: failed.reason?.message ?? "آپلود تصویر ناموفق بود" },
        { status: 500 },
      );
    }

    const newRows = uploadResults.map(
      (r) =>
        (
          r as PromiseFulfilledResult<{
            storage_path: string;
            url: string;
            sort_order: number;
          }>
        ).value,
    );

    imageRows = [
      ...retained.map((img, i) => ({
        storage_path: img!.storage_path,
        url: img!.url,
        sort_order: i,
      })),
      ...newRows,
    ];
  }

  // Build update object for ads table
  const updatePayload: Database["public"]["Tables"]["ads"]["Update"] = {};
  if (title !== null) updatePayload.title = title;
  if (description !== null) updatePayload.description = description;
  if (hasPrice) updatePayload.price = price;
  if (categoryId !== null) updatePayload.category_id = categoryId;
  if (provinceId !== null) updatePayload.province_id = provinceId;
  if (cityId !== null) updatePayload.city_id = cityId;

  // Update ads if any scalar field changed
  if (Object.keys(updatePayload).length > 0) {
    const { error: updateError } = await admin
      .from("ads")
      .update(updatePayload as never)
      .eq("id", id);
    if (updateError) {
      if (uploadedPaths.length)
        await admin.storage.from("ad-images").remove(uploadedPaths);
      return NextResponse.json(
        { message: updateError.message },
        { status: 500 },
      );
    }
  }

  // Update images if needed
  let removedPaths: string[] = [];
  if (imageRows !== null) {
    // Get existing to compute removed
    const { data: before } = await admin
      .from("ad_images")
      .select("storage_path")
      .eq("ad_id", id);
    const newPaths = new Set(imageRows.map((r) => r.storage_path));
    removedPaths = (before ?? [])
      .map((r) => r.storage_path)
      .filter((p) => !newPaths.has(p));

    const { error: deleteError } = await admin
      .from("ad_images")
      .delete()
      .eq("ad_id", id);
    if (deleteError) {
      if (uploadedPaths.length)
        await admin.storage.from("ad-images").remove(uploadedPaths);
      return NextResponse.json(
        { message: deleteError.message },
        { status: 500 },
      );
    }

    if (imageRows.length > 0) {
      const { error: insertError } = await admin.from("ad_images").insert(
        imageRows.map((r) => ({
          ad_id: id,
          storage_path: r.storage_path,
          url: r.url,
          sort_order: r.sort_order,
        })),
      );
      if (insertError) {
        if (uploadedPaths.length)
          await admin.storage.from("ad-images").remove(uploadedPaths);
        return NextResponse.json(
          { message: insertError.message },
          { status: 500 },
        );
      }
    }

    if (removedPaths.length) {
      // Best effort cleanup, don't fail the request if this fails
      await admin.storage.from("ad-images").remove(removedPaths);
    }
  }

  // Return updated ad
  const { data: updatedAd } = await admin
    .from("ads")
    .select(
      "id, user_id, title, description, price, province_id, city_id, category_id, status",
    )
    .eq("id", id)
    .maybeSingle();

  return NextResponse.json({ ok: true, ad: updatedAd, removedPaths });
}
