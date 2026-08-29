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

export const revalidate = 60; // ISR 60s cache

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const { data: product } = await supabase
      .from("products")
      .select("title, description, seo_title, seo_description, images, categories(name)")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();

    if (!product) {
      return {
        title: `Product | ${BRAND_NAME}`,
      };
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
              url: "/images/logo-latest.png",
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
        images: product.images && product.images.length > 0 ? [product.images[0]] : ["/images/logo-latest.png"],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return {
      title: `Product | ${BRAND_NAME}`,
    };
  }
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

  let finalRecommended: any[] = [];

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("SSR timeout")), 2000)
    );

    const recPromise = supabase
      .from("products")
      .select("*, categories(name)")
      .eq("active", true)
      .eq("category_id", product.category_id)
      .neq("id", product.id)
      .limit(4);

    const results: any = await Promise.race([recPromise, timeoutPromise]);
    finalRecommended = results?.data || [];
  } catch {
    // If recommended query hangs, let ProductDetailsClient fall back to DataContext
  }

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
