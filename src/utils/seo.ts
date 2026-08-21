/**
 * Nethiel Jewelry - Centralized Technical SEO & Metadata Engine
 * Handles canonical URLs, dynamic Open Graph, Twitter cards,
 * intelligent fallbacks for Products/Categories, and structured data URLs.
 */

export const BRAND_NAME = "Nethiel Jewelry";
export const DEFAULT_PRODUCTION_URL = "https://nethieljewelry.in";

export const BRAND_TAGLINE = "Traditional Elegance & Contemporary Style";
export const BRAND_DESCRIPTION =
  "Nethiel Jewelry is a South Indian jewelry brand bringing together traditional elegance and contemporary style. Discover beautiful jhumkas, harams, necklaces, bangles, chokers, and festive bridal jewelry crafted for the modern woman.";

export const DEFAULT_KEYWORDS = [
  "South Indian jewelry",
  "traditional jewelry India",
  "gold plated jhumkas",
  "temple jewelry",
  "antique necklaces",
  "traditional harams",
  "contemporary Indian jewelry",
  "bridal jewelry South India",
  "designer bangles",
  "festive chokers",
  "Nethiel Jewelry",
  "handcrafted Indian jewelry",
];

/**
 * Returns the sanitized base website URL from environment variable
 * or defaults to production URL.
 */
export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim() !== "") {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return DEFAULT_PRODUCTION_URL;
}

/**
 * Formats a clean, absolute canonical URL for any route path.
 */
export function formatCanonicalUrl(path: string = ""): string {
  const baseUrl = getSiteUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath === "/" || cleanPath === "") {
    return baseUrl;
  }
  return `${baseUrl}${cleanPath.replace(/\/+$/, "")}`;
}

/**
 * Generates an SEO title for a product with fallback logic.
 */
export function generateProductSeoTitle(product: {
  title: string;
  seo_title?: string | null;
}): string {
  if (product.seo_title && product.seo_title.trim()) {
    const trimmed = product.seo_title.trim();
    return trimmed.includes(BRAND_NAME) ? trimmed : `${trimmed} | ${BRAND_NAME}`;
  }
  return `${product.title} | ${BRAND_NAME}`;
}

/**
 * Generates an SEO meta description for a product with fallback logic.
 */
export function generateProductSeoDescription(product: {
  title: string;
  description?: string | null;
  seo_description?: string | null;
}): string {
  if (product.seo_description && product.seo_description.trim()) {
    return product.seo_description.trim();
  }

  if (product.description && product.description.trim()) {
    const cleanDesc = product.description.replace(/\s+/g, " ").trim();
    if (cleanDesc.length <= 155) {
      return cleanDesc;
    }
    return `${cleanDesc.substring(0, 150)}... Shop now at ${BRAND_NAME}.`;
  }

  return `Shop the ${product.title} from ${BRAND_NAME}. Discover elegant South Indian inspired jewelry designed for festive occasions, weddings and everyday styling.`;
}

/**
 * Generates an SEO title for a category with fallback logic.
 */
export function generateCategorySeoTitle(category: {
  name: string;
  seo_title?: string | null;
}): string {
  if (category.seo_title && category.seo_title.trim()) {
    const trimmed = category.seo_title.trim();
    return trimmed.includes(BRAND_NAME) ? trimmed : `${trimmed} | ${BRAND_NAME}`;
  }
  return `${category.name} Collection | Traditional South Indian Jewelry | ${BRAND_NAME}`;
}

/**
 * Generates an SEO meta description for a category with fallback logic.
 */
export function generateCategorySeoDescription(category: {
  name: string;
  seo_description?: string | null;
}): string {
  if (category.seo_description && category.seo_description.trim()) {
    return category.seo_description.trim();
  }

  return `Explore handcrafted ${category.name.toLowerCase()} at ${BRAND_NAME}. Discover traditional South Indian designs, bridal pieces, and contemporary styles crafted with premium elegance.`;
}
