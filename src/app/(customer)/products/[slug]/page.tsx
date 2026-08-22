import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ProductDetailsClient from "@/app/(customer)/products/[slug]/ProductDetailsClient";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import BreadcrumbJsonLd, { BreadcrumbItem } from "@/components/seo/BreadcrumbJsonLd";
import type { Metadata } from "next";
import {
  formatCanonicalUrl,
  generateProductSeoTitle,
  generateProductSeoDescription,
  BRAND_NAME,
} from "@/utils/seo";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("title, description, seo_title, seo_description, images, categories(name)")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (!product) {
    notFound();
  }

  const title = generateProductSeoTitle(product);
  const description = generateProductSeoDescription(product);
  const canonicalUrl = formatCanonicalUrl(`/products/${slug}`);
  const ogImages =
    product.images && product.images.length > 0
      ? product.images.map((img: string) => ({
          url: img,
          alt: `${product.title} - ${BRAND_NAME}`,
        }))
      : [
          {
            url: "/images/logo-og.png",
            alt: `${product.title} - ${BRAND_NAME}`,
          },
        ];

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: BRAND_NAME,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images && product.images.length > 0 ? [product.images[0]] : ["/images/logo-og.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, categories(id, name, slug)")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (!product) {
    notFound();
  }

  // Fetch similar products in the same category (limit 4)
  const { data: recommended } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("active", true)
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(4);

  let finalRecommended = recommended || [];

  // Fallback to other active products if category is thin
  if (finalRecommended.length < 4) {
    const needed = 4 - finalRecommended.length;
    const excludeIds = [product.id, ...finalRecommended.map((p: { id: string }) => p.id)];
    const { data: fallback } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("active", true)
      .not("id", "in", `(${excludeIds.join(",")})`)
      .limit(needed);
    if (fallback) {
      finalRecommended = [...finalRecommended, ...fallback];
    }
  }

  // Ensure strict uniqueness by product ID
  const uniqueRecommendedMap = new Map<string, typeof finalRecommended[number]>();
  for (const item of finalRecommended) {
    if (item && (item as { id: string }).id) {
      uniqueRecommendedMap.set((item as { id: string }).id, item);
    }
  }
  finalRecommended = Array.from(uniqueRecommendedMap.values());

  // Breadcrumbs for SEO JSON-LD
  const categoryName = (product.categories as { name?: string })?.name || "Jewelry";
  const categorySlug = (product.categories as { slug?: string })?.slug;

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "Home", url: formatCanonicalUrl("/") },
    categorySlug
      ? { name: categoryName, url: formatCanonicalUrl(`/collections/${categorySlug}`) }
      : { name: "Shop", url: formatCanonicalUrl("/products") },
    { name: product.title, url: formatCanonicalUrl(`/products/${product.slug}`) },
  ];

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ProductDetailsClient
        product={product}
        recommendedProducts={finalRecommended}
      />
    </>
  );
}
