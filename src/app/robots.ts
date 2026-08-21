import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/utils/seo";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/products",
          "/products/",
          "/collections",
          "/collections/",
          "/about",
          "/contact",
          "/images/",
          "/icon.png",
          "/apple-icon.png",
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/api",
          "/api/",
          "/cart",
          "/cart/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
