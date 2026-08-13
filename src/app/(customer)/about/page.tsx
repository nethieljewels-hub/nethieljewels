import type { Metadata } from "next";
import { Sparkles, ShieldCheck, Truck } from "lucide-react";
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
    <div className="w-full bg-transparent select-none pb-20">
      {/* Main Brand Story (Asymmetric Editorial Layout) */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Large Editorial Side Statement */}
          <div className="md:col-span-5 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-normal leading-tight text-brand-brown-dark dark:text-brand-cream uppercase">
              CRAFTED FOR THE CONNOISSEUR
            </h1>
            <p className="text-sm font-light leading-relaxed text-neutral-500 dark:text-neutral-400 italic">
              &ldquo;We believe jewelry is not just an adornment, but an intimate expression of grace, character, and individual story.&rdquo;
            </p>
          </div>

          {/* Narrative Paragraphs */}
          <div className="md:col-span-7 space-y-6 text-xs sm:text-sm font-light text-neutral-650 dark:text-neutral-400 leading-relaxed">
            <p>
              Founded on the pillars of timeless elegance and direct support, {brandName} merges pure minimalism with modern luxury. We reject transient fashion cycles, creating instead clean silhouettes, subtle gold details, and classic designs that fit effortlessly into your everyday rotation.
            </p>
            <p>
              Each design is handcrafted using premium metals and carefully chosen stones. We ensure every piece retains its shape, luster, and premium feel generation after generation. It is luxury designed to be lived in.
            </p>
          </div>
        </div>

        {/* 2 Story Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-855 bg-neutral-50/40 dark:bg-neutral-900/10 p-8 space-y-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-800 transition-all duration-300">
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-widest uppercase text-brand-gold-dark">
                01 / PHILOSOPHY
              </span>
              <h2 className="text-lg font-serif-luxury font-medium tracking-wider text-black dark:text-white uppercase">
                PURE MINIMALISM
              </h2>
              <p className="text-xs font-light leading-relaxed text-neutral-500 dark:text-neutral-400">
                Our approach centers on refined proportions and subtle luxury. We design jewelry that commands attention through sophisticated restraint, ensuring each piece is both modern and completely timeless.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-855 bg-neutral-50/40 dark:bg-neutral-900/10 p-8 space-y-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-800 transition-all duration-300">
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-widest uppercase text-brand-gold-dark">
                02 / ARTISTRY
              </span>
              <h2 className="text-lg font-serif-luxury font-medium tracking-wider text-black dark:text-white uppercase">
                EXQUISITE FINERY
              </h2>
              <p className="text-xs font-light leading-relaxed text-neutral-500 dark:text-neutral-400">
                Meticulously crafted from sterling silver, premium gold, and hand-selected gemstones. Built to retain shape, luster, and brilliance, our pieces are a testament to the dedication of master artisans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Value Pillars */}
      <section className="bg-[#F9F6F4] dark:bg-neutral-900/20 py-16 border-y border-neutral-200 dark:border-neutral-850">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center space-y-3 p-4 group">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105">
                <Sparkles className="text-brand-brown-dark dark:text-brand-cream" size={20} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-black dark:text-white pt-1">
                EXQUISITE DESIGN
              </h3>
              <p className="text-[11px] font-light text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs">
                Beautifully detailed, handcrafted jewelry made to elevate every occasion.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 group sm:border-x border-neutral-200/60 dark:border-neutral-850/60">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105">
                <Truck className="text-brand-brown-dark dark:text-brand-cream" size={20} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-black dark:text-white pt-1">
                INSURED SHIPPING
              </h3>
              <p className="text-[11px] font-light text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs">
                Pan-India fully insured shipping delivering premium packages directly to your doorstep.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4 group">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105">
                <ShieldCheck className="text-brand-brown-dark dark:text-brand-cream" size={20} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-black dark:text-white pt-1">
                DIRECT INQUIRY
              </h3>
              <p className="text-[11px] font-light text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs">
                Connect with our team directly on WhatsApp to select sizes, verify metals, and customize orders.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
