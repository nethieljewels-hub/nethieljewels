import type { Metadata } from "next";
import { Sparkles, Droplets, SprayCan, Activity, Sparkle, Package, Sun, Gem, Heart, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Jewellery Care Guide | Nethiel Jewelry",
  description: "Learn how to care for and maintain the brilliance, finish, and shine of your Nethiel Jewelry pieces with our expert care guide.",
};

export default function JewelleryCarePage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Hero Title Section */}
        <div className="text-center space-y-3 border-b border-neutral-200/80 dark:border-neutral-800 pb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#1E3A5F]/5 dark:bg-white/5 text-[#1E3A5F] dark:text-[#DFCB7F] mb-2">
            <Sparkles size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-medium tracking-wider text-[#1E3A5F] dark:text-[#DFCB7F] uppercase">
            Jewellery Care Guide
          </h1>
          <p className="text-xs sm:text-sm font-bold text-[#1E3A5F] dark:text-white uppercase tracking-widest pt-1">
            Keep Your Jewellery Beautiful &amp; Shiny
          </p>
          <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto tracking-wide leading-relaxed">
            With proper care, your Nethiel Jewelry pieces can stay beautiful for longer. Follow these simple tips to protect the finish and shine of your jewellery.
          </p>
        </div>

        {/* Care Tips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-neutral-800 dark:text-neutral-200">

          {/* 1. Water & Moisture */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <Droplets size={20} />
              <h2 className="text-base font-serif-luxury font-bold tracking-wide uppercase">
                Keep Away From Water &amp; Moisture
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Avoid wearing jewellery while bathing, swimming or exercising. Keep it away from prolonged exposure to water and moisture.
            </p>
          </section>

          {/* 2. Perfume & Chemicals */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <SprayCan size={20} />
              <h2 className="text-base font-serif-luxury font-bold tracking-wide uppercase">
                Avoid Perfume &amp; Chemicals
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Apply perfume, body sprays, lotions and cosmetics before putting on your jewellery. Avoid direct contact with perfumes, creams, hairspray and other chemicals.
            </p>
          </section>

          {/* 3. Sweat & Moisture */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <Activity size={20} />
              <h2 className="text-base font-serif-luxury font-bold tracking-wide uppercase">
                Avoid Sweat &amp; Excessive Moisture
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Remove your jewellery before workouts or activities that cause excessive sweating, as moisture can affect the finish over time.
            </p>
          </section>

          {/* 4. Clean Gently */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <Sparkle size={20} />
              <h2 className="text-base font-serif-luxury font-bold tracking-wide uppercase">
                Clean Gently
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
              After wearing, gently wipe your jewellery with a soft, dry cotton or microfiber cloth to remove sweat and residue.
            </p>
            <p className="text-xs font-light text-neutral-500 italic pt-1">
              Avoid using abrasive materials, toothpaste, alcohol or harsh jewellery cleaners.
            </p>
          </section>

          {/* 5. Store It Properly */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <Package size={20} />
              <h2 className="text-base font-serif-luxury font-bold tracking-wide uppercase">
                Store It Properly
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Store each piece separately in a clean, dry and airtight pouch or jewellery box to prevent scratches, tangling and unnecessary exposure to moisture.
            </p>
          </section>

          {/* 6. Heat & Sunlight */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <Sun size={20} />
              <h2 className="text-base font-serif-luxury font-bold tracking-wide uppercase">
                Keep Away From Heat &amp; Sunlight
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Avoid leaving your jewellery in direct sunlight or near excessive heat for long periods.
            </p>
          </section>

        </div>

        {/* 7. Handle With Care */}
        <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-3 shadow-2xs">
          <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
            <Gem size={20} />
            <h2 className="text-lg font-serif-luxury font-bold tracking-wide uppercase">
              Handle With Care
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Our jewellery contains delicate detailing, stones, enamel and other decorative elements. Avoid dropping, pulling or bending the pieces.
          </p>
        </section>

        {/* Important Notice Card */}
        <section className="bg-amber-500/10 dark:bg-amber-500/15 border-l-4 border-amber-500 p-6 rounded-xs space-y-3 shadow-2xs">
          <div className="flex items-center space-x-2.5 text-amber-900 dark:text-amber-300 font-bold uppercase tracking-wider text-sm sm:text-base">
            <AlertCircle size={20} className="shrink-0" />
            <span>Important Notice</span>
          </div>
          <p className="text-xs sm:text-sm font-light text-neutral-800 dark:text-neutral-200 leading-relaxed">
            Fashion and imitation jewellery may naturally show changes in colour or finish over time depending on wear, moisture, sweat, perfumes, cosmetics and individual skin chemistry. Proper care can help extend its beauty and shine.
          </p>
        </section>

        {/* Bottom Tagline */}
        <div className="bg-[#1E3A5F] text-white dark:bg-neutral-900 border border-[#162B47] dark:border-neutral-800 p-6 sm:p-8 rounded-sm text-center space-y-2 shadow-sm">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-white/10 text-[#DFCB7F] mb-1">
            <Heart size={22} fill="currentColor" />
          </div>
          <p className="text-sm sm:text-base font-serif-luxury font-medium tracking-wide text-[#DFCB7F]">
            Treat your Nethiel pieces with love, and let them sparkle for longer. ✨
          </p>
        </div>

      </div>
    </div>
  );
}
