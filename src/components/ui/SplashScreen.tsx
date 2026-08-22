"use client";

import { useState, useEffect } from "react";

/**
 * Premium splash/welcome animation for Nethiel Jewelry.
 * Renders immediately (no flash), plays fast once per browser session.
 */
export default function SplashScreen() {
  // Start visible so the splash covers the page on first paint
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState<"letters" | "tagline" | "exit">("letters");

  useEffect(() => {
    // If already shown this session, dismiss immediately
    if (sessionStorage.getItem("nethiel_splash_shown")) {
      setShow(false);
      return;
    }

    // Quick Timeline:
    //  0ms    – letters animate in (snappy CSS stagger)
    //  450ms  – tagline & gold line fade in
    //  1100ms – mark as shown + begin exit fade
    //  1500ms – unmount overlay
    const taglineTimer = setTimeout(() => setPhase("tagline"), 450);
    const exitTimer = setTimeout(() => {
      sessionStorage.setItem("nethiel_splash_shown", "1");
      setPhase("exit");
    }, 1100);
    const unmountTimer = setTimeout(() => setShow(false), 1500);

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!show) return null;

  const letters = ["N", "e", "t", "h", "i", "e", "l"];

  return (
    <div
      id="nethiel-splash-screen"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#111111] transition-opacity duration-400 ease-out select-none ${
        phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* Decorative top & bottom gold lines */}
      <div
        className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent transition-opacity duration-500 ${
          phase === "letters" ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent transition-opacity duration-500 ${
          phase === "letters" ? "opacity-0" : "opacity-100"
        }`}
      />

      <div className="flex flex-col items-center justify-center text-center px-4">
        {/* Nethiel Letters */}
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
              style={{
                animationDelay: `${i * 50}ms`,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Gold Underline Accent */}
        <div
          className={`mt-2 sm:mt-3 h-[2px] bg-gradient-to-r from-[#D4AF37]/30 via-[#D4AF37] to-[#D4AF37]/30 rounded-full transition-all duration-400 ease-out ${
            phase === "tagline" || phase === "exit" ? "w-36 sm:w-56 opacity-100" : "w-0 opacity-0"
          }`}
        />

        {/* Tagline / JEWELRY Ornament */}
        <div
          className={`mt-4 sm:mt-6 flex items-center justify-center space-x-3 sm:space-x-4 transition-all duration-400 ease-out ${
            phase === "tagline" || phase === "exit"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          <span className="h-[1.5px] w-6 sm:w-14 md:w-18 bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37] opacity-80" />

          <p className="font-cinzel font-extrabold text-[10px] sm:text-xs md:text-sm tracking-[0.45em] sm:tracking-[0.55em] text-[#D4AF37] uppercase pl-[0.45em] sm:pl-[0.55em]">
            JEWELRY
          </p>

          <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37] opacity-80" />
          <span className="h-[1.5px] w-6 sm:w-14 md:w-18 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>
      </div>
    </div>
  );
}
