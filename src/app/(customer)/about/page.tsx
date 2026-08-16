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
    <div className="w-full bg-transparent select-none pb-24">
      {/* Main Brand Story (Asymmetric Editorial Layout) */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20 md:py-28 space-y-16 sm:space-y-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-start">
          {/* Large Editorial Side Statement */}
          <div className="md:col-span-5 space-y-5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif-luxury font-light leading-tight tracking-wide text-brand-brown-dark dark:text-brand-cream uppercase border-l-2 border-brand-gold-dark/60 pl-4 sm:pl-5">
              CRAFTED FOR THE CONNOISSEUR
            </h1>
            <p className="text-xs sm:text-sm font-light leading-relaxed text-neutral-500 dark:text-neutral-400 italic pl-4 sm:pl-5">
              &ldquo;We believe jewelry is not just an adornment, but an intimate expression of grace, character, and individual story.&rdquo;
            </p>
          </div>

          {/* Narrative Paragraphs */}
          <div className="md:col-span-7 space-y-6 text-xs sm:text-sm md:text-base font-light text-neutral-700 dark:text-neutral-350 leading-relaxed sm:leading-loose">
            <p className="first-letter:text-3xl sm:first-letter:text-4xl first-letter:font-serif-luxury first-letter:float-left first-letter:mr-3 first-letter:text-brand-brown-dark dark:first-letter:text-brand-cream">
              Founded on the pillars of timeless elegance and direct support, {brandName} merges pure minimalism with modern luxury. We reject transient fashion cycles, creating instead clean silhouettes, subtle gold details, and classic designs that fit effortlessly into your everyday rotation.
            </p>
            <p>
              Each design is handcrafted using premium metals and carefully chosen stones. We ensure every piece retains its shape, luster, and premium feel generation after generation. It is luxury designed to be lived in.
            </p>
          </div>
        </div>

        {/* 2 Story Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/30 backdrop-blur-xs p-8 sm:p-10 space-y-5 flex flex-col justify-between hover:border-brand-gold-dark/40 hover:shadow-lg transition-all duration-500 group">
            <div className="space-y-4">
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-brand-gold-dark">
                01 / PHILOSOPHY
              </span>
              <h2 className="text-lg sm:text-xl font-serif-luxury font-medium tracking-widest text-black dark:text-white uppercase transition-colors group-hover:text-brand-brown-dark dark:group-hover:text-brand-cream">
                PURE MINIMALISM
              </h2>
              <p className="text-xs sm:text-sm font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
                Our approach centers on refined proportions and subtle luxury. We design jewelry that commands attention through sophisticated restraint, ensuring each piece is both modern and completely timeless.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/30 backdrop-blur-xs p-8 sm:p-10 space-y-5 flex flex-col justify-between hover:border-brand-gold-dark/40 hover:shadow-lg transition-all duration-500 group">
            <div className="space-y-4">
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-brand-gold-dark">
                02 / ARTISTRY
              </span>
              <h2 className="text-lg sm:text-xl font-serif-luxury font-medium tracking-widest text-black dark:text-white uppercase transition-colors group-hover:text-brand-brown-dark dark:group-hover:text-brand-cream">
                EXQUISITE FINERY
              </h2>
              <p className="text-xs sm:text-sm font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
                Meticulously crafted from sterling silver, premium gold, and hand-selected gemstones. Built to retain shape, luster, and brilliance, our pieces are a testament to the dedication of master artisans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Value Pillars */}
      <section className="bg-[#F9F6F4] dark:bg-neutral-900/30 py-16 sm:py-20 border-y border-neutral-200/70 dark:border-neutral-800/70">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 text-center">
            <div className="flex flex-col items-center space-y-4 p-5 group">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-center shadow-xs transition-all duration-500 group-hover:scale-110 group-hover:border-brand-gold-dark/50 group-hover:shadow-md">
                <Sparkles className="text-brand-brown-dark dark:text-brand-cream" size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-black dark:text-white pt-1">
                EXQUISITE DESIGN
              </h3>
              <p className="text-xs font-light text-neutral-550 dark:text-neutral-400 leading-relaxed max-w-xs">
                Beautifully detailed, handcrafted jewelry made to elevate every occasion.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 p-5 group sm:border-x border-neutral-200/70 dark:border-neutral-800/70">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-center shadow-xs transition-all duration-500 group-hover:scale-110 group-hover:border-brand-gold-dark/50 group-hover:shadow-md">
                <Truck className="text-brand-brown-dark dark:text-brand-cream" size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-black dark:text-white pt-1">
                INSURED SHIPPING
              </h3>
              <p className="text-xs font-light text-neutral-550 dark:text-neutral-400 leading-relaxed max-w-xs">
                Pan-India fully insured shipping delivering premium packages directly to your doorstep.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 p-5 group">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-center shadow-xs transition-all duration-500 group-hover:scale-110 group-hover:border-brand-gold-dark/50 group-hover:shadow-md">
                <ShieldCheck className="text-brand-brown-dark dark:text-brand-cream" size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-black dark:text-white pt-1">
                DIRECT INQUIRY
              </h3>
              <p className="text-xs font-light text-neutral-550 dark:text-neutral-400 leading-relaxed max-w-xs">
                Connect with our team directly on WhatsApp to select sizes, verify metals, and customize orders.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
