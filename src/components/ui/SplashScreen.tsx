"use client";

import { useState, useEffect } from "react";

/**
 * Premium splash/welcome animation for Nethiel Jewelry.
 * Renders immediately (no flash), plays once per browser session.
 */
export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState<"letters" | "tagline" | "exit">("letters");

  useEffect(() => {
    if (sessionStorage.getItem("nethiel_splash_shown")) {
      setTimeout(() => setShow(false), 0);
      return;
    }

    const taglineTimer = setTimeout(() => setPhase("tagline"), 1200);
    const exitTimer = setTimeout(() => {
      sessionStorage.setItem("nethiel_splash_shown", "1");
      setPhase("exit");
    }, 2400);
    const unmountTimer = setTimeout(() => setShow(false), 3200);

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!show) return null;

  const letters = ["N", "E", "T", "H", "I", "E", "L"];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-black transition-opacity duration-700 ease-out ${
        phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* Decorative lines */}
      <div
        className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent transition-opacity duration-1000 ${
          phase === "letters" ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent transition-opacity duration-1000 ${
          phase === "letters" ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* NETHIEL Letters */}
      <div className="flex items-center justify-center" aria-label="NETHIEL">
        {letters.map((letter, i) => (
          <span
            key={i}
            className="splash-letter inline-block font-serif-luxury font-light tracking-[0.15em] text-[#4A3328] dark:text-white uppercase select-none
              text-5xl sm:text-7xl md:text-8xl lg:text-9xl"
            style={{
              animationDelay: `${i * 100}ms`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Tagline */}
      <p
        className={`mt-4 sm:mt-6 text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.4em] sm:tracking-[0.5em] uppercase text-[#c5a880] transition-all duration-700 ease-out ${
          phase === "tagline" || phase === "exit"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3"
        }`}
      >
        Premium Jewelry
      </p>

      {/* Animated gold underline accent */}
      <div
        className={`mt-4 sm:mt-6 h-[1.5px] bg-[#c5a880] rounded-full transition-all duration-700 ease-out ${
          phase === "tagline" || phase === "exit" ? "w-16 sm:w-24 opacity-100" : "w-0 opacity-0"
        }`}
      />
    </div>
  );
}
