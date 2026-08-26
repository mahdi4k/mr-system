import "server-only";

/**
 * Direct client for Torob's own internal product API (api.torob.com) —
 * the same network layer torob.com's frontend calls. Endpoints confirmed
 * against open-source clients (pypi: torob-integration, torob-client).
 *
 * MUST run server-side only — CORS blocks this from the browser.
 *
 * Known catch: api.torob.com's robots.txt disallows bots and anti-bot
 * protection has been hit before via this route. Keep traffic slow and
 * human-paced; fall back to Parse.bot manually for anything blocked.
 */

const BASE_URL = "https://api.torob.com";

// A generic fetch()/axios UA is one of the easiest bot signals to trip.
// Looking like an actual browser tab on torob.com costs nothing.
const HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/json",
  "Accept-Language": "fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7",
  Referer: "https://torob.com/",
  Origin: "https://torob.com",
};

export interface TorobSearchMatch {
  prk: string;
  searchId: string;
}

interface TorobSearchResponse {
  results?: Array<Record<string, unknown>>;
}

export interface TorobProductDetails {
  price?: number;
  min_price?: number;
  max_price?: number;
  image_url?: string;
  [key: string]: unknown;
}

export interface TorobValidatedProductDetails extends TorobProductDetails {
  price: number;
}

function validPrice(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0 &&
    Number.isInteger(value)
  );
}

async function torobGet<T>(
  path: string,
  params: Record<string, string | number>,
): Promise<T> {
  const url = new URL(path, BASE_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, { headers: HEADERS, cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Torob responded with status ${response.status} for ${path}`,
    );
  }

  return (await response.json()) as T;
}

/** Search Torob by free text. Mainly useful to mint a fresh search_id. */
export async function searchTorob(
  query: string,
  page = 0,
): Promise<TorobSearchMatch[]> {
  const data = await torobGet<TorobSearchResponse>("/v4/base-product/search/", {
    q: query,
    page,
  });

  return (data.results ?? [])
    .map((item) => {
      if (typeof item.more_info_url !== "string") return null;
      const moreInfoUrl = new URL(item.more_info_url, BASE_URL);
      const prk = moreInfoUrl.searchParams.get("prk");
      const searchId = moreInfoUrl.searchParams.get("search_id");
      if (!prk || !searchId) return null;
      return { prk, searchId };
    })
    .filter((match): match is TorobSearchMatch => match !== null);
}

export async function getTorobProductDetails(
  prk: string,
  searchId: string,
): Promise<TorobValidatedProductDetails> {
  const data = await torobGet<TorobProductDetails>(
    "/v4/base-product/details/",
    { prk, search_id: searchId },
  );

  const { price } = data;
  if (!validPrice(price)) {
    throw new Error("Torob product details returned an invalid price.");
  }

  return { ...data, price };
}

/**
 * Fetch details for a prk we already trust (e.g. stored torob_product_id).
 * The details endpoint requires a search_id tied to a recent search — mint
 * one by searching the product title first, then pair it with our prk.
 * Two upstream requests per call; keep callers paced.
 */
export async function getTorobProductDetailsForPriceRefresh(
  prk: string,
  title: string,
): Promise<TorobValidatedProductDetails> {
  const matches = await searchTorob(title);
  const searchId = matches[0]?.searchId;
  if (!searchId) {
    throw new Error("Torob search returned no usable search_id.");
  }
  return getTorobProductDetails(prk, searchId);
}
