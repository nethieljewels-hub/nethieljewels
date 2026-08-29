import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import ProductsClient from "@/app/(customer)/products/ProductsClient";
import { formatCanonicalUrl, BRAND_NAME } from "@/utils/seo";

export const revalidate = 60; // ISR cache for 60s

interface ProductsPageProps {
  searchParams: Promise<{ search?: string; category?: string; product_code?: string; code?: string }>;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const canonicalUrl = formatCanonicalUrl("/products");

  let title = `All Jewelry Collections | Handcrafted South Indian Jewelry | ${BRAND_NAME}`;
  let description =
    "Explore the complete jewelry collection from Nethiel Jewelry. Discover traditional gold plated jhumkas, bridal harams, elegant necklaces, bangles, and everyday contemporary pieces.";

  if (params.search) {
    title = `Search results for "${params.search}" | ${BRAND_NAME}`;
    description = `Browse South Indian jewelry search results for "${params.search}" at ${BRAND_NAME}.`;
  }

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: params.search
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const initialSearch = params.search || "";
  const initialProductCode = params.product_code || params.code || "";
  
  let categoriesData: any[] = [];
  let productsData: any[] = [];

  try {
    const supabase = await createClient();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("SSR timeout")), 2000)
    );

    const dataPromise = Promise.all([
      supabase
        .from("categories")
        .select("id, name, slug")
        .eq("active", true)
        .order("created_at", { ascending: true }),
      supabase
        .from("products")
        .select("*, categories(name)")
        .eq("active", true)
        .order("created_at", { ascending: false }),
    ]);

    const results: any = await Promise.race([dataPromise, timeoutPromise]);
    categoriesData = results[0]?.data || [];
    productsData = results[1]?.data || [];
  } catch {
    // If SSR query hangs or times out, return instantly & let ProductsClient read from DataContext
  }

  return (
    <ProductsClient
      initialCategories={categoriesData}
      initialProducts={productsData}
      initialSearch={initialSearch}
      initialProductCode={initialProductCode}
    />
  );
}
