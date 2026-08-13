import { createClient } from "@/utils/supabase/server";
import { Mail, Phone, MapPin, MessageSquare, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { DEFAULT_WHATSAPP_NUMBER, DEFAULT_WHATSAPP_DISPLAY_PHONE } from "@/utils/constants";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Contact Us | Nethiel Jewelry",
  description: "Get in touch with Nethiel Jewelry via WhatsApp, Phone, Email, or Instagram. Direct order & customer support lines.",
};

export default async function ContactPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  const whatsappPhone = settings?.whatsapp || DEFAULT_WHATSAPP_NUMBER;
  const whatsappClean = whatsappPhone.replace(/[^\d]/g, "");
  const displayPhone = settings?.phone || settings?.whatsapp || DEFAULT_WHATSAPP_DISPLAY_PHONE;
  const emailAddr = settings?.email || "support@nethieljewelry.com";
  const instaUrl = settings?.instagram || "https://instagram.com/nethieljewelry";
  const addressText = settings?.address || "Vengara, Tharayittal 676304";

  const faqs = [
    {
      q: "How do I place an order?",
      a: "Our checkout is integrated via WhatsApp to offer a highly personalized shopping experience. Simply click the \"Order on WhatsApp\" or \"Chat Now\" button on any product page, and our curator will assist you with confirming sizes, materials, and dispatch details in seconds."
    },
    {
      q: "What metals and stones are used in Nethiel Jewelry?",
      a: "We work exclusively with high-end, long-lasting metals including 18K Gold Plated Brass, Premium Sterling Silver, and carefully selected natural and synthetic gemstones. Every piece is built to hold its brilliant luster."
    },
    {
      q: "What are your shipping timelines and rates?",
      a: "We provide fully insured shipping across India. Orders are typically processed and handed to courier services within 24 to 48 hours, arriving at your doorstep in 3 to 5 business days."
    },
    {
      q: "How do I choose the correct ring size?",
      a: "Our curators can guide you through finding the perfect ring or chain size directly on WhatsApp. You can also refer to the standard measurements specified on individual product details."
    },
    {
      q: "What is your return & exchange policy?",
      a: "Due to the custom and handcrafted nature of our products, all sales are final. However, we offer sizing modifications. Please contact our support team within 48 hours of delivery if your jewelry requires adjustment."
    }
  ];

  return (
    <div className="w-full bg-transparent select-none pb-20">
      {/* Main Communication Channels */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* WhatsApp Support Card */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-850 bg-neutral-50/40 dark:bg-neutral-900/10 p-8 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-800 hover:scale-[1.01] transition-all duration-300 space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-xs">
                <MessageSquare size={20} strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-widest text-brand-gold-dark uppercase">01 / ONLINE MESSAGING</span>
                <h2 className="text-lg font-serif-luxury font-medium tracking-wide text-black dark:text-white uppercase">
                  WHATSAPP CHAT
                </h2>
                <p className="text-xs font-light text-neutral-550 dark:text-neutral-400 leading-relaxed">
                  Inquire about specific pieces, send references, or complete order details instantly.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappClean}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-black text-white dark:bg-white dark:text-black w-full py-3 text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors rounded-sm shadow-xs"
              >
                <span>CHAT WITH US</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Call Line Card */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-855 bg-neutral-50/40 dark:bg-neutral-900/10 p-8 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-800 hover:scale-[1.01] transition-all duration-300 space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white flex items-center justify-center shadow-xs">
                <Phone size={20} strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-widest text-brand-gold-dark uppercase">02 / VOICE CALLS</span>
                <h2 className="text-lg font-serif-luxury font-medium tracking-wide text-black dark:text-white uppercase">
                  DIRECT PHONE LINE
                </h2>
                <p className="text-xs font-light text-neutral-550 dark:text-neutral-400 leading-relaxed">
                  Reach out directly for urgent updates, shipping changes, or specific requests.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <a
                href={`tel:${displayPhone.replace(/[^\d]/g, "")}`}
                className="inline-flex items-center justify-center space-x-2 border border-black dark:border-white text-black dark:text-white w-full py-3 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-sm shadow-xs"
              >
                <span>{displayPhone}</span>
                <Phone size={13} />
              </a>
            </div>
          </div>

          {/* Email Support Card */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-855 bg-neutral-50/40 dark:bg-neutral-900/10 p-8 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-800 hover:scale-[1.01] transition-all duration-300 space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white flex items-center justify-center shadow-xs">
                <Mail size={20} strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-widest text-brand-gold-dark uppercase">03 / FORMAL ENQUIRY</span>
                <h2 className="text-lg font-serif-luxury font-medium tracking-wide text-black dark:text-white uppercase">
                  EMAIL INQUIRIES
                </h2>
                <p className="text-xs font-light text-neutral-550 dark:text-neutral-400 leading-relaxed">
                  Send bulk order inquiries, brand partnerships, or other formal suggestions.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <a
                href={`mailto:${emailAddr}`}
                className="inline-flex items-center justify-center space-x-2 border border-black dark:border-white text-black dark:text-white w-full py-3 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-sm shadow-xs"
              >
                <span>SEND AN EMAIL</span>
                <Mail size={13} />
              </a>
            </div>
          </div>

          {/* Instagram DM Card */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-855 bg-neutral-50/40 dark:bg-neutral-900/10 p-8 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-800 hover:scale-[1.01] transition-all duration-300 space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white flex items-center justify-center shadow-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-widest text-brand-gold-dark uppercase">04 / SOCIAL CHANNELS</span>
                <h2 className="text-lg font-serif-luxury font-medium tracking-wide text-black dark:text-white uppercase">
                  INSTAGRAM DM
                </h2>
                <p className="text-xs font-light text-neutral-550 dark:text-neutral-400 leading-relaxed">
                  Follow us for new collections, jewelry care tips, and daily inspiration.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <a
                href={instaUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center space-x-2 border border-black dark:border-white text-black dark:text-white w-full py-3 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-sm shadow-xs"
              >
                <span>
                  {settings?.instagram
                    ? (() => {
                      try {
                        const path = new URL(settings.instagram).pathname.replace(/\/+$/, "");
                        const handle = path.split("/").pop();
                        return handle ? `@${handle}` : "FOLLOW";
                      } catch {
                        return "FOLLOW";
                      }
                    })()
                    : "@nethieljewelry"}
                </span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Location Block */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-850 bg-neutral-50/30 dark:bg-neutral-900/5 p-8 flex items-start space-x-5 hover:border-neutral-300 dark:hover:border-neutral-800 transition-all duration-300">
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full flex-shrink-0 text-black dark:text-white">
            <MapPin size={22} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-brand-gold-dark uppercase">STUDIO VISIT</span>
            <h3 className="text-base font-serif-luxury font-medium tracking-wider text-black dark:text-white uppercase">
              STUDIO LOCATION
            </h3>
            <p className="text-xs font-light text-neutral-605 dark:text-neutral-400 leading-relaxed">
              {addressText}
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-t border-neutral-200 dark:border-neutral-850 pt-16 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 dark:text-neutral-400 uppercase">
              ASSISTANCE
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-black dark:text-white uppercase mt-0.5">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <div className="w-12 h-[1px] bg-brand-gold-dark mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-xs font-bold tracking-wider text-black dark:text-white uppercase border-l-2 border-brand-gold-dark pl-3">
                  {faq.q}
                </h3>
                <p className="text-xs font-light text-neutral-500 dark:text-neutral-400 leading-relaxed pl-3.5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
