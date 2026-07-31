import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://kiwipart.ir",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },

    {
      url: "https://kiwipart.ir/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
