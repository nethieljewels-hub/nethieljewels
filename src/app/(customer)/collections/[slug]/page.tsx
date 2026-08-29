import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import CollectionClient from "./CollectionClient";
import CollectionJsonLd from "@/components/seo/CollectionJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import type { Metadata } from "next";
import {
  formatCanonicalUrl,
  generateCategorySeoTitle,
  generateCategorySeoDescription,
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
    const { data: category } = await supabase
      .from("categories")
      .select("name, slug, seo_title, seo_description, image_url")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();

    if (!category) {
      return {
        title: `Collection | ${BRAND_NAME}`,
      };
    }

    const title = generateCategorySeoTitle(category);
    const description = generateCategorySeoDescription(category);
    const canonicalUrl = formatCanonicalUrl(`/collections/${slug}`);

    const ogImages = category.image_url
      ? [
          {
            url: category.image_url,
            alt: `${category.name} Collection - ${BRAND_NAME}`,
          },
        ]
      : [
          {
            url: "/images/logo-latest.png",
            alt: `${category.name} Collection - ${BRAND_NAME}`,
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
        images: category.image_url ? [category.image_url] : ["/images/logo-latest.png"],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return {
      title: `Collection | ${BRAND_NAME}`,
    };
  }
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (!category) {
    notFound();
  }

  let allCategories: any[] = [];
  let products: any[] = [];

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("SSR timeout")), 2000)
    );

    const dataPromise = Promise.all([
      supabase
        .from("categories")
        .select("id, name, slug, image_url")
        .eq("active", true)
        .order("created_at", { ascending: true }),
      supabase
        .from("products")
        .select("*, categories(name)")
        .eq("category_id", category.id)
        .eq("active", true)
        .order("created_at", { ascending: false }),
    ]);

    const results: any = await Promise.race([dataPromise, timeoutPromise]);
    allCategories = results[0]?.data || [];
    products = results[1]?.data || [];
  } catch {
    // If secondary queries timeout, let CollectionClient read from DataContext
  }

  const breadcrumbs = [
    { name: "Home", url: formatCanonicalUrl("/") },
    { name: "Collections", url: formatCanonicalUrl("/products") },
    { name: category.name, url: formatCanonicalUrl(`/collections/${category.slug}`) },
  ];

  return (
    <>
      <CollectionJsonLd category={category} products={products} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <CollectionClient
        category={category}
        products={products}
        allCategories={allCategories}
      />
    </>
  );
}
