import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mprincloud.com";
  
  const routes = [
    "",
    "/neuro",
    "/ortho",
    "/dashboard",
    "/auth/login",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  return sitemapEntries;
}

