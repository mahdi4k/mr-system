import { MetadataRoute } from "next";
import { getSiteUrl } from "./_utils/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/dashboard/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
