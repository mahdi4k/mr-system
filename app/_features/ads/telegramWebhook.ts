// Explicit fallbacks — these IDs are guaranteed to exist:
// category 1 = cpu (supabase/migrations/20260809000000_initial_rigora.sql:47),
// province 1 = آذربایجان شرقی (public/provinces.json:2), city 1 = اسکو (public/cities.json:1, province 1).
// Telegram forwards rarely contain structured category/location; we deliberately create as pending
// for moderation at /dashboard/ads rather than inventing IDs.
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

function normalizeDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

function parsePriceNumber(
  raw: string,
  keyword: string | undefined,
): number | null {
  // raw like "12,500,000" or "12.5" or "۱۲٬۵۰۰٬۰۰۰"
  // Keep decimal point, strip thousand separators (comma, Persian comma, Arabic thousands, space)
  const cleaned = raw.replace(/[,\s،٬]/g, "").trim();
  if (!cleaned) return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value <= 0) return null;

  const kw = (keyword || "").toLowerCase();
  if (kw.includes("میلیون")) {
    // "12 میلیون" or "12.5 میلیون" → 12 * 1_000_000
    return Math.round(value * 1_000_000);
  }
  return Math.round(value);
}

export function extractPrice(text: string): number | null {
  // Safer strategy: only extract numbers that are explicitly linked to price keywords.
  // This avoids misclassifying model numbers (12100), specs (16GB, 2400MHz, 550W, 75Hz) as price.
  const normalized = normalizeDigits(text).toLowerCase();
  const candidates: number[] = [];

  // Keyword before number: "قیمت: 12,500,000" , "price 120" , "12 میلیون" is captured via number-before-keyword but also via keyword-before
  const beforeRegex =
    /(?:قیمت|تومان|تومن|میلیون|price)\s*[:：\-–—]?\s*(\d+(?:[.,،٬\s]\d+)*)/gi;
  // Number before keyword: "12,500,000 تومان" , "12 میلیون تومان"
  const afterRegex =
    /(\d+(?:[.,،٬\s]\d+)*)\s*(?:قیمت|تومان|تومن|میلیون|price)/gi;

  let match: RegExpExecArray | null;

  // Collect numbers that appear after a price keyword
  beforeRegex.lastIndex = 0;
  while ((match = beforeRegex.exec(normalized)) !== null) {
    const rawNumber = match[1];
    // The keyword that preceded the number is inside the non-capturing group; re-extract it
    const full = match[0];
    const keywordMatch = /(قیمت|تومان|تومن|میلیون|price)/i.exec(full);
    const keyword = keywordMatch?.[1];
    const value = parsePriceNumber(rawNumber, keyword);
    if (value !== null) candidates.push(value);
    // Avoid infinite loop on zero-length
    if (match[0].length === 0) beforeRegex.lastIndex += 1;
  }

  // Collect numbers that appear before a price keyword
  afterRegex.lastIndex = 0;
  while ((match = afterRegex.exec(normalized)) !== null) {
    const rawNumber = match[1];
    const keywordMatch = /(قیمت|تومان|تومن|میلیون|price)/i.exec(match[0]);
    const keyword = keywordMatch?.[1];
    // For patterns like "12 میلیون" the keyword is میلیون → multiply
    // For "12,500,000 تومان" keyword is تومان → direct
    // Need to detect if the number was followed by میلیون specifically
    const afterNumberSegment = match[0].slice(
      match[0].indexOf(rawNumber) + rawNumber.length,
    );
    const keywordAfter =
      /(قیمت|تومان|تومن|میلیون|price)/i.exec(afterNumberSegment)?.[1] ||
      keyword;
    const value = parsePriceNumber(rawNumber, keywordAfter);
    if (value !== null) candidates.push(value);
    if (match[0].length === 0) afterRegex.lastIndex += 1;
  }

  if (candidates.length) {
    // Prioritize explicit price mentions. If multiple, choose the last (most likely intentional price)
    // which also handles "12 میلیون تومان" where both regexes may capture 12.
    return candidates[candidates.length - 1];
  }

  // No price keyword found → do not guess (prevents 12100, 2400, 550 etc. from being used as price)
  return null;
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
    // Never log botToken or fileId in full; only safe diagnostics
    const status = response.status;
    const contentType = response.headers.get("content-type");
    const desc = data.description || `Telegram getFile failed`;
    throw new Error(
      `${desc} (status=${status} content-type=${contentType ?? "unknown"})`,
    );
  }
  const filePath = data.result.file_path;
  const fileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
  return { filePath, fileUrl };
}

export interface TelegramDownloadResult {
  buffer: Buffer;
  contentType: string | null;
  status: number;
  byteLength: number;
}

export async function downloadTelegramFile(
  fileUrl: string,
): Promise<TelegramDownloadResult> {
  const response = await fetch(fileUrl, {
    signal: AbortSignal.timeout(15_000),
  });
  const contentType = response.headers.get("content-type");
  const status = response.status;
  if (!response.ok) {
    // Do not log fileUrl (contains bot token)
    throw new Error(
      `Failed to download Telegram file (status=${status} content-type=${contentType ?? "unknown"})`,
    );
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return {
    buffer,
    contentType,
    status,
    byteLength: buffer.length,
  };
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
