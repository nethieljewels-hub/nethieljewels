import type { Metadata } from "next";
import { CreditCard, Ban, ShieldCheck, Video, Clock, CheckCircle2, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | Nethiel Jewelry",
  description: "Read Nethiel Jewelry's official Cancellation & Refund Policy. Guidelines regarding non-cancellation terms after payment and eligible refund processing.",
};

export default function CancellationAndRefundPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Hero Title Section */}
        <div className="text-center space-y-3 border-b border-neutral-200/80 dark:border-neutral-800 pb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#1E3A5F]/5 dark:bg-white/5 text-[#1E3A5F] dark:text-[#DFCB7F] mb-2">
            <CreditCard size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-medium tracking-wider text-[#1E3A5F] dark:text-[#DFCB7F] uppercase">
            Cancellation &amp; Refund Policy
          </h1>
          <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto tracking-wide leading-relaxed">
            Please review your order details carefully before completing payment.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-8 text-neutral-800 dark:text-neutral-200">

          {/* Section 1: Order Cancellation */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <Ban size={20} />
              <h2 className="text-lg font-serif-luxury font-bold tracking-wide uppercase">
                Order Cancellation
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Please review your order carefully before completing payment.
            </p>
            <p className="text-xs sm:text-sm font-light text-neutral-800 dark:text-neutral-200 font-semibold bg-[#1E3A5F]/5 dark:bg-white/5 p-4 rounded-xs border-l-2 border-[#1E3A5F] dark:border-[#DFCB7F]">
              Once an order has been placed and payment has been successfully completed, the order cannot be cancelled, modified or changed.
            </p>

            <div className="space-y-2 pt-1">
              <p className="text-xs font-semibold text-[#1E3A5F] dark:text-white uppercase tracking-wider">
                This includes changes to:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300">
                {[
                  "Product",
                  "Quantity",
                  "Size or variant",
                  "Shipping address",
                  "Contact details",
                  "Any other order details",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DFCB7F] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 italic pt-2">
              Customers are requested to verify all details before completing payment.
            </p>
          </section>

          {/* Section 2: Refunds */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <ShieldCheck size={20} />
              <h2 className="text-lg font-serif-luxury font-bold tracking-wide uppercase">
                Refunds
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Refunds are considered only for eligible situations, including an approved damaged-product claim, subject to our Return &amp; Exchange Policy and applicable law.
            </p>

            <div className="bg-neutral-50 dark:bg-neutral-950 p-5 rounded-xs space-y-2.5 border-l-4 border-amber-500">
              <p className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center space-x-2">
                <Video size={16} />
                <span>For damaged-product claims:</span>
              </p>
              <ul className="space-y-2 text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300">
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 size={16} className="text-[#1E3A5F] dark:text-[#DFCB7F] shrink-0 mt-0.5" />
                  <span>A 360° unboxing video is mandatory.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <Clock size={16} className="text-[#1E3A5F] dark:text-[#DFCB7F] shrink-0 mt-0.5" />
                  <span>The claim must be submitted within 24 hours of delivery.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <ShieldCheck size={16} className="text-[#1E3A5F] dark:text-[#DFCB7F] shrink-0 mt-0.5" />
                  <span>The claim must be verified and approved by Nethiel Jewelry before a refund is issued.</span>
                </li>
              </ul>
            </div>

            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed pt-2">
              Once a refund is approved, the refund will be processed through the applicable payment method. The time taken for the amount to appear in your account may depend on your bank or payment service provider.
            </p>
          </section>

          {/* Contact Details Card */}
          <section className="bg-[#1E3A5F] text-white dark:bg-neutral-900 border border-[#162B47] dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-5 shadow-sm">
            <h2 className="text-lg font-serif-luxury font-bold text-[#DFCB7F] tracking-wide uppercase border-b border-white/15 pb-3">
              Cancellation &amp; Refund Inquiries
            </h2>
            <p className="text-xs sm:text-sm font-light text-white/90 leading-relaxed">
              For any questions regarding order status, claims, or refund assistance:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <a
                href="https://wa.me/919778715422"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-3 p-3.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xs transition-colors"
              >
                <Phone size={18} className="text-[#DFCB7F] shrink-0" />
                <div className="text-xs">
                  <p className="text-white/60 text-[10px] uppercase tracking-wider">WhatsApp Support</p>
                  <p className="font-semibold text-white">+91 97787 15422</p>
                </div>
              </a>
              <a
                href="mailto:nethieljewelry@gmail.com"
                className="flex items-center space-x-3 p-3.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xs transition-colors"
              >
                <Mail size={18} className="text-[#DFCB7F] shrink-0" />
                <div className="text-xs">
                  <p className="text-white/60 text-[10px] uppercase tracking-wider">Email Support</p>
                  <p className="font-semibold text-white truncate">nethieljewelry@gmail.com</p>
                </div>
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
