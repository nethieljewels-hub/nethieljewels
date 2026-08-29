"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Testimonial } from "@/types/database.types";

const LOCAL_STORAGE_CACHE_KEY = "nethiel_storefront_cache_v1";

export interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  media_url: string;
  media_type: "image" | "video";
  mobile_media_url?: string | null;
  mobile_media_type?: "image" | "video" | null;
  button_text: string | null;
  button_link: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  product_code?: string | null;
  colors?: string[] | null;
  description?: string | null;
  original_price?: number;
  selling_price?: number | null;
  price?: number;
  is_out_of_stock?: boolean;
  featured: boolean;
  images: string[];
  category_id: string;
  created_at?: string;
  categories?: {
    name: string;
    id?: string;
    slug?: string;
  };
}

export interface Reel {
  id: string;
  title: string | null;
  video_url: string;
  thumbnail_url: string | null;
  sort_order: number;
}

export interface SiteSettings {
  shop_name?: string;
  announcement_enabled?: boolean | null;
  announcement_text?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

interface DataContextType {
  banners: Banner[];
  categories: Category[];
  products: Product[];
  settings: SiteSettings | null;
  reels: Reel[];
  testimonials: Testimonial[];
  loading: boolean;
  refreshData: () => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (categorySlugOrId: string) => Product[];
  getCategoryBySlug: (slug: string) => Category | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export interface DataProviderProps {
  children: React.ReactNode;
  initialBanners?: Banner[];
  initialCategories?: Category[];
  initialProducts?: Product[];
  initialSettings?: SiteSettings | null;
  initialReels?: Reel[];
  initialTestimonials?: Testimonial[];
}

export function DataProvider({
  children,
  initialBanners = [],
  initialCategories = [],
  initialProducts = [],
  initialSettings = null,
  initialReels = [],
  initialTestimonials = [],
}: DataProviderProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [settings, setSettings] = useState<SiteSettings | null>(initialSettings);
  const [reels, setReels] = useState<Reel[]>(initialReels);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [loading, setLoading] = useState<boolean>(
    initialBanners.length === 0 && initialProducts.length === 0
  );

  // 1. Hydrate from localStorage on client mount for instant 0ms load
  useEffect(() => {
    try {
      const rawCache = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (rawCache) {
        const cached = JSON.parse(rawCache);
        if (cached.products && cached.products.length > 0 && products.length === 0) {
          setProducts(cached.products);
        }
        if (cached.categories && cached.categories.length > 0 && categories.length === 0) {
          setCategories(cached.categories);
        }
        if (cached.banners && cached.banners.length > 0 && banners.length === 0) {
          setBanners(cached.banners);
        }
        if (cached.settings && !settings) {
          setSettings(cached.settings);
        }
        if (cached.reels && cached.reels.length > 0 && reels.length === 0) {
          setReels(cached.reels);
        }
        if (cached.testimonials && cached.testimonials.length > 0 && testimonials.length === 0) {
          setTestimonials(cached.testimonials);
        }
        setLoading(false);
      }
    } catch (err) {
      console.warn("Failed to load local cache:", err);
    }
  }, []);

  // 2. Fetch fresh data from Supabase & update localStorage cache
  const fetchAllData = useCallback(async () => {
    try {
      const supabase = createClient();
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
            .select("*, categories(name, id, slug)")
            .eq("active", true)
            .order("created_at", { ascending: false }),
          supabase
            .from("settings")
            .select("whatsapp, instagram, facebook, phone, email, address, shop_name, announcement_enabled, announcement_text")
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

      const freshBanners = bannersRes.data || banners;
      const freshCategories = categoriesRes.data || categories;
      const freshProducts = productsRes.data || products;
      const freshSettings = settingsRes.data || settings;
      const freshReels = reelsRes.data || reels;
      const freshTestimonials = testimonialsRes.data || testimonials;

      if (bannersRes.data) setBanners(freshBanners);
      if (categoriesRes.data) setCategories(freshCategories);
      if (productsRes.data) setProducts(freshProducts);
      if (settingsRes.data) setSettings(freshSettings);
      if (reelsRes.data) setReels(freshReels);
      if (testimonialsRes.data) setTestimonials(freshTestimonials);

      // Save fresh payload to localStorage
      try {
        localStorage.setItem(
          LOCAL_STORAGE_CACHE_KEY,
          JSON.stringify({
            banners: freshBanners,
            categories: freshCategories,
            products: freshProducts,
            settings: freshSettings,
            reels: freshReels,
            testimonials: freshTestimonials,
            updatedAt: Date.now(),
          })
        );
      } catch (e) {
        console.warn("Failed to update localStorage cache:", e);
      }
    } catch (err) {
      console.error("Error fetching data in DataContext:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const getProductBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  const getProductsByCategory = useCallback(
    (categorySlugOrId: string) => {
      const cat = categories.find(
        (c) => c.slug === categorySlugOrId || c.id === categorySlugOrId
      );
      if (!cat) return products;
      return products.filter((p) => p.category_id === cat.id);
    },
    [categories, products]
  );

  const getCategoryBySlug = useCallback(
    (slug: string) => categories.find((c) => c.slug === slug),
    [categories]
  );

  return (
    <DataContext.Provider
      value={{
        banners,
        categories,
        products,
        settings,
        reels,
        testimonials,
        loading,
        refreshData: fetchAllData,
        getProductBySlug,
        getProductsByCategory,
        getCategoryBySlug,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
