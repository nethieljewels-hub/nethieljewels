import type { Metadata } from "next";
import { Scale, Truck, Video, ShieldAlert, CheckCircle2, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Nethiel Jewelry",
  description: "Read the Terms & Conditions of Nethiel Jewelry governing product availability, pricing, delivery, returns, and website usage.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Hero Title Section */}
        <div className="text-center space-y-3 border-b border-neutral-200/80 dark:border-neutral-800 pb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#1E3A5F]/5 dark:bg-white/5 text-[#1E3A5F] dark:text-[#DFCB7F] mb-2">
            <Scale size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-medium tracking-wider text-[#1E3A5F] dark:text-[#DFCB7F] uppercase">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto tracking-wide leading-relaxed">
            By accessing or using the Nethiel Jewelry website, you agree to comply with these Terms &amp; Conditions.
          </p>
        </div>

        {/* Terms Content Sections */}
        <div className="space-y-8 text-neutral-800 dark:text-neutral-200">

          {/* Section 1: Products */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-3 shadow-2xs">
            <h2 className="text-lg font-serif-luxury font-bold text-[#1E3A5F] dark:text-[#DFCB7F] tracking-wide uppercase border-b border-neutral-100 dark:border-neutral-800 pb-3">
              Products
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
              We make reasonable efforts to ensure that product photographs, descriptions and information displayed on our website are accurate.
            </p>
            <p className="text-xs sm:text-sm font-light text-neutral-500 dark:text-neutral-400 leading-relaxed italic bg-neutral-50 dark:bg-neutral-950 p-3.5 rounded-xs border-l-2 border-[#DFCB7F]">
              Jewellery colour and appearance may vary slightly because of lighting, photography and individual screen settings.
            </p>
          </section>

          {/* Section 2: Product Availability & Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-3 shadow-2xs">
              <h2 className="text-base font-serif-luxury font-bold text-[#1E3A5F] dark:text-[#DFCB7F] tracking-wide uppercase border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
                Product Availability
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Product availability may change without prior notice.
              </p>
              <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
                If an ordered product becomes unavailable, Nethiel Jewelry may contact the customer regarding the order and provide an appropriate resolution subject to applicable law.
              </p>
            </section>

            <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-3 shadow-2xs">
              <h2 className="text-base font-serif-luxury font-bold text-[#1E3A5F] dark:text-[#DFCB7F] tracking-wide uppercase border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
                Pricing
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Product prices displayed on the website are subject to change without prior notice.
              </p>
              <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
                The price applicable to an order is the price displayed at the time the order is successfully placed and payment is completed.
              </p>
            </section>
          </div>

          {/* Section 3: Orders & Payment */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-4 shadow-2xs">
            <h2 className="text-lg font-serif-luxury font-bold text-[#1E3A5F] dark:text-[#DFCB7F] tracking-wide uppercase border-b border-neutral-100 dark:border-neutral-800 pb-3">
              Orders &amp; Payment
            </h2>
            <div className="space-y-3 text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
              <p className="flex items-start space-x-2.5">
                <CheckCircle2 size={16} className="text-[#1E3A5F] dark:text-[#DFCB7F] shrink-0 mt-0.5" />
                <span>An order is considered successfully placed once the order has been confirmed and payment has been successfully completed.</span>
              </p>
              <p className="flex items-start space-x-2.5">
                <CheckCircle2 size={16} className="text-[#1E3A5F] dark:text-[#DFCB7F] shrink-0 mt-0.5" />
                <span>Once payment has been completed, the order cannot be cancelled, modified or changed, subject to applicable law.</span>
              </p>
              <p className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xs border-l-2 border-[#1E3A5F] dark:border-[#DFCB7F] text-neutral-600 dark:text-neutral-400">
                Customers should carefully verify their product selection, quantity, shipping address and contact information before completing payment.
              </p>
            </div>
          </section>

          {/* Section 4: Delivery */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <Truck size={20} />
              <h2 className="text-lg font-serif-luxury font-bold tracking-wide uppercase">
                Delivery
              </h2>
            </div>
            <div className="p-4 bg-[#1E3A5F]/5 dark:bg-white/5 border border-[#1E3A5F]/15 dark:border-white/10 rounded-xs flex items-center space-x-3">
              <span className="font-semibold text-sm sm:text-base text-[#1E3A5F] dark:text-[#DFCB7F]">Standard Delivery Time:</span>
              <span className="text-sm font-bold text-[#1E3A5F] dark:text-white">7–8 Business Days</span>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1">
              Delivery times may vary depending on the destination, courier service and circumstances beyond our reasonable control.
            </p>
          </section>

          {/* Section 5: Returns & Exchanges */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <Video size={20} />
              <h2 className="text-lg font-serif-luxury font-bold tracking-wide uppercase">
                Returns &amp; Exchanges
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Returns/exchanges are handled according to our Return &amp; Exchange Policy.
            </p>
            <div className="bg-amber-500/10 dark:bg-amber-500/15 border-l-4 border-amber-500 p-4 rounded-xs space-y-1">
              <p className="flex items-center space-x-2 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider">
                <ShieldAlert size={16} className="shrink-0" />
                <span>Damaged Product Claim Requirement</span>
              </p>
              <p className="text-xs sm:text-sm font-light text-neutral-800 dark:text-neutral-200 leading-relaxed">
                Damaged-product claims require a <strong className="font-semibold">360° unboxing video</strong> and must be reported within <strong className="font-semibold">24 hours of delivery</strong>.
              </p>
            </div>
          </section>

          {/* Section 6: Website Content */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <FileText size={20} />
              <h2 className="text-lg font-serif-luxury font-bold tracking-wide uppercase">
                Website Content
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
              All photographs, videos, logos, graphics, product descriptions, text and other content displayed on the Nethiel Jewelry website are owned by or licensed to Nethiel Jewelry unless otherwise stated.
            </p>
            <p className="text-xs sm:text-sm font-light text-neutral-500 dark:text-neutral-400 italic">
              Unauthorised copying, reproduction, modification or commercial use of our content is prohibited.
            </p>
          </section>

          {/* Section 7: Changes to These Terms */}
          <div className="bg-[#1E3A5F] text-white dark:bg-neutral-900 border border-[#162B47] dark:border-neutral-800 p-6 sm:p-8 rounded-sm space-y-2 text-center shadow-sm">
            <h2 className="text-base font-serif-luxury font-bold text-[#DFCB7F] uppercase tracking-wider">
              Changes to These Terms
            </h2>
            <p className="text-xs sm:text-sm font-light text-white/90 leading-relaxed max-w-2xl mx-auto">
              Nethiel Jewelry may update these Terms &amp; Conditions when necessary. Updated terms will be published on this website.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
