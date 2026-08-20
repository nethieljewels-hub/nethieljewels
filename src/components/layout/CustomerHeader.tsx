"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ShoppingBag } from "lucide-react";
import SearchModal from "@/components/ui/SearchModal";
import { useCart } from "@/context/CartContext";

interface HeaderProps {
  settings: {
    shop_name: string;
  } | null;
}

export default function CustomerHeader({ settings }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { totalCount, setIsCartOpen } = useCart();

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "SHOP", path: "/products" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  const handleLinkClick = () => {
    setDrawerOpen(false);
  };

  const isScrolled = mounted && scrolled;

  return (
    <>
      <header
        suppressHydrationWarning
        className={`fixed top-0 left-0 right-0 z-45 w-full bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-850 transition-all duration-300 select-none ${isScrolled ? "py-1 shadow-xs" : "py-1.5 sm:py-2"
          }`}
      >
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="focus:outline-none flex items-center">
            <img
              src="/images/logo-og.png"
              alt={settings?.shop_name || "NETHIEL JEWELRY"}
              className="h-9 sm:h-11 md:h-12 w-auto max-w-[150px] sm:max-w-[190px] md:max-w-[220px] object-contain transition-all duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const active =
                pathname === link.path ||
                (link.path === "/products" && pathname.startsWith("/products") && !pathname.includes("category"));
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative py-1 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors ${active
                      ? "text-[#1E3A5F] font-bold"
                      : "text-[#1E3A5F] hover:opacity-80"
                    }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1E3A5F] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5 font-bold text-[#1E3A5F]">

            {/* Search Button (Mobile & Desktop) */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-1.5 focus:outline-none cursor-pointer transition-colors text-[#1E3A5F] hover:opacity-80"
              aria-label="Search Catalog"
            >
              <Search size={19} strokeWidth={2} />
            </button>

            {/* Shopping Bag Button (Mobile & Desktop with Live Counter Badge) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 focus:outline-none cursor-pointer transition-colors text-[#1E3A5F] hover:opacity-80"
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
              className="p-1 md:hidden focus:outline-none cursor-pointer transition-colors ml-1 text-[#1E3A5F] hover:opacity-80"
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

        {/* Mobile Drawer Panel */}
        <div
          className={`fixed top-0 bottom-0 left-0 z-55 w-72 max-w-[80vw] bg-[#1E3A5F] dark:bg-neutral-950 border-r border-white/20 dark:border-neutral-850 p-6 flex flex-col justify-between transition-transform duration-300 ease-out md:hidden ${drawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="space-y-8">
            <div className="relative flex items-center justify-center border-b border-white/20 dark:border-neutral-850 pb-4">
              <Link href="/" onClick={handleLinkClick} className="focus:outline-none flex items-center justify-center">
                <img
                  src="/images/logo-og.png"
                  alt={settings?.shop_name || "NETHIEL JEWELRY"}
                  className="h-20 sm:h-24 w-auto max-w-[250px] object-contain mx-auto"
                />
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute right-0 p-1 text-white hover:text-[#DFCB7F] focus:outline-none cursor-pointer transition-colors"
                aria-label="Close Menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col space-y-5">
              {navLinks.map((link) => {
                const active = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={handleLinkClick}
                    className={`text-xs uppercase tracking-[0.2em] font-bold transition-colors ${active ? "text-[#DFCB7F] font-bold" : "text-white hover:text-[#DFCB7F]"
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile Drawer Footer Actions (Search, Shopping Bag & Theme Toggle) */}
          <div className="border-t border-white/20 dark:border-neutral-850 pt-4 space-y-3">
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
