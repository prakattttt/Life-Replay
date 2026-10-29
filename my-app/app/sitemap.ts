import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return [];

  const baseUrl = new URL(siteUrl);
  const publicPages: Array<{
    path: string;
    lastModified: Date;
    changeFrequency: "weekly" | "monthly";
    priority: number;
  }> = [];

  return publicPages.map(({ path, ...page }) => ({
    url: new URL(path, baseUrl).toString(),
    ...page,
  }));
}
