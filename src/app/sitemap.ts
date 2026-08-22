import type { MetadataRoute } from "next";
import { supabase } from "@/services/supabase";
import { getSiteUrl } from "@/utils/seo";

export const revalidate = 3600; // Cache and revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  // Static Core Indexable Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/jewellery-care`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping-and-delivery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/returns-and-exchange`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cancellation-and-refund`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/grievance-redressal`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic Category / Collection Pages from Supabase
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, updated_at")
    .eq("active", true)
    .order("created_at", { ascending: true });

  const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map((cat: { slug: string; updated_at?: string }) => ({
    url: `${baseUrl}/collections/${cat.slug}`,
    lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // Dynamic Active Product Detail Pages from Supabase
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("active", true)
    .order("created_at", { ascending: false });

  const productRoutes: MetadataRoute.Sitemap = (products || []).map((prod: { slug: string; updated_at?: string }) => ({
    url: `${baseUrl}/products/${prod.slug}`,
    lastModified: prod.updated_at ? new Date(prod.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
