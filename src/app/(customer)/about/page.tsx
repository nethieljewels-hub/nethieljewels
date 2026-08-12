import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "About Us | Nethiel Jewelry",
  description: "Timeless luxury jewelry designed for elegance, durability, and everyday style. Exquisite details and direct WhatsApp ordering.",
};

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("settings")
    .select("shop_name")
    .eq("id", true)
    .maybeSingle();

  const brandName = settings?.shop_name || "NETHIEL JEWELRY";

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 md:py-20 space-y-16 select-none">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-brand-gold uppercase">
          OUR ETHOS
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-light tracking-wide text-brand-brown-dark dark:text-brand-cream uppercase mt-1">
          {brandName}
        </h1>
        <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed pt-1">
          Timeless luxury jewelry designed for elegance, durability, and everyday style.
        </p>
      </div>

      {/* Main Brand Story Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="rounded-sm border border-neutral-200 dark:border-neutral-850 bg-neutral-50/70 dark:bg-neutral-900/40 p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-brand-gold">
              01 / SIMPLICITY FIRST
            </span>
            <h2 className="text-xl font-serif-luxury font-light tracking-wide text-brand-brown-dark dark:text-brand-cream uppercase">
              PURE MINIMALISM
            </h2>
            <p className="text-xs font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
              We reject transient fashion cycles. Every piece of {brandName} is designed with clean silhouettes, subtle gold/silver details, and classic settings that fit effortlessly into your daily wardrobe.
            </p>
          </div>
        </div>

        <div className="rounded-sm border border-neutral-200 dark:border-neutral-850 bg-neutral-50/70 dark:bg-neutral-900/40 p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-brand-gold">
              02 / PREMIUM CRAFT
            </span>
            <h2 className="text-xl font-serif-luxury font-light tracking-wide text-brand-brown-dark dark:text-brand-cream uppercase">
              HANDCRAFTED FINERY
            </h2>
            <p className="text-xs font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
              Meticulously crafted from 18K gold, sterling silver, and hand-selected gemstones. Built to retain shape, luster, and brilliance drop after drop, generation after generation.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Core Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 rounded-sm border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 p-6 sm:p-8 text-center">
        <div className="flex flex-col items-center space-y-2 p-3">
          <Sparkles className="text-brand-gold mb-1" size={24} strokeWidth={1.5} />
          <h3 className="text-xs font-bold tracking-wider uppercase text-brand-brown-dark dark:text-brand-cream">
            EXQUISITE DESIGN
          </h3>
          <p className="text-[11px] font-light text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Beautifully detailed, handcrafted jewelry made for every occasion.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2 p-3 border-t sm:border-t-0 sm:border-l border-neutral-200 dark:border-neutral-850 pt-6 sm:pt-3">
          <Truck className="text-brand-gold mb-1" size={24} strokeWidth={1.5} />
          <h3 className="text-xs font-bold tracking-wider uppercase text-brand-brown-dark dark:text-brand-cream">
            INSURED SHIPPING
          </h3>
          <p className="text-[11px] font-light text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Pan-India fully insured shipping directly to your doorstep.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2 p-3 border-t sm:border-t-0 sm:border-l border-neutral-200 dark:border-neutral-850 pt-6 sm:pt-3">
          <ShieldCheck className="text-brand-gold mb-1" size={24} strokeWidth={1.5} />
          <h3 className="text-xs font-bold tracking-wider uppercase text-brand-brown-dark dark:text-brand-cream">
            WHATSAPP ORDERING
          </h3>
          <p className="text-[11px] font-light text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Order directly on WhatsApp in seconds — customize metals and select sizes easily.
          </p>
        </div>
      </div>

      {/* Explore Collection CTA */}
      <div className="text-center pt-4">
        <Link
          href="/products"
          className="inline-flex items-center space-x-3 bg-brand-brown-dark text-white dark:bg-brand-gold dark:text-brand-brown-dark px-8 py-3.5 text-xs font-semibold tracking-widest uppercase hover:bg-brand-brown-medium dark:hover:bg-brand-gold-dark transition-all rounded-sm shadow-md"
        >
          <span>EXPLORE CATALOG</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
