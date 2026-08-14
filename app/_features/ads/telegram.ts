interface TelegramAdMessageInput {
  adId: string;
  price: number | null;
  seller: string;
  siteUrl: string;
  title: string;
}

export function formatTelegramAdMessage({
  adId,
  price,
  seller,
  siteUrl,
  title,
}: TelegramAdMessageInput): string {
  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
  const formattedPrice =
    price === null ? "توافقی" : `${price.toLocaleString("fa-IR")} تومان`;

  return [
    "آگهی جدید در ریگورا",
    "",
    `عنوان: ${title}`,
    `قیمت: ${formattedPrice}`,
    "وضعیت: در انتظار بررسی",
    `فروشنده: ${seller}`,
    `شناسه: ${adId}`,
    "",
    "مشاهده آگهی:",
    `${normalizedSiteUrl}/ads/${adId}`,
    "",
    "مدیریت آگهی‌ها:",
    `${normalizedSiteUrl}/dashboard/ads`,
  ].join("\n");
}

export async function requestTelegramAdNotification(
  adId: string,
): Promise<boolean> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(`/api/ads/${adId}/notify`, {
        method: "POST",
      });
      if (response.ok) return true;
      if (response.status < 500) return false;
    } catch {
      // A second attempt handles brief network interruptions.
    }

    if (attempt === 0) {
      await new Promise((resolve) => setTimeout(resolve, 750));
    }
  }
  return false;
}
