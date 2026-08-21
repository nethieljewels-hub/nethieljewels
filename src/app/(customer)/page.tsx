import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import HomeClient from "@/app/(customer)/HomeClient";
import { formatCanonicalUrl, BRAND_NAME, BRAND_DESCRIPTION } from "@/utils/seo";

export const revalidate = 60; // Cache for 60s, revalidate in background

export const metadata: Metadata = {
  title: `${BRAND_NAME} | Traditional & Contemporary South Indian Jewelry`,
  description:
    "Shop authentic South Indian jewelry online at Nethiel Jewelry. Discover exquisite gold plated jhumkas, harams, bangles, bridal sets, and contemporary designs crafted with timeless elegance.",
  alternates: {
    canonical: formatCanonicalUrl("/"),
  },
  openGraph: {
    title: `${BRAND_NAME} | Traditional & Contemporary South Indian Jewelry`,
    description: BRAND_DESCRIPTION,
    url: formatCanonicalUrl("/"),
    siteName: BRAND_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | Traditional & Contemporary South Indian Jewelry`,
    description: BRAND_DESCRIPTION,
  },
};

export default async function HomePage() {
  const supabase = await createClient();

  // Run all queries in parallel for fastest possible load
  const [bannersRes, categoriesRes, productsRes, settingsRes, reelsRes] =
    await Promise.all([
      supabase
        .from("hero_banners")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true }),
      supabase
        .from("categories")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true }),
      supabase
        .from("products")
        .select("*, categories(name)")
        .eq("active", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("settings")
        .select("whatsapp, instagram, facebook, phone, email, address")
        .eq("id", true)
        .maybeSingle(),
      supabase
        .from("reels")
        .select("id, title, video_url, thumbnail_url, sort_order")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
    ]);

  return (
    <HomeClient
      initialBanners={bannersRes.data || []}
      initialCategories={categoriesRes.data || []}
      initialProducts={productsRes.data || []}
      settings={settingsRes.data ?? null}
      initialReels={reelsRes.data || []}
    />
  );
}
