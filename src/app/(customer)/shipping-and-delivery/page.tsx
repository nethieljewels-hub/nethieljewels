import type { Metadata } from "next";
import { Truck, Clock, Globe, AlertTriangle, Phone, Mail, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Nethiel Jewelry",
  description: "Read Nethiel Jewelry's official Shipping & Delivery Policy. Details on delivery timelines, tracking, international shipping, and customer support.",
};

export default function ShippingAndDeliveryPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Hero Title Section */}
        <div className="text-center space-y-3 border-b border-neutral-200/80 dark:border-neutral-800 pb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#1E3A5F]/5 dark:bg-white/5 text-[#1E3A5F] dark:text-[#DFCB7F] mb-2">
            <Truck size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-medium tracking-wider text-[#1E3A5F] dark:text-[#DFCB7F] uppercase">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto tracking-wide leading-relaxed">
            Nethiel Jewelry offers shipping across India and worldwide shipping options where available.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-8 text-neutral-800 dark:text-neutral-200">

          {/* Section 1: Shipping */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <ShieldCheck size={20} />
              <h2 className="text-lg font-serif-luxury font-bold tracking-wide uppercase">
                Shipping Overview
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Nethiel Jewelry offers shipping across India and worldwide shipping options where available.
            </p>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We carefully pack every order before dispatch to ensure that your jewellery reaches you safely.
            </p>
          </section>

          {/* Section 2: Delivery Time */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <Clock size={20} />
              <h2 className="text-lg font-serif-luxury font-bold tracking-wide uppercase">
                Delivery Time
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Our standard delivery time is <strong className="font-semibold text-[#1E3A5F] dark:text-[#DFCB7F]">7–8 business days</strong> from the date of order confirmation/payment, subject to courier availability and the delivery location.
            </p>

            <div className="space-y-2 pt-1">
              <p className="text-xs font-semibold text-[#1E3A5F] dark:text-white uppercase tracking-wider">
                Delivery may occasionally take longer due to:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300">
                {[
                  "Courier delays",
                  "Weather conditions",
                  "Public holidays",
                  "Natural events",
                  "Incorrect or incomplete address details",
                  "Circumstances beyond our control",
                ].map((reason, idx) => (
                  <li key={idx} className="flex items-center space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DFCB7F] shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed pt-2 bg-neutral-50 dark:bg-neutral-950 p-3.5 rounded-xs border-l-2 border-[#DFCB7F]">
              Once your order has been dispatched, tracking details will be shared with you whenever available.
            </p>
          </section>

          {/* Section 3: Important Address Notice */}
          <section className="bg-amber-500/10 dark:bg-amber-500/15 border-l-4 border-amber-500 p-6 rounded-xs space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-amber-900 dark:text-amber-300 font-bold uppercase tracking-wider text-sm sm:text-base">
              <AlertTriangle size={20} className="shrink-0" />
              <span>Important Address Verification</span>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-800 dark:text-neutral-200 leading-relaxed">
              Please ensure that your name, phone number and complete delivery address are entered correctly while placing your order.
            </p>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
              Nethiel Jewelry is not responsible for delivery issues caused by incorrect or incomplete information provided by the customer.
            </p>
          </section>

          {/* Section 4: International Shipping */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <Globe size={20} />
              <h2 className="text-lg font-serif-luxury font-bold tracking-wide uppercase">
                International Shipping
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
              International shipping is available where supported.
            </p>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
              International delivery times may vary depending on the destination country, customs clearance and courier services. Any customs duties, import taxes or other charges imposed by the destination country may be payable by the customer.
            </p>
          </section>

          {/* Contact Details Card */}
          <section className="bg-[#1E3A5F] text-white dark:bg-neutral-900 border border-[#162B47] dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-5 shadow-sm">
            <h2 className="text-lg font-serif-luxury font-bold text-[#DFCB7F] tracking-wide uppercase border-b border-white/15 pb-3">
              Shipping-Related Questions
            </h2>
            <p className="text-xs sm:text-sm font-light text-white/90 leading-relaxed">
              For any questions or tracking assistance regarding your shipment, please reach out to us:
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
