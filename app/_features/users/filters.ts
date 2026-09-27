/**
 * Strip PostgREST filter metacharacters so a search term can never reshape the
 * generated `or(...)` expression, and keep it inside a sane length.
 */
export function sanitizeUserSearch(raw: string | null): string {
  if (!raw) return "";
  return raw
    .replace(/[,()*%\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

/**
 * Read a bounded integer query parameter.
 *
 * An omitted parameter must fall back to the caller's default. `Number(null)`
 * and `Number("")` are both 0, which would otherwise pass the finite check and
 * clamp up to the minimum (a `perPage` of 1 instead of the real page size).
 */
export function clampQueryInt(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
): number {
  if (value === null) return fallback;
  const trimmed = value.trim();
  if (trimmed === "") return fallback;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.trunc(parsed), min), max);
}
