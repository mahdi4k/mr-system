import "server-only";

const BASE_URL =
  "https://api.parse.bot/scraper/89fb9532-9c43-4bfe-8b83-a97933f4849c";

export interface ParseBotProductDetails {
  random_key: string;
  name1?: string;
  name2?: string;
  price: number;
  image_url?: string;
  min_price?: number;
  max_price?: number;
  availability?: boolean;
  variants?: unknown[];
  breadcrumbs?: unknown[];
  structural_specs?: Record<string, unknown>;
  products_info?: { count?: number };
  shop_text?: string;
}

export interface ParseBotSearchResult {
  random_key?: string;
  name1?: string;
  price?: number;
  image_url?: string;
  [key: string]: unknown;
}

function apiKey(): string {
  const key = process.env.PARSE_BOT_API_KEY;
  if (!key) {
    throw new Error(
      "PARSE_BOT_API_KEY is not configured in the server environment.",
    );
  }
  return key;
}

function validPrice(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0 &&
    Number.isInteger(value)
  );
}

async function request<T>(
  endpoint: string,
  body?: Record<string, unknown>,
): Promise<{ status: string; data: T }> {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey(),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Parse.bot responded with status ${response.status} for ${endpoint}`,
    );
  }

  const payload = (await response.json()) as {
    status?: unknown;
    data?: unknown;
  };

  if (payload.status !== "success" || payload.data === undefined) {
    throw new Error(`Parse.bot reported a non-success status for ${endpoint}`);
  }

  return payload as { status: string; data: T };
}

export async function getProductDetails(
  productUuid: string,
): Promise<ParseBotProductDetails> {
  const { data } = await request<ParseBotProductDetails>(
    "get_product_details",
    { product_uuid: productUuid },
  );

  if (!data || typeof data !== "object") {
    throw new Error("Parse.bot returned malformed product details.");
  }
  if (!data.random_key || typeof data.random_key !== "string") {
    throw new Error("Parse.bot product details are missing random_key.");
  }
  if (!validPrice(data.price)) {
    throw new Error("Parse.bot product details returned an invalid price.");
  }

  return data;
}

export async function getProductDetailsForPriceRefresh(
  productUuid: string,
): Promise<{ random_key: string; price: number }> {
  const data = await getProductDetails(productUuid);
  return { random_key: data.random_key, price: data.price };
}

export async function searchProducts(
  query: string,
  options: {
    page?: number;
    sort?: string;
    categoryId?: number;
  } = {},
): Promise<{
  results: ParseBotSearchResult[];
  count?: number;
  has_more?: boolean;
}> {
  const params = new URLSearchParams();
  if (options.page !== undefined) params.set("page", String(options.page));
  if (options.sort) params.set("sort", options.sort);
  if (query) params.set("query", query);
  if (options.categoryId !== undefined) {
    params.set("category_id", String(options.categoryId));
  }

  const url = `${BASE_URL}/search_products?${params.toString()}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Parse.bot search_products returned status ${response.status}`,
    );
  }

  const payload = (await response.json()) as {
    status?: unknown;
    results?: unknown;
    count?: unknown;
    has_more?: unknown;
    data?: unknown;
  };

  if (payload.status !== "success") {
    throw new Error("Parse.bot search_products reported a non-success status.");
  }

  const results = (
    Array.isArray(payload.results)
      ? payload.results
      : (payload.data as unknown) && Array.isArray(payload.data as unknown[])
        ? (payload.data as unknown[])
        : []
  ) as ParseBotSearchResult[];

  return {
    results,
    count: typeof payload.count === "number" ? payload.count : undefined,
    has_more:
      typeof payload.has_more === "boolean" ? payload.has_more : undefined,
  };
}
