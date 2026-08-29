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
  let bannersData: any[] = [];
  let categoriesData: any[] = [];
  let productsData: any[] = [];
  let settingsData: any = null;
  let reelsData: any[] = [];
  let testimonialsData: any[] = [];

  try {
    const supabase = await createClient();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("SSR timeout")), 2000)
    );

    const dataPromise = Promise.all([
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
      supabase
        .from("testimonials")
        .select("*")
        .eq("active", true)
        .order("display_order", { ascending: true }),
    ]);

    const results: any = await Promise.race([dataPromise, timeoutPromise]);
    bannersData = results[0]?.data || [];
    categoriesData = results[1]?.data || [];
    productsData = results[2]?.data || [];
    settingsData = results[3]?.data || null;
    reelsData = results[4]?.data || [];
    testimonialsData = results[5]?.data || [];
  } catch {
    // If SSR query hangs or times out, return instantly & let DataContext fetch on client
  }

  return (
    <HomeClient
      initialBanners={bannersData}
      initialCategories={categoriesData}
      initialProducts={productsData}
      settings={settingsData}
      initialReels={reelsData}
      initialTestimonials={testimonialsData}
    />
  );
}
