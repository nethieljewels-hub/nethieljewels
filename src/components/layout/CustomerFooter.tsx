"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Mail, Phone } from "lucide-react";
import { DEFAULT_WHATSAPP_NUMBER } from "@/utils/constants";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface FooterProps {
  settings: {
    shop_name: string;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    instagram: string | null;
    facebook: string | null;
    address: string | null;
  } | null;
  categories?: CategoryItem[];
}

export default function CustomerFooter({ settings, categories = [] }: FooterProps) {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    shop: false,
    company: false,
    contact: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const instagramHandle = settings?.instagram
    ? (() => {
        try {
          const pathname = new URL(settings.instagram).pathname.replace(/\/+$/, "");
          const handle = pathname.split("/").pop();
          return handle ? `@${handle}` : settings.instagram;
        } catch {
          return settings.instagram;
        }
      })()
    : "@nethieljewelry";

  return (
    <footer className="w-full border-t border-[#3a251c] bg-brand-brown-dark py-8 md:py-10 text-[#d2c5bc] select-none">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-start">
        {/* Brand block */}
        <div className="space-y-3 pb-4 md:pb-0 border-b md:border-b-0 border-[#3a251c]/60">
          <Link href="/" className="focus:outline-none inline-block">
            <img
              src="/images/logo-latest.png"
              alt={settings?.shop_name || "NETHIEL JEWELRY"}
              className="h-7 sm:h-8 md:h-9 w-auto max-w-[130px] object-contain"
            />
          </Link>
          <p className="text-[11px] font-light leading-relaxed tracking-wide text-[#a6958a] max-w-xs">
            Timeless elegance, handcrafted for you. Discover fine gold, silver, and gemstone jewelry designed for every occasion.
          </p>
          <div className="flex space-x-2.5 text-[#faf7f2] pt-1">
            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-gold transition-colors p-1.5 bg-[#3a251c] hover:bg-[#4a3328] rounded-full"
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
              href={`https://wa.me/${(settings?.whatsapp || DEFAULT_WHATSAPP_NUMBER).replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-gold transition-colors p-1.5 bg-[#3a251c] hover:bg-[#4a3328] rounded-full"
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
        <div className="border-b md:border-b-0 border-[#3a251c]/60 pb-4 md:pb-0">
          <button
            type="button"
            onClick={() => toggleSection("shop")}
            className="w-full flex items-center justify-between py-1 text-left focus:outline-none md:cursor-default"
          >
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#faf7f2]">
              COLLECTIONS
            </h4>
            <ChevronDown
              size={14}
              className={`text-neutral-400 transition-transform duration-300 md:hidden ${
                openSections.shop ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className={`${openSections.shop ? "block" : "hidden md:block"} pt-2.5 transition-all duration-300`}>
            <ul className="space-y-2 text-[11px] tracking-wider uppercase font-medium text-[#c4b5ab]">
              <li>
                <Link href="/products" className="hover:text-brand-gold transition-colors">
                  All Jewelry
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug || cat.id}`}
                    className="hover:text-brand-gold transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Directory links - ABOUT BRAND */}
        <div className="border-b md:border-b-0 border-[#3a251c]/60 pb-4 md:pb-0">
          <button
            type="button"
            onClick={() => toggleSection("company")}
            className="w-full flex items-center justify-between py-1 text-left focus:outline-none md:cursor-default"
          >
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#faf7f2]">
              ABOUT BRAND
            </h4>
            <ChevronDown
              size={14}
              className={`text-neutral-400 transition-transform duration-300 md:hidden ${
                openSections.company ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className={`${openSections.company ? "block" : "hidden md:block"} pt-2.5 transition-all duration-300`}>
            <ul className="space-y-2 text-[11px] tracking-wider uppercase font-medium text-[#c4b5ab]">
              <li>
                <Link href="/about" className="hover:text-brand-gold transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-gold transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info - CUSTOMER CARE */}
        <div className="border-b md:border-b-0 border-[#3a251c]/60 pb-4 md:pb-0">
          <button
            type="button"
            onClick={() => toggleSection("contact")}
            className="w-full flex items-center justify-between py-1 text-left focus:outline-none md:cursor-default"
          >
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#faf7f2]">
              CUSTOMER CARE
            </h4>
            <ChevronDown
              size={14}
              className={`text-neutral-400 transition-transform duration-300 md:hidden ${
                openSections.contact ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className={`${openSections.contact ? "block" : "hidden md:block"} pt-2.5 transition-all duration-300`}>
            <ul className="space-y-2 text-[11px] tracking-wider font-medium text-[#c4b5ab]">
              <li className="flex items-center space-x-2">
                <Phone size={12} className="text-brand-gold shrink-0" />
                <span className="text-[#faf7f2] font-semibold">{settings?.whatsapp || settings?.phone || "—"}</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand-gold shrink-0"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="text-[#faf7f2] font-semibold">{instagramHandle}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={12} className="text-brand-gold shrink-0" />
                <span className="text-[#faf7f2] font-semibold truncate">{settings?.email || "support@nethieljewelry.com"}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright & Credit Bar */}
      <div className="mx-auto max-w-7xl px-6 border-t border-[#3a251c]/60 mt-6 md:mt-8 pt-5 flex flex-col items-center justify-center text-center gap-1.5 text-[9.5px] tracking-widest uppercase text-[#8c7a70] font-medium">
        <span suppressHydrationWarning>
          © {new Date().getFullYear()} {settings?.shop_name || "NETHIEL JEWELRY"}. ALL RIGHTS RESERVED.
        </span>
        <span>
          Crafted by{" "}
          <a
            href="https://www.ekodrix.com"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-[#faf7f2] hover:text-brand-gold hover:underline transition-all"
          >
            Ekodrix
          </a>
        </span>
      </div>
    </footer>
  );
}
