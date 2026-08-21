import type { Metadata } from "next";
import { ShieldCheck, Mail, Phone, Lock, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Nethiel Jewelry",
  description: "Read the Privacy Policy of Nethiel Jewelry. Learn how we handle, protect, and respect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Hero Title Section */}
        <div className="text-center space-y-3 border-b border-neutral-200/80 dark:border-neutral-800 pb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#1E3A5F]/5 dark:bg-white/5 text-[#1E3A5F] dark:text-[#DFCB7F] mb-2">
            <ShieldCheck size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-medium tracking-wider text-[#1E3A5F] dark:text-[#DFCB7F] uppercase">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto tracking-wide leading-relaxed">
            Nethiel Jewelry respects your privacy and is committed to protecting the personal information you provide while using our website.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-8 text-neutral-800 dark:text-neutral-200">

          {/* Section 1: Information We May Collect */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-4 shadow-2xs">
            <h2 className="text-lg font-serif-luxury font-bold text-[#1E3A5F] dark:text-[#DFCB7F] tracking-wide uppercase border-b border-neutral-100 dark:border-neutral-800 pb-3">
              Information We May Collect
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
              When you place an order or contact us, we may collect information such as:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300">
              {[
                "Name",
                "Mobile number",
                "Email address",
                "Billing address",
                "Shipping address",
                "Order details",
                "Payment-related information required to process your order",
                "Information you voluntarily provide when contacting customer support",
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DFCB7F] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-4 shadow-2xs">
            <h2 className="text-lg font-serif-luxury font-bold text-[#1E3A5F] dark:text-[#DFCB7F] tracking-wide uppercase border-b border-neutral-100 dark:border-neutral-800 pb-3">
              How We Use Your Information
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We may use your information to:
            </p>
            <ul className="space-y-2.5 pt-1 text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300">
              {[
                "Process and deliver your orders",
                "Provide order and shipping updates",
                "Process eligible returns, exchanges and refunds",
                "Respond to customer enquiries",
                "Provide customer support",
                "Improve our website and services",
                "Prevent fraud, misuse and unauthorised activity",
                "Meet applicable legal and regulatory requirements",
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-2.5">
                  <CheckCircle2 size={15} className="text-[#1E3A5F] dark:text-[#DFCB7F] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3: Payment Information */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <Lock size={18} />
              <h2 className="text-lg font-serif-luxury font-bold tracking-wide uppercase">
                Payment Information
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1">
              Payments may be processed through third-party payment service providers.
            </p>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xs border-l-2 border-[#1E3A5F] dark:border-[#DFCB7F]">
              Nethiel Jewelry does not intentionally collect or store complete card numbers, CVV numbers or other sensitive payment credentials when payment is processed through a third-party payment gateway.
            </p>
          </section>

          {/* Section 4: Sharing Information */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-4 shadow-2xs">
            <h2 className="text-lg font-serif-luxury font-bold text-[#1E3A5F] dark:text-[#DFCB7F] tracking-wide uppercase border-b border-neutral-100 dark:border-neutral-800 pb-3">
              Sharing Information
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We may share necessary information with service providers such as:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300">
              {[
                "Courier and logistics partners",
                "Payment service providers",
                "Website/technology service providers",
                "Other service providers required to fulfil your order",
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DFCB7F] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed pt-2">
              We share information only as reasonably necessary to provide our services, operate the website, protect our business and comply with applicable law.
            </p>
          </section>

          {/* Section 5: Data Security */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-3 shadow-2xs">
            <h2 className="text-lg font-serif-luxury font-bold text-[#1E3A5F] dark:text-[#DFCB7F] tracking-wide uppercase border-b border-neutral-100 dark:border-neutral-800 pb-3">
              Data Security
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
              We take reasonable measures to protect customer information against unauthorised access, misuse, loss or disclosure.
            </p>
            <p className="text-xs sm:text-sm font-light text-neutral-500 dark:text-neutral-400 italic">
              However, no online system can be guaranteed to be completely secure.
            </p>
          </section>

          {/* Section 6: Your Information & Contact Details */}
          <section className="bg-[#1E3A5F] text-white dark:bg-neutral-900 border border-[#162B47] dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-5 shadow-sm">
            <h2 className="text-lg font-serif-luxury font-bold text-[#DFCB7F] tracking-wide uppercase border-b border-white/15 pb-3">
              Your Information &amp; Concerns
            </h2>
            <p className="text-xs sm:text-sm font-light text-white/90 leading-relaxed">
              You may contact us regarding your personal information or privacy-related concerns:
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
                  <p className="text-white/60 text-[10px] uppercase tracking-wider">Email Inquiry</p>
                  <p className="font-semibold text-white truncate">nethieljewelry@gmail.com</p>
                </div>
              </a>
            </div>
          </section>

          {/* Legal Compliance Box (DPDP Act, 2023) */}
          <div className="bg-neutral-100 dark:bg-neutral-900 border-l-4 border-[#1E3A5F] dark:border-[#DFCB7F] p-5 rounded-xs space-y-1 text-xs text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
            <p className="font-semibold text-neutral-800 dark:text-white uppercase tracking-wider text-[10px] pb-0.5">
              Legal Compliance Notice
            </p>
            <p>
              Our privacy practices are subject to applicable Indian data-protection laws and regulations, including the Digital Personal Data Protection Act, 2023 and applicable rules. The DPDP Rules, 2025 were notified by MeitY in November 2025, with provisions coming into force according to their stated phased timeline.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
