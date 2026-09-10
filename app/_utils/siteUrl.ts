/**
 * Central helper for resolving the canonical production URL of the site.
 *
 * IMPORTANT: This must NEVER fall back to "http://localhost:3000" in a
 * production build. The site is deployed on Vercel where the
 * NEXT_PUBLIC_SITE_URL env var may not be configured — previously that made
 * robots.txt / sitemap.xml / og:url resolve to the deployment URL
 * (mr-system-rho.vercel.app), which caused Google to display "Vercel" as the
 * site name in search results.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL (set locally and in production)
 *  2. VERCEL_PROJECT_PRODUCTION_URL (auto-provided by Vercel for the
 *     production domain, e.g. "www.rigora.ir")
 *  3. PRODUCTION_SITE_URL constant
 *
 * Returns the URL without a trailing slash, e.g. "https://www.rigora.ir".
 */
export const PRODUCTION_SITE_URL = "https://www.rigora.ir";

export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    PRODUCTION_SITE_URL;
  const withScheme = raw.startsWith("http") ? raw : `https://${raw}`;
  return withScheme.replace(/\/+$/, "");
}
