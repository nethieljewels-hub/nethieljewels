"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ShoppingBag, ChevronRight, ChevronDown, Sparkles } from "lucide-react";
import SearchModal from "@/components/ui/SearchModal";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/utils/supabase/client";

interface HeaderProps {
  settings: {
    shop_name: string;
    announcement_enabled?: boolean | null;
    announcement_text?: string | null;
    instagram?: string | null;
    whatsapp?: string | null;
    facebook?: string | null;
  } | null;
}

interface CategoryItem {
  name: string;
  slug: string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { name: "Earrings", slug: "earrings" },
  { name: "Necklaces", slug: "necklaces" },
  { name: "Chokers", slug: "chokers" },
  { name: "Bangles & Bracelets", slug: "bangles-bracelets" },
  { name: "Bridal Sets", slug: "bridal-sets" },
  { name: "Rings", slug: "rings" },
  { name: "Pendants", slug: "pendants" },
];

export default function CustomerHeader({ settings }: HeaderProps) {
  const pathname = usePathname();
  const { totalCount, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);

  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories dynamically
  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from("categories")
        .select("name, slug")
        .eq("active", true)
        .order("created_at", { ascending: true });

      if (data && data.length > 0) {
        setCategories(data);
      }
    }
    loadCategories();
  }, [supabase]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [drawerOpen]);

  const desktopNavLinks = [
    { name: "HOME", path: "/" },
    { name: "SHOP", path: "/products" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  const mobileNavLinks = [
    { name: "HOME", path: "/" },
    { name: "SHOP ALL", path: "/products" },
    { name: "NEW ARRIVALS", path: "/products?sort=newest", badge: "NEW" },
    { name: "BEST SELLERS", path: "/products?featured=true", badge: "HOT" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  const handleLinkClick = () => {
    setDrawerOpen(false);
  };

  const isScrolled = mounted && scrolled;
  const isAnnouncementActive = Boolean(settings?.announcement_enabled);
  const announcementMsg = settings?.announcement_text || "✨ Free Insured Shipping Across India on Orders Above ₹999 | Order via WhatsApp ✨";

  return (
    <>
      <header
        suppressHydrationWarning
        className="sticky top-0 z-45 w-full bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-850 transition-all duration-300 select-none shadow-xs"
      >
        {/* Top Announcement Bar with Social Icons */}
        {isAnnouncementActive && (
          <div className="w-full bg-[#0284C7] text-white text-[10px] sm:text-xs font-semibold py-1.5 px-4 tracking-wide flex items-center justify-between border-b border-sky-600 shadow-xs select-none">
            {/* Center Announcement Message */}
            <div className="flex-1 text-center truncate px-2">
              <span className="truncate">{announcementMsg}</span>
            </div>

            {/* Right Social Icons */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 flex-shrink-0">
              {/* Instagram Icon */}
              <a
                href={settings?.instagram || "https://instagram.com/nethieljewelry"}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#DFCB7F] transition-colors focus:outline-none"
                aria-label="Instagram"
                title="Instagram"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* WhatsApp Icon */}
              <a
                href={`https://wa.me/${(settings?.whatsapp || "919000000000").replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#DFCB7F] transition-colors focus:outline-none"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>

              {/* Facebook Icon */}
              <a
                href={settings?.facebook || "https://facebook.com"}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#DFCB7F] transition-colors focus:outline-none"
                aria-label="Facebook"
                title="Facebook"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        )}

        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "py-1" : "py-1.5 sm:py-2"
        }`}>
          {/* Brand Logo */}
          <Link href="/" className="focus:outline-none flex items-center pl-3 sm:pl-0">
            <img
              src="/images/logo-og.png"
              alt={settings?.shop_name || "NETHIEL JEWELRY"}
              className="h-9 sm:h-11 md:h-12 w-auto max-w-[150px] sm:max-w-[190px] md:max-w-[220px] object-contain transition-all duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {desktopNavLinks.map((link) => {
              const active =
                pathname === link.path ||
                (link.path === "/products" && pathname.startsWith("/products") && !pathname.includes("category"));
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative py-1 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors ${
                    active
                      ? "text-[#b89762] dark:text-[#DFCB7F] font-bold"
                      : "text-[#0284C7] dark:text-sky-400 hover:text-[#b89762] dark:hover:text-[#DFCB7F]"
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#b89762] dark:bg-[#DFCB7F] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5 font-bold text-[#0284C7] dark:text-sky-400">
            {/* Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-1.5 focus:outline-none cursor-pointer transition-colors text-[#0284C7] dark:text-sky-400 hover:text-[#b89762] dark:hover:text-[#DFCB7F]"
              aria-label="Search Catalog"
            >
              <Search size={19} strokeWidth={2} />
            </button>

            {/* Shopping Bag Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 focus:outline-none cursor-pointer transition-colors text-[#0284C7] dark:text-sky-400 hover:text-[#b89762] dark:hover:text-[#DFCB7F]"
              aria-label={`View Shopping Bag (${totalCount} items)`}
            >
              <ShoppingBag size={19} strokeWidth={2} />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[9px] font-bold text-black bg-[#DFCB7F] rounded-full shadow-xs animate-scale-tap leading-none">
                  {totalCount > 99 ? "99+" : totalCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="p-1 md:hidden focus:outline-none cursor-pointer transition-colors ml-1 text-[#1E3A5F] dark:text-white hover:opacity-80"
              aria-label="Open Menu"
            >
              <Menu size={22} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Mobile Drawer Overlay */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        {/* Mobile Drawer Panel (Sliding in from the RIGHT side) */}
        <div
          className={`fixed top-0 bottom-0 right-0 z-55 w-80 max-w-[85vw] bg-[#1E3A5F] dark:bg-neutral-950 border-l border-white/20 dark:border-neutral-850 p-6 flex flex-col justify-between transition-transform duration-300 ease-out md:hidden shadow-2xl ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="space-y-6 overflow-y-auto scrollbar-none pr-1">
            {/* Header in Drawer */}
            <div className="relative flex items-center justify-center border-b border-white/20 dark:border-neutral-850 pb-4 pt-1">
              <Link href="/" onClick={handleLinkClick} className="focus:outline-none flex items-center justify-center">
                <img
                  src="/images/logo-og.png"
                  alt={settings?.shop_name || "NETHIEL JEWELRY"}
                  className="h-18 sm:h-22 w-auto max-w-[200px] object-contain mx-auto"
                />
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute right-0 top-1 p-2 text-white hover:text-[#DFCB7F] focus:outline-none cursor-pointer transition-colors bg-white/10 rounded-full shadow-2xs"
                aria-label="Close Menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main Navigation Pages */}
            <nav className="flex flex-col space-y-3 pt-1">
              {mobileNavLinks.map((link) => {
                const active = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={handleLinkClick}
                    className={`flex items-center justify-between text-xs uppercase tracking-[0.2em] font-bold transition-colors py-1 ${
                      active ? "text-[#DFCB7F]" : "text-white hover:text-[#DFCB7F]"
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[9px] font-extrabold tracking-wider bg-[#DFCB7F] text-black px-2 py-0.5 rounded-full shadow-2xs">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* COLLECTIONS Accordion Section below Page Links */}
            <div className="border-t border-white/20 dark:border-neutral-850 pt-3">
              <button
                type="button"
                onClick={() => setCollectionsOpen(!collectionsOpen)}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-[#DFCB7F] transition-colors py-2 focus:outline-none cursor-pointer"
              >
                <span className="flex items-center space-x-2">
                  <Sparkles size={13} className="text-[#DFCB7F]" />
                  <span>COLLECTIONS</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`text-[#DFCB7F] transition-transform duration-300 ${
                    collectionsOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {collectionsOpen && (
                <div className="space-y-1 pt-2 pl-2 border-l border-[#DFCB7F]/30 my-1">
                  {categories.map((cat) => {
                    const isCatActive = pathname.includes(`/products`) && pathname.includes(cat.slug);
                    return (
                      <Link
                        key={cat.slug}
                        href={`/products?category=${cat.slug}`}
                        onClick={handleLinkClick}
                        className={`flex items-center justify-between text-xs font-medium transition-all py-1.5 px-3 rounded-xs ${
                          isCatActive
                            ? "bg-white/15 text-[#DFCB7F] font-bold shadow-2xs"
                            : "text-white/85 hover:text-[#DFCB7F] hover:bg-white/10"
                        }`}
                      >
                        <span className="tracking-wider uppercase text-[11px]">{cat.name}</span>
                        <ChevronRight size={12} className="text-[#DFCB7F]/60" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Drawer Footer Actions (Search & Shopping Bag) */}
          <div className="border-t border-white/20 dark:border-neutral-850 pt-4 space-y-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                setSearchOpen(true);
              }}
              className="w-full flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-white hover:text-[#DFCB7F] transition-colors cursor-pointer py-1.5"
            >
              <Search size={18} />
              <span>SEARCH &amp; PRODUCT CODE</span>
            </button>

            <div className="flex items-center justify-between py-1 border-t border-white/15 dark:border-neutral-850/60 pt-3">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setIsCartOpen(true);
                }}
                className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-white hover:text-[#DFCB7F] transition-colors cursor-pointer"
              >
                <ShoppingBag size={18} />
                <span>MY BAG ({totalCount})</span>
              </button>

              <Link
                href="/products"
                onClick={handleLinkClick}
                className="text-[10px] font-bold uppercase tracking-wider text-[#DFCB7F] hover:underline"
              >
                SHOP ALL →
              </Link>
            </div>

            <div className="text-[9px] tracking-widest uppercase text-white/70 dark:text-neutral-500 font-light pt-2 border-t border-white/15 dark:border-neutral-850/60">
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {settings?.shop_name || "NETHIEL JEWELRY"}.
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
