"use client";

import { useState, useRef, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import type { Testimonial } from "@/types/database.types";

const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    customer_name: "Ananya Sharma",
    location: "Mumbai, Maharashtra",
    rating: 5,
    review_text:
      "The bridal necklace set exceeded all my expectations! The craftsmanship, weight, and gold polish look completely authentic. Truly a masterpiece.",
    avatar_url: null,
    active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    customer_name: "Pooja Hegde",
    location: "Bengaluru, Karnataka",
    rating: 5,
    review_text:
      "Received my order in 4 days! Packaging was super luxurious with a velvet box. The Kundan earrings were so lightweight yet stunning for the wedding.",
    avatar_url: null,
    active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    customer_name: "Meera Nair",
    location: "Kochi, Kerala",
    rating: 5,
    review_text:
      "Customer support on WhatsApp was so patient and guided me through custom sizing. 10/10 shopping experience. Will definitely order again!",
    avatar_url: null,
    active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    customer_name: "Riddhi Patel",
    location: "Ahmedabad, Gujarat",
    rating: 5,
    review_text:
      "Subtle, elegant, and timeless designs! Got so many compliments on my choker set at my sister's reception.",
    avatar_url: null,
    active: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    customer_name: "Sanjana Roy",
    location: "Kolkata, West Bengal",
    rating: 5,
    review_text:
      "Ordered the temple design pendant set. The intricate gold finish and stone work are absolutely flawless!",
    avatar_url: null,
    active: true,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    customer_name: "Kavya Reddy",
    location: "Hyderabad, Telangana",
    rating: 5,
    review_text:
      "Super fast dispatch and exceptional quality. Nethiel Jewelry is now my go-to destination for festive accessories.",
    avatar_url: null,
    active: true,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const displayList = testimonials && testimonials.length > 0 ? testimonials : SEED_TESTIMONIALS;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [displayList]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.85;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 my-14 select-none">
      <div className="bg-[#D0E6F7] dark:bg-neutral-900 border border-[#A8D3F5] dark:border-neutral-800 rounded-sm p-6 sm:p-8 md:p-10 space-y-6 shadow-sm text-neutral-900 dark:text-white">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-[#CBDFF2] dark:border-neutral-800 pb-4">
          <div>
            <span className="block text-[10px] font-bold tracking-[0.25em] text-[#0284C7] dark:text-sky-400 uppercase mb-1">
              WHAT OUR CLIENTS SAY
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif-luxury font-medium tracking-wide text-[#1E3A5F] dark:text-white uppercase mt-0.5">
              CLIENT REVIEWS &amp; TESTIMONIALS
            </h2>
          </div>

          {/* Carousel Slide Controls */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2.5 rounded-full border border-[#CBDFF2] dark:border-neutral-700 bg-white dark:bg-neutral-950 text-[#1E3A5F] dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#0284C7] hover:text-white hover:border-[#0284C7] transition-colors cursor-pointer shadow-2xs"
              aria-label="Previous Testimonials Slide"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2.5 rounded-full border border-[#CBDFF2] dark:border-neutral-700 bg-white dark:bg-neutral-950 text-[#1E3A5F] dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#0284C7] hover:text-white hover:border-[#0284C7] transition-colors cursor-pointer shadow-2xs"
              aria-label="Next Testimonials Slide"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Testimonials Horizontal Slider (4 Cards per View on Desktop) */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-1 scroll-smooth"
        >
          {displayList.map((t) => {
            // Generate initials for avatar fallback
            const initials = t.customer_name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={t.id}
                className="w-[85vw] sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-0.85rem)] lg:w-[calc(25%-0.85rem)] flex-shrink-0 snap-start bg-white dark:bg-neutral-950 border border-[#D8E9F7] dark:border-neutral-800 rounded-sm p-5 space-y-3.5 shadow-2xs hover:shadow-md hover:border-[#0284C7]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-[#F59E0B]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          fill={i < t.rating ? "#F59E0B" : "none"}
                          className={i < t.rating ? "text-[#F59E0B]" : "text-neutral-300 dark:text-neutral-700"}
                        />
                      ))}
                      <span className="text-xs font-bold text-[#1E3A5F] dark:text-white ml-1.5 font-mono">
                        {t.rating}.0
                      </span>
                    </div>
                    <Quote size={20} className="text-[#0284C7]/30 shrink-0" />
                  </div>

                  {/* Review Body */}
                  <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed italic line-clamp-4">
                    “{t.review_text}”
                  </p>
                </div>

                {/* Customer Info Footer */}
                <div className="flex items-center space-x-3 pt-3 border-t border-neutral-100 dark:border-neutral-850 mt-2">
                  {t.avatar_url ? (
                    <img
                      src={t.avatar_url}
                      alt={t.customer_name}
                      className="w-9 h-9 rounded-full object-cover border border-[#0284C7]/40"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#0284C7] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                  )}
                  <div className="truncate">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E3A5F] dark:text-white truncate">
                      {t.customer_name}
                    </h4>
                    {t.location && (
                      <p className="text-[10px] text-[#0284C7] dark:text-sky-400 font-light truncate">
                        {t.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
