import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import ProductsClient from "@/app/(customer)/products/ProductsClient";
import { formatCanonicalUrl, BRAND_NAME } from "@/utils/seo";

export const revalidate = 0;

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
    // Set noindex on raw parameter filter variants if needed or keep indexed with canonical to /products
    robots: params.search
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const initialSearch = params.search || "";
  const initialProductCode = params.product_code || params.code || "";
  const supabase = await createClient();

  // Fetch active categories (First added first)
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("active", true)
    .order("created_at", { ascending: true });

  // Fetch active products
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("active", true)
    .order("created_at", { ascending: false });

  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-6 py-20 text-center text-sm sm:text-base font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest animate-pulse">
        Loading Collection...
      </div>
    }>
      <ProductsClient
        initialCategories={categories || []}
        initialProducts={products || []}
        initialSearch={initialSearch}
        initialProductCode={initialProductCode}
      />
    </Suspense>
  );
}
