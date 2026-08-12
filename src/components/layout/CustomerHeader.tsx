"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, ShoppingBag } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SearchModal from "@/components/ui/SearchModal";

interface HeaderProps {
  settings: {
    shop_name: string;
    logo: string | null;
  } | null;
}

export default function CustomerHeader({ settings }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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
      {/* Announcement Bar */}
      <div className="w-full bg-[#170e0b] text-[9px] sm:text-[10px] text-brand-gold tracking-[0.2em] font-medium py-2 text-center uppercase border-b border-brand-brown-medium/20 select-none">
        Complimentary Shipping on Orders Above ₹5,000
      </div>
      <header
        suppressHydrationWarning
        className={`sticky top-0 z-45 w-full bg-brand-brown-dark transition-all duration-200 select-none border-b border-brand-brown-medium/40 ${
          isScrolled ? "py-3 shadow-md" : "py-4.5"
        }`}
      >
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="focus:outline-none flex items-center">
            <img
              src={settings?.logo || "/images/logo-nethiel.jpeg"}
              alt={settings?.shop_name || "NETHIEL JEWELRY"}
              className="h-8 sm:h-10 md:h-11 w-auto max-w-[160px] sm:max-w-[200px] object-contain"
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
                  className={`relative py-1 text-[10px] uppercase tracking-[0.2em] font-semibold transition-colors ${
                    active ? "text-brand-gold font-bold" : "text-[#d2c5bc] hover:text-white"
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-gold rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5 text-[#f5f0eb]">
            {/* Desktop-only Theme Toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Search Button (Mobile & Desktop) */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-1.5 focus:outline-none cursor-pointer text-[#d2c5bc] hover:text-brand-gold transition-colors"
              aria-label="Search Catalog"
            >
              <Search size={19} strokeWidth={2} />
            </button>

            {/* Desktop-only Shopping Bag Button */}
            <button
              type="button"
              onClick={() => router.push("/products")}
              className="hidden md:block p-1.5 focus:outline-none cursor-pointer text-[#d2c5bc] hover:text-brand-gold transition-colors"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag size={18} strokeWidth={2} />
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="p-1 md:hidden focus:outline-none cursor-pointer text-[#d2c5bc] hover:text-brand-gold transition-colors ml-1"
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
          className={`fixed top-0 bottom-0 left-0 z-55 w-72 max-w-[80vw] bg-brand-brown-dark border-r border-[#3a251c] p-6 flex flex-col justify-between transition-transform duration-300 ease-out md:hidden ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-[#3a251c] pb-4">
              <Link href="/" onClick={handleLinkClick} className="focus:outline-none">
                <span className="font-serif-luxury font-light text-lg tracking-[0.2em] text-[#faf7f2] uppercase">
                  NETHIEL
                </span>
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 text-[#d2c5bc] hover:text-white focus:outline-none cursor-pointer"
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
                    className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors ${
                      active ? "text-brand-gold font-bold" : "text-[#d2c5bc] hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile Drawer Footer Actions (Shopping Bag & Theme Toggle) */}
          <div className="border-t border-[#3a251c] pt-5 space-y-4">
            <div className="flex items-center justify-between py-1">
              <Link
                href="/products"
                onClick={handleLinkClick}
                className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#d2c5bc] hover:text-white transition-colors"
              >
                <ShoppingBag size={18} />
                <span>SHOP ALL</span>
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#705f56]">THEME</span>
                <ThemeToggle />
              </div>
            </div>

            <div className="text-[9px] tracking-widest uppercase text-[#705f56] font-light pt-2 border-t border-[#3a251c]/60">
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {settings?.shop_name || "NETHIEL JEWELRY"}.
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
