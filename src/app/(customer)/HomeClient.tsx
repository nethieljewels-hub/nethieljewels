"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import CustomerProductCard from "@/components/ui/CustomerProductCard";
import { ArrowRight, ChevronLeft, ChevronRight, VolumeX, Volume2, ShieldCheck, Truck, Sparkles, MessageCircle, Image as ImageIcon, Layers, Play } from "lucide-react";

interface Banner {
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

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  featured: boolean;
  images: string[];
  category_id: string;
  categories?: {
    name: string;
  };
}

interface Reel {
  id: string;
  title: string | null;
  video_url: string;
  thumbnail_url: string | null;
  sort_order: number;
}

interface SiteSettings {
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
}

interface HomeClientProps {
  initialBanners: Banner[];
  initialCategories: Category[];
  initialProducts: Product[];
  settings: SiteSettings | null;
  initialReels: Reel[];
}

/** Self-contained reel card: plays video on hover, mute/unmute toggle */
function ReelCard({ reel }: { reel: { id: string; title: string | null; video_url: string; thumbnail_url: string | null } }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  const handleMouseEnter = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
    if (videoRef.current) videoRef.current.currentTime = 0;
    setPlaying(false);
    setMuted(true);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <div
      className="relative flex-shrink-0 snap-start w-36 sm:w-44 md:w-48 aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-900 cursor-pointer group border border-neutral-200/40 dark:border-neutral-800/60 shadow-md hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail shown before hover */}
      {reel.thumbnail_url && !playing && (
        <img
          src={reel.thumbnail_url}
          alt={reel.title || "Reel"}
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
      )}

      {/* Video */}
      <video
        ref={videoRef}
        src={reel.video_url}
        muted
        playsInline
        loop
        className="w-full h-full object-cover"
      />

      {/* Play icon shown on idle */}
      {!playing && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
            <Play size={18} className="text-white fill-white ml-0.5" />
          </div>
        </div>
      )}

      {/* Gradient overlay + title */}
      <div className="absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3">
        {reel.title && (
          <p className="text-white text-[10px] sm:text-xs font-semibold leading-tight line-clamp-2">
            {reel.title}
          </p>
        )}
      </div>

      {/* Mute toggle (shows on hover) */}
      {playing && (
        <button
          type="button"
          onClick={toggleMute}
          className="absolute top-2.5 right-2.5 z-40 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
        >
          {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
        </button>
      )}
    </div>
  );
}

// ─── Mobile Reel Card ────────────────────────────────────────────────────────
// A variant of ReelCard that auto-plays when active and resets when inactive.
function MobileReelCard({
  reel,
  isActive,
}: {
  reel: { id: string; title: string | null; video_url: string; thumbnail_url: string | null };
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  // Play/pause based on active state
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => { });
      setPlaying(true);
    } else {
      v.pause();
      v.currentTime = 0;
      setPlaying(false);
      setMuted(true);
      v.muted = true;
    }
  }, [isActive]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/60 shadow-lg">
      {/* Thumbnail */}
      {reel.thumbnail_url && !playing && (
        <img
          src={reel.thumbnail_url}
          alt={reel.title || "Reel"}
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
      )}

      {/* Video */}
      <video
        ref={videoRef}
        src={reel.video_url}
        muted
        playsInline
        loop
        className="w-full h-full object-cover"
      />

      {/* Play icon when idle */}
      {!playing && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/25">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
            <Play size={18} className="text-white fill-white ml-0.5" />
          </div>
        </div>
      )}

      {/* Title gradient */}
      <div className="absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3">
        {reel.title && (
          <p className="text-white text-[10px] font-semibold leading-tight line-clamp-2">
            {reel.title}
          </p>
        )}
      </div>

      {/* Mute toggle */}
      {playing && isActive && (
        <button
          type="button"
          onClick={toggleMute}
          className="absolute top-2.5 right-2.5 z-40 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white cursor-pointer"
        >
          {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
        </button>
      )}
    </div>
  );
}

