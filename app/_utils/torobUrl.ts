const TOROB_UUID_PATTERN =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

/**
 * Extract the Torob product UUID from either a bare UUID or a full Torob URL
 * such as https://torob.com/p/<uuid>/slug/ . Returns null when no UUID is found.
 */
export function torobProductIdFromUrl(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  const match = value.match(TOROB_UUID_PATTERN);
  return match ? match[0].toLowerCase() : null;
}

/**
 * Convert any supported ref (bare uuid or full torob URL) into a clean uuid.
 */
export function toTorobProductId(
  value: string | null | undefined,
): string | null {
  return torobProductIdFromUrl(value);
}
