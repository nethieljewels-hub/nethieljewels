import type { Metadata } from "next";
import { HelpCircle, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Nethiel Jewelry",
  description: "Find answers to commonly asked questions about Nethiel Jewelry orders, delivery, care, and payments.",
};

export default function FAQPage() {
  const faqs = [
    {
      q: "How do I place an order with Nethiel Jewelry?",
      a: "You can browse our collections online and click 'Order on WhatsApp' or 'Buy Now' to connect directly with our support team for order confirmation.",
    },
    {
      q: "What is your standard delivery timeframe?",
      a: "Our standard delivery timeframe across India is 7–8 business days.",
    },
    {
      q: "What should I do if my parcel arrives damaged?",
      a: "Please record an uninterrupted 360° unboxing video from parcel seal opening and send it to our WhatsApp support (+91 97787 15422) within 24 hours of delivery.",
    },
    {
      q: "How should I care for my jewelry?",
      a: "Keep your jewelry away from direct water, perfume, sprays, and chemicals. Store each piece in a dry ziplock or soft fabric pouch.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Hero Title Section */}
        <div className="text-center space-y-3 border-b border-neutral-200/80 dark:border-neutral-800 pb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#1E3A5F]/5 dark:bg-white/5 text-[#1E3A5F] dark:text-[#DFCB7F] mb-2">
            <HelpCircle size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-medium tracking-wider text-[#1E3A5F] dark:text-[#DFCB7F] uppercase">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto tracking-wide leading-relaxed">
            Quick answers to common questions regarding our fine jewelry, delivery, and services.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 space-y-2 shadow-2xs">
              <h3 className="text-sm sm:text-base font-serif-luxury font-bold text-[#1E3A5F] dark:text-[#DFCB7F] tracking-wide flex items-center space-x-2">
                <ChevronRight size={16} className="text-[#DFCB7F] shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-300 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
