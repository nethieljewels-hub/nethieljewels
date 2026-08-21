import type { Metadata } from "next";
import { Headphones, Mail, Phone, Video, ShieldAlert, CheckCircle2, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Grievance Redressal & Customer Support | Nethiel Jewelry",
  description: "Find details on Grievance Redressal & Customer Support at Nethiel Jewelry. Contact our support team for orders, returns, and complaints.",
};

export default function GrievanceRedressalPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Hero Title Section */}
        <div className="text-center space-y-3 border-b border-neutral-200/80 dark:border-neutral-800 pb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#1E3A5F]/5 dark:bg-white/5 text-[#1E3A5F] dark:text-[#DFCB7F] mb-2">
            <Headphones size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-medium tracking-wider text-[#1E3A5F] dark:text-[#DFCB7F] uppercase">
            Grievance Redressal &amp; Customer Support
          </h1>
          <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto tracking-wide leading-relaxed">
            We are committed to providing our customers with a smooth shopping experience and addressing genuine concerns fairly.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-neutral-800 dark:text-neutral-200">

          {/* Section 1: Customer Support Overview & Channels */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-5 shadow-2xs">
            <h2 className="text-lg font-serif-luxury font-bold text-[#1E3A5F] dark:text-[#DFCB7F] tracking-wide uppercase border-b border-neutral-100 dark:border-neutral-800 pb-3">
              Nethiel Jewelry Customer Support
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
              For assistance regarding orders, delivery, damaged products, returns, exchanges, refunds or other website-related concerns, please contact us:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <a
                href="https://wa.me/919778715422"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-3.5 p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 rounded-xs hover:border-[#1E3A5F] dark:hover:border-[#DFCB7F] transition-all group"
              >
                <div className="p-2.5 rounded-full bg-[#1E3A5F]/10 dark:bg-white/10 text-[#1E3A5F] dark:text-[#DFCB7F] group-hover:bg-[#1E3A5F] group-hover:text-white dark:group-hover:bg-[#DFCB7F] dark:group-hover:text-black transition-colors shrink-0">
                  <Phone size={18} />
                </div>
                <div className="text-xs">
                  <p className="text-neutral-500 dark:text-neutral-400 text-[10px] uppercase tracking-wider font-medium">WhatsApp Support</p>
                  <p className="font-semibold text-[#1E3A5F] dark:text-white text-sm">+91 97787 15422</p>
                </div>
              </a>

              <a
                href="mailto:nethieljewelry@gmail.com"
                className="flex items-center space-x-3.5 p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 rounded-xs hover:border-[#1E3A5F] dark:hover:border-[#DFCB7F] transition-all group"
              >
                <div className="p-2.5 rounded-full bg-[#1E3A5F]/10 dark:bg-white/10 text-[#1E3A5F] dark:text-[#DFCB7F] group-hover:bg-[#1E3A5F] group-hover:text-white dark:group-hover:bg-[#DFCB7F] dark:group-hover:text-black transition-colors shrink-0">
                  <Mail size={18} />
                </div>
                <div className="text-xs truncate">
                  <p className="text-neutral-500 dark:text-neutral-400 text-[10px] uppercase tracking-wider font-medium">Email Inquiry</p>
                  <p className="font-semibold text-[#1E3A5F] dark:text-white text-sm truncate">nethieljewelry@gmail.com</p>
                </div>
              </a>
            </div>

            <div className="bg-[#1E3A5F]/5 dark:bg-white/5 border-l-2 border-[#1E3A5F] dark:border-[#DFCB7F] p-4 rounded-xs text-xs text-neutral-700 dark:text-neutral-300 font-light leading-relaxed flex items-start space-x-2.5">
              <CheckCircle2 size={16} className="text-[#1E3A5F] dark:text-[#DFCB7F] shrink-0 mt-0.5" />
              <span>When contacting us regarding an order, please include your order number and relevant details so that we can assist you efficiently.</span>
            </div>
          </section>

          {/* Section 2: Damaged Product Complaints */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <Video size={20} />
              <h2 className="text-lg font-serif-luxury font-bold tracking-wide uppercase">
                Damaged Product Complaints
              </h2>
            </div>
            <div className="bg-amber-500/10 dark:bg-amber-500/15 border-l-4 border-amber-500 p-5 rounded-xs space-y-2">
              <p className="flex items-center space-x-2 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider">
                <ShieldAlert size={16} className="shrink-0" />
                <span>Verification Requirement</span>
              </p>
              <p className="text-xs sm:text-sm font-light text-neutral-800 dark:text-neutral-200 leading-relaxed">
                For damaged-product complaints, please follow the Return &amp; Exchange Policy and submit your claim within <strong className="font-semibold">24 hours of receiving the parcel</strong>, together with the required <strong className="font-semibold">360° unboxing video</strong>.
              </p>
            </div>
          </section>

          {/* Section 3: Grievances */}
          <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-sm p-6 sm:p-8 space-y-4 shadow-2xs">
            <div className="flex items-center space-x-2.5 text-[#1E3A5F] dark:text-[#DFCB7F]">
              <FileText size={20} />
              <h2 className="text-lg font-serif-luxury font-bold tracking-wide uppercase">
                Grievances
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Customers may submit complaints through WhatsApp or email.
            </p>
            <p className="text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Complaints will be reviewed and addressed in accordance with applicable law and Nethiel Jewelry’s policies.
            </p>
          </section>

          {/* Legal Compliance Box (Indian E-Commerce Rules) */}
          <div className="bg-[#1E3A5F] text-white dark:bg-neutral-900 border border-[#162B47] dark:border-neutral-800 p-6 sm:p-8 rounded-sm space-y-2 text-center shadow-sm">
            <h3 className="text-base font-serif-luxury font-bold text-[#DFCB7F] uppercase tracking-wider">
              Regulatory Compliance Notice
            </h3>
            <p className="text-xs sm:text-sm font-light text-white/90 leading-relaxed max-w-2xl mx-auto">
              Indian e-commerce rules provide for grievance mechanisms, including acknowledgement and redressal requirements.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
