"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, ChevronDown } from "lucide-react";
import { DEFAULT_WHATSAPP_NUMBER } from "@/utils/constants";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FooterProps {
  settings: {
    shop_name: string;
    whatsapp: string | null;
    instagram: string | null;
    facebook: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
  } | null;
  categories?: Category[];
}

export default function CustomerFooter({ settings, categories = [] }: FooterProps) {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    shop: false,
    company: false,
    legal: false,
    contact: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <footer className="w-full border-t border-[#162B47] dark:border-neutral-850 bg-[#1E3A5F] dark:bg-neutral-950 py-8 md:py-10 text-white select-none">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 items-start">
        {/* Brand block */}
        <div className="space-y-3 pb-4 md:pb-0 border-b md:border-b-0 border-white/20 dark:border-neutral-850 sm:col-span-2 lg:col-span-1">
          <Link href="/" className="focus:outline-none inline-block lg:pl-6 xl:pl-8 transition-all duration-300">
            <img
              src="/images/logo-og.png"
              alt={settings?.shop_name || "NETHIEL JEWELRY"}
              className="h-12 sm:h-14 md:h-16 w-auto max-w-[220px] object-contain transition-all duration-300"
            />
          </Link>
          <p className="text-[11px] font-light leading-relaxed tracking-wide text-white/80 dark:text-neutral-400 max-w-xs">
            Timeless elegance, handcrafted for you. Discover fine gold, silver, and gemstone jewelry designed for every occasion.
          </p>
          <div className="flex space-x-2.5 text-white pt-1">
            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#DFCB7F] transition-colors p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full shadow-2xs"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            )}
            <a
              href={settings?.facebook || "https://www.facebook.com/share/18Ern5KeBR/?mibextid=wwXIfr"}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#DFCB7F] transition-colors p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full shadow-2xs"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href={`https://wa.me/${(settings?.whatsapp || DEFAULT_WHATSAPP_NUMBER).replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#DFCB7F] transition-colors p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full shadow-2xs"
              aria-label="WhatsApp"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
              </svg>
            </a>
          </div>
        </div>

        {/* Directory links - COLLECTIONS */}
        <div className="border-b md:border-b-0 border-white/20 dark:border-neutral-850 pb-4 md:pb-0">
          <button
            type="button"
            onClick={() => toggleSection("shop")}
            className="w-full flex items-center justify-between py-1 text-left focus:outline-none md:cursor-default"
          >
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#DFCB7F] dark:text-[#DFCB7F]">
              COLLECTIONS
            </h4>
            <ChevronDown
              size={14}
              className={`text-white/70 transition-transform duration-300 md:hidden ${
                openSections.shop ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className={`${openSections.shop ? "block" : "hidden md:block"} pt-2.5 transition-all duration-300`}>
            <ul className="space-y-2 text-[11px] tracking-wider uppercase font-medium text-white/90 dark:text-neutral-400">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug || cat.id}`}
                    className="hover:text-[#DFCB7F] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Directory links - ABOUT BRAND */}
        <div className="border-b md:border-b-0 border-white/20 dark:border-neutral-850 pb-4 md:pb-0">
          <button
            type="button"
            onClick={() => toggleSection("company")}
            className="w-full flex items-center justify-between py-1 text-left focus:outline-none md:cursor-default"
          >
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#DFCB7F] dark:text-[#DFCB7F]">
              ABOUT BRAND
            </h4>
            <ChevronDown
              size={14}
              className={`text-white/70 transition-transform duration-300 md:hidden ${
                openSections.company ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className={`${openSections.company ? "block" : "hidden md:block"} pt-2.5 transition-all duration-300`}>
            <ul className="space-y-2 text-[11px] tracking-wider uppercase font-medium text-white/90 dark:text-neutral-400">
              <li>
                <Link href="/about" className="hover:text-[#DFCB7F] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#DFCB7F] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Directory links - LEGAL */}
        <div className="border-b md:border-b-0 border-white/20 dark:border-neutral-850 pb-4 md:pb-0">
          <button
            type="button"
            onClick={() => toggleSection("legal")}
            className="w-full flex items-center justify-between py-1 text-left focus:outline-none md:cursor-default"
          >
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#DFCB7F] dark:text-[#DFCB7F]">
              LEGAL
            </h4>
            <ChevronDown
              size={14}
              className={`text-white/70 transition-transform duration-300 md:hidden ${
                openSections.legal ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className={`${openSections.legal ? "block" : "hidden md:block"} pt-2.5 transition-all duration-300`}>
            <ul className="space-y-2 text-[11px] tracking-wider uppercase font-medium text-white/90 dark:text-neutral-400">
              <li>
                <Link href="/privacy-policy" className="hover:text-[#DFCB7F] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-[#DFCB7F] transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/grievance-redressal" className="hover:text-[#DFCB7F] transition-colors">
                  Grievance Redressal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info - CUSTOMER CARE */}
        <div className="border-b md:border-b-0 border-white/20 dark:border-neutral-850 pb-4 md:pb-0">
          <button
            type="button"
            onClick={() => toggleSection("contact")}
            className="w-full flex items-center justify-between py-1 text-left focus:outline-none md:cursor-default"
          >
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#DFCB7F] dark:text-[#DFCB7F]">
              CUSTOMER CARE
            </h4>
            <ChevronDown
              size={14}
              className={`text-white/70 transition-transform duration-300 md:hidden ${
                openSections.contact ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className={`${openSections.contact ? "block" : "hidden md:block"} pt-2.5 transition-all duration-300`}>
            <ul className="space-y-2 text-[11px] tracking-wider font-medium text-white/90 dark:text-neutral-400">
              <li>
                <Link href="/shipping-and-delivery" className="hover:text-[#DFCB7F] transition-colors uppercase">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns-and-exchange" className="hover:text-[#DFCB7F] transition-colors uppercase">
                  Returns &amp; Exchange
                </Link>
              </li>
              <li>
                <Link href="/cancellation-and-refund" className="hover:text-[#DFCB7F] transition-colors uppercase">
                  Cancellation &amp; Refund
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#DFCB7F] transition-colors uppercase">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/jewellery-care" className="hover:text-[#DFCB7F] transition-colors uppercase">
                  Jewellery Care
                </Link>
              </li>
              <li className="flex items-center space-x-2 pt-2 border-t border-white/15">
                <Phone size={12} className="text-[#DFCB7F] shrink-0" />
                <span className="text-white font-semibold">{settings?.whatsapp || settings?.phone || "—"}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={12} className="text-[#DFCB7F] shrink-0" />
                <a
                  href={`mailto:${settings?.email || "support@nethieljewelry.com"}`}
                  className="text-white hover:text-[#DFCB7F] font-semibold truncate transition-colors"
                >
                  {settings?.email || "support@nethieljewelry.com"}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright & Credit Bar */}
      <div className="mx-auto max-w-7xl px-6 border-t border-white/20 dark:border-neutral-850 mt-6 md:mt-8 pt-5 flex flex-col items-center justify-center text-center gap-1.5 text-[9.5px] tracking-widest uppercase text-white/70 dark:text-neutral-400 font-medium">
        <span suppressHydrationWarning>
          © {new Date().getFullYear()} {settings?.shop_name || "NETHIEL JEWELRY"}. ALL RIGHTS RESERVED.
        </span>
        <span>
          Crafted by{" "}
          <a
            href="https://www.ekodrix.com"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-[#DFCB7F] hover:underline transition-all"
          >
            Ekodrix
          </a>
        </span>
      </div>
    </footer>
  );
}
