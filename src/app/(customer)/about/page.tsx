import type { Metadata } from "next";
import Image from "next/image";
import { Sparkles, ShieldCheck, HeartHandshake, Compass, Target } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

import { formatCanonicalUrl, BRAND_NAME } from "@/utils/seo";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const revalidate = 0;

export const metadata: Metadata = {
  title: `About Us | Heritage & Story | ${BRAND_NAME}`,
  description:
    "Learn about Nethiel Jewelry, a South Indian brand bringing together traditional elegance and contemporary style. Discover our story, heritage, mission, and curated handcrafted pieces.",
  alternates: {
    canonical: formatCanonicalUrl("/about"),
  },
  openGraph: {
    title: `About Us | Heritage & Story | ${BRAND_NAME}`,
    description:
      "Learn about Nethiel Jewelry, a South Indian brand bringing together traditional elegance and contemporary style. Discover our story, mission, and curated pieces.",
    url: formatCanonicalUrl("/about"),
    siteName: BRAND_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `About Us | Heritage & Story | ${BRAND_NAME}`,
    description:
      "Learn about Nethiel Jewelry, a South Indian brand bringing together traditional elegance and contemporary style.",
  },
};

export default async function AboutPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("settings")
    .select("shop_name")
    .eq("id", true)
    .maybeSingle();

  const brandName = settings?.shop_name || BRAND_NAME;

  const breadcrumbs = [
    { name: "Home", url: formatCanonicalUrl("/") },
    { name: "About Us", url: formatCanonicalUrl("/about") },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <div className="w-full bg-transparent select-none pb-24">
      {/* Main Brand Story (Asymmetric Editorial Layout with Hero Image) */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16 md:py-24 space-y-16 sm:space-y-24">
        <div className="flex flex-col space-y-6 sm:space-y-8 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-14 items-center">
          {/* Child A: Heading Block (Mobile Order 1, Desktop Row 1 Right) */}
          <div className="order-1 lg:order-none lg:col-span-7 lg:col-start-6 lg:row-start-1 space-y-4 w-full">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold-dark">
              OUR STORY &amp; HERITAGE
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif-luxury font-light leading-tight tracking-wide text-brand-brown-dark dark:text-brand-cream uppercase">
              TRADITIONAL ELEGANCE & CONTEMPORARY STYLE
            </h1>
            <p className="text-xs sm:text-sm font-light leading-relaxed text-neutral-500 dark:text-neutral-400 italic border-l-2 border-brand-gold-dark/60 pl-4">
              &ldquo;Celebrating Indian traditions while complementing the modern woman.&rdquo;
            </p>
          </div>

          {/* Child B: Paragraph 1 (Mobile Order 2, Desktop Row 2 Right) */}
          <div className="order-2 lg:order-none lg:col-span-7 lg:col-start-6 lg:row-start-2 text-xs sm:text-sm md:text-base font-light text-neutral-700 dark:text-neutral-350 leading-relaxed sm:leading-loose w-full">
            <p className="first-letter:text-3xl sm:first-letter:text-4xl first-letter:font-serif-luxury first-letter:float-left first-letter:mr-3 first-letter:text-brand-brown-dark dark:first-letter:text-brand-cream">
              {brandName} is a South Indian jewelry brand bringing together traditional elegance and contemporary style. We curate beautiful jewelry pieces that celebrate Indian traditions while complementing the modern woman.
            </p>
          </div>

          {/* Child C: Editorial Image Side (Mobile Order 3 - Middle of Content, Desktop Left Column) */}
          <div className="order-3 lg:order-none lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:row-span-3 w-full flex justify-center py-3 lg:py-0">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-brand-gold-dark/20 group">
              <Image
                src="/images/about-hero.jpg"
                alt="South Indian Traditional Jewelry - Nethiel Jewelry"
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 450px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-5 left-5 right-5 backdrop-blur-md bg-white/20 dark:bg-black/30 p-4 rounded-xl border border-white/20">
                <p className="text-xs font-serif-luxury text-white tracking-widest uppercase text-center font-medium">
                  Traditional Elegance &bull; Contemporary Style
                </p>
              </div>
            </div>
          </div>

          {/* Child D: Paragraph 2 (Mobile Order 4, Desktop Row 3 Right) */}
          <div className="order-4 lg:order-none lg:col-span-7 lg:col-start-6 lg:row-start-3 text-xs sm:text-sm md:text-base font-light text-neutral-700 dark:text-neutral-350 leading-relaxed sm:leading-loose w-full lg:pt-2">
            <p>
              From elegant jhumkas and necklaces to harams, bangles, chokers and traditional South Indian designs, our collections are chosen to make every occasion special.
            </p>
          </div>
        </div>

        {/* Mission & Vision Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/30 backdrop-blur-xs p-8 sm:p-10 space-y-5 flex flex-col justify-between hover:border-brand-gold-dark/40 hover:shadow-lg transition-all duration-500 group">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-gold-dark/10 flex items-center justify-center text-brand-gold-dark">
                  <Target size={18} />
                </div>
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-brand-gold-dark">
                  01 / OUR MISSION
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif-luxury font-medium tracking-widest text-black dark:text-white uppercase transition-colors group-hover:text-brand-brown-dark dark:group-hover:text-brand-cream">
                ACCESSIBLE & TRUSTED ELEGANCE
              </h2>
              <p className="text-xs sm:text-sm font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
                Our mission is to make beautiful jewelry accessible while providing a trustworthy and enjoyable shopping experience.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/30 backdrop-blur-xs p-8 sm:p-10 space-y-5 flex flex-col justify-between hover:border-brand-gold-dark/40 hover:shadow-lg transition-all duration-500 group">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-gold-dark/10 flex items-center justify-center text-brand-gold-dark">
                  <Compass size={18} />
                </div>
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-brand-gold-dark">
                  02 / OUR VISION
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif-luxury font-medium tracking-widest text-black dark:text-white uppercase transition-colors group-hover:text-brand-brown-dark dark:group-hover:text-brand-cream">
                A GLOBAL JEWELRY DESTINATION
              </h2>
              <p className="text-xs sm:text-sm font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
                Our vision is to become a trusted jewelry destination for customers in India and around the world, known for beautiful designs, quality service and customer care.
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
                SOUTH INDIAN DESIGNS
              </h3>
              <p className="text-xs font-light text-neutral-550 dark:text-neutral-400 leading-relaxed max-w-xs">
                Jhumkas, harams, bangles, chokers, and curated pieces for every occasion.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 p-5 group sm:border-x border-neutral-200/70 dark:border-neutral-800/70">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-center shadow-xs transition-all duration-500 group-hover:scale-110 group-hover:border-brand-gold-dark/50 group-hover:shadow-md">
                <HeartHandshake className="text-brand-brown-dark dark:text-brand-cream" size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-black dark:text-white pt-1">
                QUALITY & CARE
              </h3>
              <p className="text-xs font-light text-neutral-550 dark:text-neutral-400 leading-relaxed max-w-xs">
                Dedicated customer service providing a smooth and trustworthy experience.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 p-5 group">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-center shadow-xs transition-all duration-500 group-hover:scale-110 group-hover:border-brand-gold-dark/50 group-hover:shadow-md">
                <ShieldCheck className="text-brand-brown-dark dark:text-brand-cream" size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-black dark:text-white pt-1">
                TRUSTED WORLDWIDE
              </h3>
              <p className="text-xs font-light text-neutral-550 dark:text-neutral-400 leading-relaxed max-w-xs">
                Serving jewelry lovers across India and around the world with authenticity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}


