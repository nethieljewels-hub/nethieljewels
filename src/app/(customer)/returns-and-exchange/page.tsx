import type { Metadata } from "next";
import { RotateCcw, Video, Clock, ShieldAlert, CheckCircle2, XCircle, Phone, Mail, Box } from "lucide-react";

export const metadata: Metadata = {
  title: "Return & Exchange Policy | Nethiel Jewelry",
  description: "Read Nethiel Jewelry's Return & Exchange Policy. Details on 360° unboxing video requirements, 24-hour claim window, and non-returnable scenarios.",
};

export default function ReturnsAndExchangePage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Hero Title Section */}
        <div className="text-center space-y-3 border-b border-neutral-200/80 dark:border-neutral-800 pb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#1E3A5F]/5 dark:bg-white/5 text-[#1E3A5F] dark:text-[#DFCB7F] mb-2">
            <RotateCcw size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-medium tracking-wider text-[#1E3A5F] dark:text-[#DFCB7F] uppercase">
            Return &amp; Exchange Policy
          </h1>
          <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto tracking-wide leading-relaxed">
            At Nethiel Jewelry, every product is carefully checked and packed before dispatch.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-8 text-neutral-800 dark:text-neutral-200">

          {/* Section 1: Overview */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-3 shadow-2xs">
            <h2 className="text-lg font-serif-luxury font-bold text-[#1E3A5F] dark:text-[#DFCB7F] tracking-wide uppercase border-b border-neutral-100 dark:border-neutral-800 pb-3">
              Our Return Policy
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
              At Nethiel Jewelry, every product is carefully checked and packed before dispatch.
            </p>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xs border-l-2 border-[#1E3A5F] dark:border-[#DFCB7F]">
              We accept returns/exchanges only for products that are received damaged or defective, subject to verification.
            </p>
          </section>

          {/* Section 2: Mandatory 360° Unboxing Video */}
          <section className="bg-amber-500/10 dark:bg-amber-500/15 border-l-4 border-amber-500 p-6 sm:p-8 rounded-xs space-y-4 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-amber-900 dark:text-amber-300 font-bold uppercase tracking-wider text-sm sm:text-base">
              <Video size={22} className="shrink-0" />
              <span>Mandatory 360° Unboxing Video</span>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-800 dark:text-neutral-200 leading-relaxed">
              A continuous 360° unboxing video is mandatory for any damaged-product claim.
            </p>

            <div className="space-y-2 pt-1">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                The video must:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm font-light text-neutral-800 dark:text-neutral-200">
                {[
                  "Start before opening the parcel.",
                  "Clearly show the outer package and shipping label.",
                  "Show the complete opening of the parcel.",
                  "Clearly show the product and any damage.",
                  "Be continuous and unedited, without cuts or interruptions.",
                ].map((rule, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <CheckCircle2 size={16} className="text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 italic pt-1">
              This video is required to verify that the damage occurred before or during delivery.
            </p>
          </section>

          {/* Section 3: 24-Hour Claim Period */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <Clock size={20} />
              <h2 className="text-lg font-serif-luxury font-bold tracking-wide uppercase">
                24-Hour Claim Period
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
              If you receive a damaged or defective product, you must contact Nethiel Jewelry within <strong className="font-semibold text-[#1E3A5F] dark:text-[#DFCB7F]">24 hours of receiving the parcel</strong>.
            </p>

            <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xs space-y-2">
              <p className="text-xs font-semibold text-[#1E3A5F] dark:text-white uppercase tracking-wider">
                Please send:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 pl-1">
                <li>Your order number</li>
                <li>The complete 360° unboxing video</li>
                <li>Clear photographs/videos of the damaged product</li>
              </ol>
            </div>

            <p className="text-xs sm:text-sm font-light text-red-600 dark:text-red-400 italic">
              Claims submitted after 24 hours may not be accepted.
            </p>
          </section>

          {/* Section 4: Verification */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <ShieldAlert size={20} />
              <h2 className="text-lg font-serif-luxury font-bold tracking-wide uppercase">
                Verification &amp; Resolution
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Once we receive your claim, our team will review the submitted video and evidence.
            </p>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If the claim is approved, we will provide the appropriate resolution, which may include a replacement, exchange or refund, depending on the circumstances and product availability.
            </p>
          </section>

          {/* Section 5: Non-Returnable Situations */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-4 shadow-2xs">
            <h2 className="text-lg font-serif-luxury font-bold text-[#1E3A5F] dark:text-[#DFCB7F] tracking-wide uppercase border-b border-neutral-100 dark:border-neutral-800 pb-3">
              Non-Returnable Situations
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We do not normally accept returns or exchanges for:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300">
              {[
                "Change of mind",
                "Personal preference",
                "Incorrect selection by the customer",
                "Minor differences in colour caused by photography or screen settings",
                "Damage caused after delivery",
                "Normal wear and tear",
                "Improper handling or storage",
              ].map((reason, idx) => (
                <li key={idx} className="flex items-center space-x-2.5">
                  <XCircle size={15} className="text-neutral-400 dark:text-neutral-500 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs font-light text-neutral-500 dark:text-neutral-400 italic pt-2">
              These conditions are subject to applicable consumer law.
            </p>
          </section>

          {/* Packaging Reminder */}
          <div className="bg-[#1E3A5F]/5 dark:bg-white/5 border border-[#1E3A5F]/15 dark:border-white/10 p-5 rounded-xs flex items-center space-x-3 text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300">
            <Box size={22} className="text-[#1E3A5F] dark:text-[#DFCB7F] shrink-0" />
            <span>Please do not discard the original packaging until you have checked your order and completed your unboxing video.</span>
          </div>

          {/* Contact Details Card */}
          <section className="bg-[#1E3A5F] text-white dark:bg-neutral-900 border border-[#162B47] dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-5 shadow-sm">
            <h2 className="text-lg font-serif-luxury font-bold text-[#DFCB7F] tracking-wide uppercase border-b border-white/15 pb-3">
              Return &amp; Exchange Assistance
            </h2>
            <p className="text-xs sm:text-sm font-light text-white/90 leading-relaxed">
              For any return or exchange queries, please submit your unboxing video and claim to:
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
