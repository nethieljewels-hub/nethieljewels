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

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("name, slug, seo_title, seo_description, image_url")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (!category) {
    notFound();
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

  // Fetch all active categories for cross-navigation
  const { data: allCategories } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .eq("active", true)
    .order("created_at", { ascending: true });

  // Fetch products in this category
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("category_id", category.id)
    .eq("active", true)
    .order("created_at", { ascending: false });

  const breadcrumbs = [
    { name: "Home", url: formatCanonicalUrl("/") },
    { name: "Collections", url: formatCanonicalUrl("/products") },
    { name: category.name, url: formatCanonicalUrl(`/collections/${category.slug}`) },
  ];

  return (
    <>
      <CollectionJsonLd category={category} products={products || []} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <CollectionClient
        category={category}
        products={products || []}
        allCategories={allCategories || []}
      />
    </>
  );
}