// ─── Mobile Reel Carousel ─────────────────────────────────────────────────────
/**
 * Three-slot layout on mobile:
 *   [LEFT 22vw] [CENTER 54vw] [RIGHT 22vw] = 98vw total (2vw breathing room)
 *
 * Each slot is absolutely positioned. The active card goes in CENTER,
 * prev goes in LEFT, next goes in RIGHT. Arrow + swipe gesture to navigate.
 * No overflow because every slot has a fixed pixel position.
 */
function MobileReelCarousel({ reels }: { reels: Reel[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const total = reels.length;
  const prev = () => setActiveIndex((i) => (i - 1 + total) % total);
  const next = () => setActiveIndex((i) => (i + 1) % total);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - (e.changedTouches[0]?.clientX ?? touchStartX.current);
    if (Math.abs(diff) > 44) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  if (total === 0) return null;

  if (total === 1 && reels[0]) {
    return (
      <div className="flex justify-center px-6">
        <div className="w-[54vw] aspect-[9/16]">
          <MobileReelCard reel={reels[0]} isActive />
        </div>
      </div>
    );
  }

  // Slot widths (vw-based, scales across all phone sizes)
  // CENTER = 54vw, SIDE = 36vw (~67% of center), gap = 2vw
  // Total layout = 36+2+54+2+36 = 130vw → startX = -15vw
  // → Left card bleeds 15vw off-screen left, right card bleeds 15vw off right.
  // The stage's overflow-hidden clips those edges — no page-level scroll.
  // Center card position = -15 + 36 + 2 = 23vw  ← unchanged from before.
  const centerW = 54;  // vw  (do not change)
  const sideW = 36;  // vw  (was 22 — increased for visible side cards)
  const gap = 2;   // vw  (was 1)

  const totalW = sideW + gap + centerW + gap + sideW; // 130vw
  const startX = (100 - totalW) / 2;                  // -15vw
  const leftX = startX;                              // -15vw
  const centerX = startX + sideW + gap;               //  23vw  ← same as before
  const rightX = startX + sideW + gap + centerW + gap; // 79vw

  const centerH = centerW * (16 / 9); // vw
  const sideH = sideW * (16 / 9); // vw


  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;

  const slots = [
    { reel: reels[prevIndex]!, slot: "left" as const },
    { reel: reels[activeIndex]!, slot: "center" as const },
    { reel: reels[nextIndex]!, slot: "right" as const },
  ];

  return (
    <div
      className="relative w-full select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Stage — height = center card height */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: `${centerH}vw` }}
      >
        {slots.map(({ reel, slot }) => {
          if (!reel) return null;

          const isCenter = slot === "center";
          const isLeft = slot === "left";

          const left = isLeft ? leftX : isCenter ? centerX : rightX;
          const width = isCenter ? centerW : sideW;
          const height = isCenter ? centerH : sideH;
          // Vertically center the side cards relative to the stage
          const top = isCenter ? 0 : (centerH - sideH) / 2;

          return (
            <div
              key={`${slot}-${reel.id}`}
              className="absolute cursor-pointer"
              style={{
                left: `${left}vw`,
                top: `${top}vw`,
                width: `${width}vw`,
                height: `${height}vw`,
                zIndex: isCenter ? 10 : 5,
                transition: "left 380ms cubic-bezier(0.25,0.46,0.45,0.94), top 380ms cubic-bezier(0.25,0.46,0.45,0.94), width 380ms cubic-bezier(0.25,0.46,0.45,0.94), height 380ms cubic-bezier(0.25,0.46,0.45,0.94), opacity 380ms ease, filter 380ms ease",
                opacity: isCenter ? 1 : 0.7,
                filter: isCenter ? "brightness(1)" : "brightness(0.6)",
              }}
              onClick={() => {
                if (slot === "left") prev();
                if (slot === "right") next();
              }}
            >
              <MobileReelCard reel={reel} isActive={isCenter} />
            </div>
          );
        })}
      </div>

      {/* Left arrow */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 dark:bg-neutral-900/95 border border-neutral-200 dark:border-neutral-800 shadow-md flex items-center justify-center text-neutral-700 dark:text-neutral-300 active:scale-90 transition-transform"
        aria-label="Previous reel"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Right arrow */}
      <button
        type="button"
        onClick={next}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 dark:bg-neutral-900/95 border border-neutral-200 dark:border-neutral-800 shadow-md flex items-center justify-center text-neutral-700 dark:text-neutral-300 active:scale-90 transition-transform"
        aria-label="Next reel"
      >
        <ChevronRight size={16} />
      </button>

      {/* Dot indicators */}
      <div className="mt-5 flex justify-center gap-2">
        {reels.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`rounded-full transition-all duration-300 ${i === activeIndex
                ? "w-5 h-1.5 bg-neutral-800 dark:bg-white"
                : "w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-700"
              }`}
            aria-label={`Reel ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/** Extract Instagram handle from a URL like https://instagram.com/_teex */
function extractInstagramHandle(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const pathname = new URL(url).pathname.replace(/\/+$/, "");
    const handle = pathname.split("/").pop();
    return handle ? `@${handle}` : null;
  } catch {
    return null;
  }
}

export default function HomeClient({
  initialBanners,
  initialCategories,
  initialProducts,
  settings,
  initialReels,
}: HomeClientProps) {
  const [activeBanner, setActiveBanner] = useState(0);
  const [isNewArrivalsHovered, setIsNewArrivalsHovered] = useState(false);
  const instaScrollRef = useRef<HTMLDivElement>(null);
  const newArrivalsRef = useRef<HTMLDivElement>(null);

  // Auto rotate banners every 8 seconds if there are multiple banners
  useEffect(() => {
    if (initialBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % initialBanners.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [initialBanners.length]);

  // Auto slide mobile Instagram gallery every 4 seconds
  useEffect(() => {
    const el = instaScrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 160, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Continuous infinite smooth running loop for New Arrivals (Pauses on hover)
  useEffect(() => {
    if (isNewArrivalsHovered || initialProducts.length === 0) return;
    const el = newArrivalsRef.current;
    if (!el || el.clientWidth === 0) return;

    let animationFrameId: number;
    const speed = 0.6; // Steady smooth running speed

    const loop = () => {
      if (el) {
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        } else {
          el.scrollLeft += speed;
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isNewArrivalsHovered, initialProducts.length]);

  const handlePrevBanner = () => {
    setActiveBanner((prev) => (prev - 1 + initialBanners.length) % initialBanners.length);
  };

  const handleNextBanner = () => {
    setActiveBanner((prev) => (prev + 1) % initialBanners.length);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    if (e.targetTouches[0]) {
      setTouchStart(e.targetTouches[0].clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 40) {
      handleNextBanner();
    } else if (distance < -40) {
      handlePrevBanner();
    }
  };

  // Products with valid images for Instagram grid (backend data)
  const productsWithImages = initialProducts.filter((p) => p.images && p.images.length > 0);

  return (
    <div data-page="home" className="space-y-16 pb-20 bg-transparent">
      {/* 1. HERO BANNER SECTION */}
      <section
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-auto min-h-[460px] bg-neutral-150 dark:bg-neutral-950 overflow-hidden select-none"
        style={{ height: "calc(100dvh - 56px)", minHeight: "calc(100dvh - 56px)" } as React.CSSProperties}
      >
        {initialBanners.length === 0 ? (
          /* Default Banner Placeholder layout if no banner is added in Admin yet */
          <div className="relative inset-0 h-full w-full flex flex-col md:flex-row items-center justify-between px-5 sm:px-14 md:px-24 lg:px-28 py-12 bg-white dark:bg-[#120905]">
            <div className="max-w-[55%] sm:max-w-md md:max-w-xl space-y-2 sm:space-y-4 z-10 text-left">
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-brand-gold uppercase">
                THE SIGNATURE COLLECTION
              </span>
              <h1 className="text-2xl sm:text-5xl md:text-6xl font-serif-luxury font-light tracking-wide text-brand-brown-dark dark:text-brand-cream uppercase leading-tight sm:leading-none">
                Timeless Elegance, <br /> Crafted for You
              </h1>
              <p className="text-[10px] sm:text-sm font-light text-neutral-600 dark:text-neutral-400">
                Discover beautifully crafted jewelry designed to celebrate life&apos;s most precious moments.
              </p>
              <div className="pt-2 sm:pt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center space-x-3 bg-brand-brown-dark text-white dark:bg-[#faf7f2] dark:text-brand-brown-dark px-7 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-brand-brown-medium dark:hover:bg-brand-cream/95 transition-all rounded-sm shadow-md"
                >
                  <span>SHOP COLLECTION</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Pure SVG Placeholder Frame */}
            <div className="hidden md:flex w-1/2 h-full relative items-center justify-center bg-brand-cream/40 dark:bg-brand-brown-dark border border-brand-brown-medium/10 rounded-sm">
              <div className="flex flex-col items-center justify-center space-y-2 text-neutral-400">
                <ImageIcon size={48} strokeWidth={1} className="text-brand-gold" />
                <span className="text-[10px] font-mono tracking-widest uppercase text-brand-brown-medium dark:text-brand-cream/60">
                  HERO BANNER MEDIA PLACEHOLDER
                </span>
                <span className="text-[9px] text-neutral-400">
                  Add hero banners in Admin Dashboard
                </span>
              </div>
            </div>
          </div>
        ) : (
          initialBanners.map((banner, index) => {
            const isActive = index === activeBanner;
            return (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
              >
                {/* Media background */}
                {(() => {
                  const hasMobileMedia = Boolean(banner.mobile_media_url);
                  const mobileUrl = banner.mobile_media_url || banner.media_url;
                  const mobileType = banner.mobile_media_url
                    ? banner.mobile_media_type || "image"
                    : banner.media_type;

                  return (
                    <>
                      {/* Desktop Media */}
                      <div className={`absolute inset-0 h-full w-full ${hasMobileMedia ? "hidden sm:block" : ""}`}>
                        {banner.media_type === "video" ? (
                          <div className="relative h-full w-full bg-black">
                            <video
                              src={banner.media_url}
                              className="h-full w-full object-cover opacity-90"
                              muted
                              loop
                              autoPlay
                              playsInline
                            />
                            <div className="absolute bottom-6 right-6 text-neutral-400 p-2">
                              <VolumeX size={14} />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={banner.media_url}
                            alt={banner.title || "Hero banner"}
                            className="h-full w-full object-cover"
                            loading="eager"
                            fetchPriority="high"
                          />
                        )}
                      </div>

                      {/* Mobile Media */}
                      {hasMobileMedia && (
                        <div className="absolute inset-0 h-full w-full sm:hidden">
                          {mobileType === "video" ? (
                            <div className="relative h-full w-full bg-black">
                              <video
                                src={mobileUrl}
                                className="h-full w-full object-cover opacity-90"
                                muted
                                loop
                                autoPlay
                                playsInline
                              />
                            </div>
                          ) : (
                            <img
                              src={mobileUrl}
                              alt={banner.title || "Hero banner"}
                              className="h-full w-full object-cover"
                              loading="eager"
                              fetchPriority="high"
                            />
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}


              </div>
            );
          })
        )}

        {/* Carousel slide indicators */}
        {initialBanners.length > 1 && (
          <>
            <button
              onClick={handlePrevBanner}
              className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors focus:outline-none cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNextBanner}
              className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors focus:outline-none cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
              {initialBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveBanner(index)}
                  className={`transition-all cursor-pointer ${index === activeBanner
                    ? "h-1 w-6 bg-black dark:bg-white rounded-full"
                    : "h-2 w-2 rounded-full bg-neutral-400 hover:bg-neutral-600"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 2. CATEGORIES SECTION - FIND YOUR STYLE */}
      <section className="mx-auto max-w-7xl px-6 space-y-6">
        <div className="flex items-end justify-between border-b border-neutral-200 dark:border-neutral-850 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 dark:text-neutral-400 uppercase">
              SHOP BY COLLECTION
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-black dark:text-white uppercase mt-0.5 whitespace-nowrap">
              FIND YOUR STYLE
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden md:inline-flex items-center space-x-1.5 text-xs font-bold tracking-wider uppercase text-black dark:text-white hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
          >
            <span>VIEW ALL COLLECTIONS</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Dynamic Categories Display (Circular Avatars Layout - 7 items in 1 single horizontal row) */}
        {initialCategories.length === 0 ? (
          <div className="rounded-xs border border-neutral-200 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-900 p-12 text-center text-xs text-neutral-500 dark:text-neutral-400 uppercase">
            No categories defined in database.
          </div>
        ) : (
          <div className="flex flex-nowrap items-start justify-start gap-2 sm:gap-3 md:gap-4 overflow-x-auto py-3 px-1 scrollbar-none select-none">
            {initialCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/collections/${cat.slug || cat.id}`}
                className="group flex flex-col items-center flex-shrink-0 w-20 sm:w-24 md:w-36 lg:w-40 focus:outline-none"
              >
                {/* Circular Image Container with Outer Gold Accent Ring */}
                <div className="p-1 sm:p-1.5 rounded-full border border-[#c5a880] dark:border-[#c5a880]/80 bg-white dark:bg-neutral-950 transition-all duration-300 group-hover:border-black dark:group-hover:border-white shadow-xs group-hover:shadow-md">
                  <div className="w-18 h-18 sm:w-22 sm:h-22 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={`${cat.name} Jewelry Collection - Nethiel Jewelry`}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                        <Layers size={22} strokeWidth={1.2} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Centered Category Title Below Circle */}
                <span className="text-[11px] sm:text-xs md:text-sm font-extrabold tracking-wide uppercase text-black dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors text-center mt-2.5 leading-tight line-clamp-2 px-0.5">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 3. NEW ARRIVALS / JUST LANDED CONTINUOUS RUNNING LOOP */}
      <section className="mx-auto max-w-7xl px-6 space-y-6">
        <div className="flex items-end justify-between border-b border-neutral-200 dark:border-neutral-850 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 dark:text-neutral-400 uppercase">
              NEW ARRIVALS
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-black dark:text-white uppercase mt-0.5">
              JUST LANDED
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden md:inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold tracking-wider uppercase text-black dark:text-white hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors whitespace-nowrap"
          >
            <span>VIEW ALL<span className="hidden sm:inline"> PRODUCTS</span></span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {initialProducts.length === 0 ? (
          <div className="rounded-xs border border-neutral-200 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-900 p-12 text-center text-xs text-neutral-500 dark:text-neutral-400 uppercase">
            No products available yet in catalog.
          </div>
        ) : (
          <>
            {/* Laptop/Desktop Continuous Slider (md and up) */}
            <div
              ref={newArrivalsRef}
              onMouseEnter={() => setIsNewArrivalsHovered(true)}
              onMouseLeave={() => setIsNewArrivalsHovered(false)}
              className="hidden md:flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none py-2 px-1 select-none cursor-grab active:cursor-grabbing"
            >
              {[...initialProducts, ...initialProducts].map((product, idx) => (
                <div
                  key={`${product.id}-${idx}`}
                  className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.8rem)] md:w-[calc(25%-0.95rem)] lg:w-[calc(20%-0.8rem)] flex-shrink-0"
                >
                  <CustomerProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Mobile Grid View (Hidden on md and up) */}
            <div className="grid grid-cols-2 gap-4 md:hidden">
              {initialProducts.slice(0, 6).map((product) => (
                <div key={product.id}>
                  <CustomerProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Mobile View All Button (Hidden on md and up) */}
            <div className="flex justify-center pt-4 md:hidden">
              <Link
                href="/products"
                className="inline-flex items-center justify-center space-x-2 bg-black text-white dark:bg-white dark:text-black px-8 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all rounded-sm shadow-md w-full max-w-[280px]"
              >
                <span>VIEW ALL</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* 4. VALUE PROPOSITIONS / FEATURES BAR */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="grid grid-cols-3 gap-0 sm:gap-6 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/50 px-2 py-4 sm:p-8 text-center items-start">
          <div className="flex flex-col items-center space-y-1 sm:space-y-2.5 px-1 sm:px-4">
            <Sparkles className="text-black dark:text-white w-4 h-4 sm:w-7 sm:h-7 mb-0.5" strokeWidth={1.5} />
            <h3 className="text-[8px] sm:text-sm md:text-base font-extrabold tracking-wide uppercase text-black dark:text-white leading-tight">
              <span className="hidden sm:inline">PREMIUM </span>CRAFTSMANSHIP
            </h3>
            <p className="text-[7px] sm:text-xs md:text-sm font-light text-neutral-500 dark:text-neutral-400 leading-snug sm:leading-relaxed sm:max-w-xs">
              <span className="sm:hidden">Precious metals &amp; fine gems.</span>
              <span className="hidden sm:inline">Meticulously designed with precious metals and fine gems.</span>
            </p>
          </div>
          <div className="flex flex-col items-center space-y-1 sm:space-y-2.5 px-1 sm:px-4 border-x border-neutral-200 dark:border-neutral-800">
            <Truck className="text-black dark:text-white w-4 h-4 sm:w-7 sm:h-7 mb-0.5" strokeWidth={1.5} />
            <h3 className="text-[8px] sm:text-sm md:text-base font-extrabold tracking-wide uppercase text-black dark:text-white leading-tight">
              INSURED<span className="hidden sm:inline"> SHIPPING</span>
            </h3>
            <p className="text-[7px] sm:text-xs md:text-sm font-light text-neutral-500 dark:text-neutral-400 leading-snug sm:leading-relaxed sm:max-w-xs">
              <span className="sm:hidden">Free above ₹5,000.</span>
              <span className="hidden sm:inline">Complimentary shipping on orders above ₹5,000.</span>
            </p>
          </div>
          <div className="flex flex-col items-center space-y-1 sm:space-y-2.5 px-1 sm:px-4">
            <ShieldCheck className="text-black dark:text-white w-4 h-4 sm:w-7 sm:h-7 mb-0.5" strokeWidth={1.5} />
            <h3 className="text-[8px] sm:text-sm md:text-base font-extrabold tracking-wide uppercase text-black dark:text-white leading-tight">
              SECURE<span className="hidden sm:inline"> CHECKOUT</span>
            </h3>
            <p className="text-[7px] sm:text-xs md:text-sm font-light text-neutral-500 dark:text-neutral-400 leading-snug sm:leading-relaxed sm:max-w-xs">
              <span className="sm:hidden">Order via WhatsApp.</span>
              <span className="hidden sm:inline">Direct checkout and inquiry via WhatsApp.</span>
            </p>
          </div>
        </div>
      </section>

      {/* 5. SHOP THE LOOK / INSTAGRAM GALLERY */}
      <section className="mx-auto max-w-7xl px-6 space-y-6">
        <div className="flex items-end justify-between border-b border-neutral-200 dark:border-neutral-850 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 dark:text-neutral-400 uppercase">
              SHOP THE LOOK
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-black dark:text-white uppercase mt-0.5">
              {extractInstagramHandle(settings?.instagram) || "@nethieljewelry"}
            </h2>
          </div>
          <a
            href={settings?.instagram || "https://instagram.com"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 md:space-x-2 border-0 md:border md:border-neutral-300 dark:md:border-neutral-700 bg-transparent md:bg-white dark:md:bg-neutral-900 p-0 md:px-4 md:py-2 text-xs font-bold tracking-wider uppercase text-black dark:text-white hover:opacity-80 md:hover:bg-neutral-100 dark:md:hover:bg-neutral-800 transition-colors rounded-xs"
          >
            <span>FOLLOW US<span className="hidden md:inline"> ON INSTAGRAM</span></span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>
        </div>

        {/* Desktop Grid (6 Columns) */}
        <div className="hidden md:grid md:grid-cols-6 gap-3">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const product = productsWithImages[idx];
            const imgUrl = product?.images?.[0];

            return (
              <div
                key={idx}
                className="group relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-xs flex items-center justify-center"
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={product?.title || `Product look ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-1 text-neutral-400 p-2 text-center">
                    <ImageIcon size={20} strokeWidth={1.2} />
                    <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-400">
                      PLACEHOLDER
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Touch-Swipable + Auto-Sliding Image Row */}
        <div
          ref={instaScrollRef}
          className="flex md:hidden space-x-3 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth py-1 select-none"
        >
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const product = productsWithImages[idx];
            const imgUrl = product?.images?.[0];

            return (
              <div
                key={idx}
                className="group relative w-36 aspect-[3/4] flex-shrink-0 snap-start overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-xs flex items-center justify-center"
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={product?.title || `Product look ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-1 text-neutral-400 p-2 text-center">
                    <ImageIcon size={20} strokeWidth={1.2} />
                    <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-400">
                      PLACEHOLDER
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. VIDEO REELS SECTION */}
      {initialReels.length > 0 && (
        <section className="mx-auto max-w-7xl space-y-5">
          <div className="px-4 sm:px-6 flex items-end justify-between border-b border-neutral-200 dark:border-neutral-850 pb-3">
            <div>
              <span className="block text-[10px] font-bold tracking-[0.25em] text-neutral-500 dark:text-neutral-400 uppercase mb-1">
                OUR STORY
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-black dark:text-white uppercase mt-0.5">
                BEHIND THE BRAND
              </h2>
            </div>
          </div>

          {/* Mobile: three-slot carousel – needs full viewport width for vw math */}
          <div className="sm:hidden w-full overflow-hidden pb-4">
            <MobileReelCarousel reels={initialReels} />
          </div>

          {/* Desktop: horizontal scroll row (unchanged) */}
          <div className="hidden sm:flex justify-center gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide px-6">
            {initialReels.map((reel) => (
              <ReelCard key={reel.id} reel={reel} />
            ))}
          </div>
        </section>
      )}

      {/* 7. WHATSAPP ORDER CTA SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70 p-5 sm:p-8 md:p-12 flex flex-row items-center justify-between gap-3 sm:gap-6">
          {/* Left Text Content */}
          <div className="w-7/12 sm:w-1/2 space-y-2 sm:space-y-3 text-left z-10">
            <span className="block text-[9px] sm:text-[10px] font-bold tracking-[0.25em] text-neutral-500 dark:text-neutral-400 uppercase">
              HAVE QUESTIONS?
            </span>
            <h2 className="text-base sm:text-2xl md:text-3xl font-extrabold tracking-tight text-black dark:text-white uppercase leading-tight">
              ORDER ON WHATSAPP
            </h2>
            <p className="text-[10px] sm:text-xs md:text-sm font-medium text-neutral-600 dark:text-neutral-400 leading-normal sm:leading-relaxed">
              Connect with our curators directly and place your order in seconds.
            </p>
            <div className="pt-1">
              <a
                href={`https://wa.me/${settings?.whatsapp?.replace(/[^\d]/g, "") || ""}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-3.5 py-2 sm:px-6 sm:py-2.5 text-[10px] sm:text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all rounded-sm shadow-md"
              >
                <span>CHAT NOW</span>
                <MessageCircle size={13} className="sm:w-[15px] sm:h-[15px]" />
              </a>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="w-5/12 sm:w-1/2 h-36 sm:h-52 md:h-60 relative flex items-start justify-center -mb-5 sm:-mb-8 md:-mb-12 overflow-hidden">
            <img
              src="/images/watsapp-new.png"
              alt="Order on WhatsApp Chat Preview"
              className="h-[140%] sm:h-[150%] md:h-[160%] w-auto max-w-none object-cover object-top drop-shadow-md origin-top"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
