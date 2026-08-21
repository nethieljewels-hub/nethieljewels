import { createClient } from "@/utils/supabase/server";
import HomeClient from "@/app/(customer)/HomeClient";

export const revalidate = 60; // Cache for 60s, revalidate in background

export default async function HomePage() {
  const supabase = await createClient();

  // Run all queries in parallel for fastest possible load
  const [bannersRes, categoriesRes, productsRes, settingsRes, reelsRes, testimonialsRes] =
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
      supabase
        .from("testimonials")
        .select("*")
        .eq("active", true)
        .order("display_order", { ascending: true }),
    ]);

  return (
    <HomeClient
      initialBanners={bannersRes.data || []}
      initialCategories={categoriesRes.data || []}
      initialProducts={productsRes.data || []}
      settings={settingsRes.data ?? null}
      initialReels={reelsRes.data || []}
      initialTestimonials={testimonialsRes.data || []}
    />
  );
}
