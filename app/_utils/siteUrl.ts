/**
 * Central helper for resolving the canonical production URL of the site.
 *
 * Hardcoded to https://www.rigora.ir — never resolve from env or Vercel
 * headers, otherwise robots/sitemap/og:url leak *.vercel.app and Google
 * shows "Vercel" as the site name.
 *
 * Returns the URL without a trailing slash, e.g. "https://www.rigora.ir".
 */
export const PRODUCTION_SITE_URL = "https://www.rigora.ir";

// ponytail: hardcoded on purpose — env/Vercel fallbacks once leaked
// *.vercel.app into metadata/sitemap and Google showed "Vercel" as site name.
export function getSiteUrl(): string {
  return PRODUCTION_SITE_URL;
}
