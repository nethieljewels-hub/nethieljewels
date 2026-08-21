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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Editorial Image (Full View Fit & Height) */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] sm:aspect-[3/4] max-h-[560px] rounded-2xl overflow-hidden shadow-xl border border-[#A8D3F5] dark:border-neutral-800 group">
              <Image
                src="/images/about-hero.jpg"
                alt="South Indian Traditional Jewelry - Nethiel Jewelry"
                fill
                priority
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 450px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />
              <div className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-black/40 p-3.5 rounded-xl border border-white/20">
                <p className="text-[11px] font-serif-luxury text-white tracking-widest uppercase text-center font-medium">
                  Traditional Elegance &bull; Contemporary Style
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Unified Story Content Top-Aligned & Equal Height to Image */}
          <div className="lg:col-span-7 flex flex-col justify-start space-y-6 pt-1">
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#0284C7] dark:text-sky-400">
                OUR STORY &amp; HERITAGE
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif-luxury font-light leading-tight tracking-wide text-[#1E3A5F] dark:text-[#CBD5E1] uppercase">
                TRADITIONAL ELEGANCE &amp; CONTEMPORARY STYLE
              </h1>
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#0284C7] dark:text-sky-400 italic border-l-2 border-[#0284C7] pl-3.5 py-0.5">
                &ldquo;Celebrating rich Indian traditions while complementing the modern woman.&rdquo;
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm md:text-base font-light text-neutral-700 dark:text-neutral-300 leading-relaxed sm:leading-loose">
              <p>
                <span className="text-base sm:text-lg font-bold text-[#1E3A5F] dark:text-white mr-1">
                  {brandName}
                </span>{" "}
                is a premier South Indian jewelry destination born out of a passion for authentic artistry, royal heritage, and timeless grace. We bridge centuries-old traditional craftsmanship with contemporary aesthetic sensibilities, curating statement pieces for every woman.
              </p>

              <p>
                Every design in our collection — from intricate Antique Jhumkas, Lakshmi Temple Harams, and Kundan Chokers to everyday Minimalist Bangles and Statement Rings — is carefully handpicked for superior finish, skin-friendly comfort, and lasting luster.
              </p>

              <p>
                Whether you are adorning yourself for a grand wedding, a cherished festival, or elevating your daily attire, Nethiel Jewelry is dedicated to bringing luxury craftsmanship directly to your doorstep with uncompromised trust and customer care.
              </p>
            </div>

            {/* 3 Brand Highlights Bar */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-neutral-200/80 dark:border-neutral-800">
              <div className="p-3 rounded-xl bg-[#D0E6F7] dark:bg-neutral-900 border border-[#A8D3F5] dark:border-neutral-800 text-center space-y-1">
                <Sparkles size={16} className="text-[#0284C7] mx-auto" />
                <span className="block text-[9px] font-bold uppercase tracking-wider text-[#1E3A5F] dark:text-white">
                  100% Quality Checked
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#D0E6F7] dark:bg-neutral-900 border border-[#A8D3F5] dark:border-neutral-800 text-center space-y-1">
                <ShieldCheck size={16} className="text-[#0284C7] mx-auto" />
                <span className="block text-[9px] font-bold uppercase tracking-wider text-[#1E3A5F] dark:text-white">
                  Premium Anti-Tarnish
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#D0E6F7] dark:bg-neutral-900 border border-[#A8D3F5] dark:border-neutral-800 text-center space-y-1">
                <HeartHandshake size={16} className="text-[#0284C7] mx-auto" />
                <span className="block text-[9px] font-bold uppercase tracking-wider text-[#1E3A5F] dark:text-white">
                  Pan-India Support
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="rounded-2xl border border-[#A8D3F5] dark:border-neutral-800 bg-[#D0E6F7] dark:bg-neutral-900/80 p-8 sm:p-10 space-y-5 flex flex-col justify-between hover:border-[#0284C7] hover:shadow-lg transition-all duration-300 group">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center shadow-xs">
                  <Target size={18} />
                </div>
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#0284C7] dark:text-sky-400">
                  01 / OUR MISSION
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif-luxury font-medium tracking-widest text-[#1E3A5F] dark:text-white uppercase transition-colors">
                ACCESSIBLE &amp; TRUSTED ELEGANCE
              </h2>
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-neutral-600 dark:text-neutral-400">
                Our mission is to make beautiful jewelry accessible while providing a trustworthy and enjoyable shopping experience.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#A8D3F5] dark:border-neutral-800 bg-[#D0E6F7] dark:bg-neutral-900/80 p-8 sm:p-10 space-y-5 flex flex-col justify-between hover:border-[#0284C7] hover:shadow-lg transition-all duration-300 group">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center shadow-xs">
                  <Compass size={18} />
                </div>
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#0284C7] dark:text-sky-400">
                  02 / OUR VISION
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif-luxury font-medium tracking-widest text-[#1E3A5F] dark:text-white uppercase transition-colors">
                A GLOBAL JEWELRY DESTINATION
              </h2>
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-neutral-600 dark:text-neutral-400">
                Our vision is to become a trusted jewelry destination for customers in India and around the world, known for beautiful designs, quality service and customer care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Value Pillars */}
      <section className="bg-[#D0E6F7] dark:bg-neutral-900/80 py-16 sm:py-20 border-y border-[#A8D3F5] dark:border-neutral-800">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 text-center">
            <div className="flex flex-col items-center space-y-4 p-5 group">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-neutral-900 border border-[#A8D3F5] dark:border-neutral-800 flex items-center justify-center shadow-xs transition-all duration-500 group-hover:scale-110 group-hover:border-[#0284C7] group-hover:shadow-md">
                <Sparkles className="text-[#1E3A5F] dark:text-white" size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#1E3A5F] dark:text-white pt-1">
                SOUTH INDIAN DESIGNS
              </h3>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs">
                Jhumkas, harams, bangles, chokers, and curated pieces for every occasion.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 p-5 group sm:border-x border-[#A8D3F5] dark:border-neutral-800">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-neutral-900 border border-[#A8D3F5] dark:border-neutral-800 flex items-center justify-center shadow-xs transition-all duration-500 group-hover:scale-110 group-hover:border-[#0284C7] group-hover:shadow-md">
                <HeartHandshake className="text-[#1E3A5F] dark:text-white" size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#1E3A5F] dark:text-white pt-1">
                QUALITY &amp; CARE
              </h3>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs">
                Dedicated customer service providing a smooth and trustworthy experience.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 p-5 group">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-neutral-900 border border-[#A8D3F5] dark:border-neutral-800 flex items-center justify-center shadow-xs transition-all duration-500 group-hover:scale-110 group-hover:border-[#0284C7] group-hover:shadow-md">
                <ShieldCheck className="text-[#1E3A5F] dark:text-white" size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#1E3A5F] dark:text-white pt-1">
                TRUSTED WORLDWIDE
              </h3>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs">
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


