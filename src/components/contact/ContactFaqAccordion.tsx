"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

interface ContactFaqAccordionProps {
  faqs: FaqItem[];
}

export function ContactFaqAccordion({ faqs }: ContactFaqAccordionProps) {
  // First item open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-3.5 pt-2">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="rounded-xl border border-[#A8D3F5] dark:border-neutral-800 bg-[#D0E6F7] dark:bg-neutral-900/80 overflow-hidden transition-all duration-300 shadow-2xs hover:border-[#0284C7]"
          >
            <button
              type="button"
              onClick={() => toggleAccordion(index)}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none select-none"
              aria-expanded={isOpen}
            >
              <h3 className="text-xs sm:text-sm font-bold tracking-wider text-[#1E3A5F] dark:text-white uppercase border-l-2 border-[#0284C7] pl-3.5 leading-snug">
                {faq.q}
              </h3>
              <div
                className={`w-7 h-7 rounded-full bg-white dark:bg-neutral-800 text-[#1E3A5F] dark:text-white flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180 bg-[#1E3A5F] text-white" : ""
                }`}
              >
                <ChevronDown size={16} />
              </div>
            </button>

            {isOpen && (
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 animate-fadeIn">
                <div className="border-t border-[#A8D3F5]/80 dark:border-neutral-800 pt-3.5">
                  <p className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed pl-3.5">
                    {faq.a}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
