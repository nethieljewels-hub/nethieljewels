"use client";

import { useState, useEffect } from "react";

/**
 * Premium Preloader — Nethiel Jewelry.
 *
 * UX Design:
 * 1. Each letter of "Nethiel" floats up & fades in one by one (100ms stagger).
 * 2. A thin gold underline expands from center beneath the name.
 * 3. "◆ JEWELRY ◆" ornament row rises in smoothly after the name is complete.
 * 4. Everything fades out together with a gentle upward exit.
 */
export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState<"name" | "underline" | "tagline" | "exit">("name");

  // "Nethiel" = 7 letters. Last letter appears at 600ms (index 6 × 100ms).
  // Underline expands at 750ms (after last letter + 150ms settling time).
  // JEWELRY appears at 1000ms.
  // Exit at 2400ms. Unmount at 3000ms.
  useEffect(() => {
    const underlineTimer = setTimeout(() => setPhase("underline"), 600);
    const taglineTimer = setTimeout(() => setPhase("tagline"), 800);
    const exitTimer = setTimeout(() => setPhase("exit"), 1800);
    const unmountTimer = setTimeout(() => setShow(false), 2300);

    return () => {
      clearTimeout(underlineTimer);
      clearTimeout(taglineTimer);
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!show) return null;

  const letters = ["N", "e", "t", "h", "i", "e", "l"];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#111111] transition-all duration-700 ease-out select-none ${
        phase === "exit" ? "opacity-0 translate-y-[-8px] pointer-events-none" : "opacity-100 translate-y-0"
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center justify-center text-center">

        {/* Letter-by-letter "Nethiel" in Great Vibes cursive */}
        <div
          className="flex items-baseline justify-center font-script-luxury text-[#D4AF37] dark:text-[#F4C430]"
          aria-label="Nethiel"
        >
          {letters.map((letter, i) => (
            <span
              key={i}
              className={`splash-letter inline-block leading-none ${
                i === 0
                  ? "text-8xl sm:text-[7rem] md:text-[9rem] lg:text-[11rem] uppercase"
                  : "text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] lowercase"
              } ${i === 1 ? "-ml-2 sm:-ml-3 md:-ml-4" : ""}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Gold Underline — expands from center */}
        <div className="overflow-hidden mt-1 sm:mt-2 h-[2px] flex justify-center">
          <div
            className={`h-full bg-gradient-to-r from-[#D4AF37]/30 via-[#D4AF37] to-[#D4AF37]/30 dark:from-[#F4C430]/30 dark:via-[#F4C430] dark:to-[#F4C430]/30 rounded-full transition-all duration-500 ease-out ${
              phase === "underline" || phase === "tagline" || phase === "exit"
                ? "w-36 sm:w-52 md:w-64 opacity-100"
                : "w-0 opacity-0"
            }`}
          />
        </div>

        {/* JEWELRY ornament row */}
        <div
          className={`mt-3 sm:mt-4 flex items-center justify-center space-x-3 sm:space-x-4 transition-all duration-600 ease-out ${
            phase === "tagline" || phase === "exit"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          {/* Left ornament */}
          <span className="h-[1.5px] w-6 sm:w-14 md:w-18 bg-gradient-to-r from-transparent to-[#D4AF37] dark:to-[#F4C430]" />
          <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37] dark:bg-[#F4C430] opacity-80" />

          <p className="font-cinzel font-extrabold text-[10px] sm:text-sm md:text-base tracking-[0.55em] text-[#D4AF37] dark:text-[#F4C430] uppercase pl-[0.55em]">
            JEWELRY
          </p>

          {/* Right ornament */}
          <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37] dark:bg-[#F4C430] opacity-80" />
          <span className="h-[1.5px] w-6 sm:w-14 md:w-18 bg-gradient-to-l from-transparent to-[#D4AF37] dark:to-[#F4C430]" />
        </div>

      </div>
    </div>
  );
}
