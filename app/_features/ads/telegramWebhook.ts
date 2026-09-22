const DEFAULT_CATEGORY_ID = 1;
const DEFAULT_PROVINCE_ID = 1;
const DEFAULT_CITY_ID = 1;

export interface ParsedTelegramAd {
  title: string;
  description: string;
  price: number | null;
  categoryId: number;
  provinceId: number;
  cityId: number;
}

export function extractPrice(text: string): number | null {
  // Matches numbers like 12,500,000 or 12500000 or ۱۲٬۵۰۰٬۰۰۰
  // Normalize Persian/Arabic digits to ASCII
  const normalized = text
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[،٬,]/g, "")
    .replace(/[^0-9]/g, " ");

  const numbers = normalized
    .split(/\s+/)
    .map((n) => Number(n))
    .filter((n) => Number.isFinite(n) && n > 0);

  if (!numbers.length) return null;
  // Heuristic: pick the largest number that looks like a price (>= 1000)
  const candidates = numbers.filter((n) => n >= 1000);
  if (!candidates.length) return null;
  return Math.max(...candidates);
}

export function parseTelegramAdContent(rawText: string): ParsedTelegramAd {
  const text = rawText.trim();
  // Title: first non-empty line, truncated to 120 chars. Must be >=3 chars.
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let title = lines[0] || text.slice(0, 80);
  title = title.slice(0, 120).trim();
  if (title.length < 3) title = `${title} آگهی تلگرام`.slice(0, 120).trim();
  if (title.length < 3) title = "آگهی تلگرام";

  // Description: full text, must be 10-5000 chars. Pad if too short.
  let description = text;
  if (description.length < 10) {
    description = `${text}\n\nارسال شده از تلگرام`.trim();
  }
  if (description.length < 10) {
    description = `${description} - آگهی تلگرام`.padEnd(10, " ");
  }
  description = description.slice(0, 5000);

  const price = extractPrice(text);

  return {
    title,
    description,
    price,
    categoryId: DEFAULT_CATEGORY_ID,
    provinceId: DEFAULT_PROVINCE_ID,
    cityId: DEFAULT_CITY_ID,
  };
}

export interface TelegramFileInfo {
  filePath: string;
  fileUrl: string;
}

export async function getTelegramFileInfo(
  fileId: string,
  botToken: string,
): Promise<TelegramFileInfo> {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/getFile?file_id=${encodeURIComponent(fileId)}`,
    { signal: AbortSignal.timeout(10_000) },
  );
  const data = (await response.json()) as {
    ok: boolean;
    result?: { file_path: string };
    description?: string;
  };
  if (!response.ok || !data.ok || !data.result?.file_path) {
    throw new Error(
      data.description || `Telegram getFile failed: ${response.status}`,
    );
  }
  const filePath = data.result.file_path;
  const fileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
  return { filePath, fileUrl };
}

export async function downloadTelegramFile(fileUrl: string): Promise<Buffer> {
  const response = await fetch(fileUrl, {
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`Failed to download Telegram file: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export function getTelegramWebhookConfig(): {
  botToken: string;
  webhookSecret: string;
  ownerTelegramId: number;
  ownerUserId: string;
} {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TG_WEBHOOK_SECRET;
  // MY_TELEGRAM_ID is inbound allowlist; falls back to TELEGRAM_ADMIN_CHAT_ID if you use the same account for both directions
  const telegramIdRaw =
    process.env.MY_TELEGRAM_ID || process.env.TELEGRAM_ADMIN_CHAT_ID;
  const ownerUserId = process.env.TELEGRAM_OWNER_USER_ID;

  if (!botToken) throw new Error("Missing TELEGRAM_BOT_TOKEN");
  if (!webhookSecret) throw new Error("Missing TG_WEBHOOK_SECRET");
  if (!telegramIdRaw)
    throw new Error(
      "Missing MY_TELEGRAM_ID (or TELEGRAM_ADMIN_CHAT_ID as fallback)",
    );
  if (!ownerUserId) throw new Error("Missing TELEGRAM_OWNER_USER_ID");

  const ownerTelegramId = Number(telegramIdRaw);
  if (!Number.isFinite(ownerTelegramId))
    throw new Error("MY_TELEGRAM_ID must be numeric");

  return { botToken, webhookSecret, ownerTelegramId, ownerUserId };
}
