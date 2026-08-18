"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ChevronRight, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  product_code?: string | null;
  original_price?: number;
  selling_price?: number | null;
  price?: number;
  featured: boolean;
  images: string[];
  category_id: string;
  categories?: { name: string } | { name: string }[] | null;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input when modal opens & fetch data
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setQuery(""), 0);
      return;
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const fetchData = async () => {
      setLoading(true);
      try {
        const supabase = createClient();

        let { data: prodData } = await supabase
          .from("products")
          .select("*, categories(name)")
          .order("created_at", { ascending: false });

        if (!prodData) {
          const fallbackRes = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });
          prodData = fallbackRes.data || [];
        }

        const { data: catData } = await supabase
          .from("categories")
          .select("id, name")
          .order("created_at", { ascending: true });

        if (prodData) setProducts(prodData as Product[]);
        if (catData) setCategories(catData as Category[]);
      } catch (err) {
        console.error("Error fetching search data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getCategoryName = (p: Product): string => {
    if (!p.categories) return "";
    if (Array.isArray(p.categories)) {
      return p.categories[0]?.name || "";
    }
    return (p.categories as { name?: string }).name || "";
  };

  const cleanQuery = query.trim().toLowerCase();
  const matchingProducts = cleanQuery
    ? products.filter((p) => {
        const titleMatch = p.title ? p.title.toLowerCase().includes(cleanQuery) : false;
        const catName = getCategoryName(p).toLowerCase();
        const catMatch = catName ? catName.includes(cleanQuery) : false;
        const codeMatch = p.product_code ? p.product_code.trim().toLowerCase().includes(cleanQuery) : false;
        return titleMatch || catMatch || codeMatch;
      })
    : [];

  const popularPills = [
    { label: "All Products", search: "" },
    ...categories.map((c) => ({ label: c.name, search: c.name })),
  ];

  const suggestedProducts = products.filter((p) => p.featured).slice(0, 4);
  const displaySuggested = suggestedProducts.length > 0 ? suggestedProducts : products.slice(0, 4);

  const handleSelectProduct = (slug: string) => {
    onClose();
    router.push(`/products/${slug}`);
  };

  const handleSearchSubmit = (searchTerm: string) => {
    onClose();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/products");
    }
  };

  const getEffectivePrice = (p: Product) => {
    const orig = p.original_price ?? p.price ?? 0;
    const selling = p.selling_price;
    if (selling !== undefined && selling !== null && selling < orig) {
      return selling;
    }
    return orig;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-3 sm:pt-16 px-2.5 sm:px-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container - Compact Glassmorphic Box */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-10 text-neutral-900 dark:text-neutral-100 transition-all duration-300 p-3.5 sm:p-4 space-y-3.5">
        
        {/* Search Bar Row (Compact Pill Input + Close Button) */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-neutral-100/90 dark:bg-neutral-800/80 rounded-xl px-3 py-2 transition-all focus-within:bg-neutral-50 dark:focus-within:bg-neutral-800 focus-within:ring-1 focus-within:ring-brand-gold-dark/40">
            <Search size={16} className="text-neutral-400 dark:text-neutral-400 mr-2.5 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit(query);
                }
              }}
              placeholder="Search by name, category or code..."
              className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs font-medium tracking-wide text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-0.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-all cursor-pointer rounded-xl bg-neutral-100/80 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex-shrink-0"
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="max-h-[55vh] overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-neutral-400 space-y-1.5">
              <Loader2 size={20} className="animate-spin text-brand-gold-dark" />
              <span className="text-[10px] uppercase tracking-widest font-semibold">Searching catalog...</span>
            </div>
          ) : cleanQuery ? (
            /* Search Results State */
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[10px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                  MATCHING PRODUCTS ({matchingProducts.length})
                </span>
              </div>

              {matchingProducts.length === 0 ? (
                <div className="py-8 text-center space-y-2 bg-neutral-50/60 dark:bg-neutral-800/30 rounded-xl p-4">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    No jewelry matching &quot;<span className="font-semibold text-black dark:text-white">{query}</span>&quot;
                  </p>
                  <p className="text-[11px] text-neutral-400 font-light">
                    Try searching for jhumkas, harams, bangles, chokers, or codes.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSearchSubmit("")}
                    className="text-[11px] font-semibold text-brand-gold-dark underline hover:opacity-80 cursor-pointer pt-0.5 block mx-auto"
                  >
                    View all collections &rarr;
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {matchingProducts.map((product) => {
                    const catName = getCategoryName(product);
                    return (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.slug)}
                        className="group flex items-center justify-between p-2 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/40 hover:bg-white dark:hover:bg-neutral-800 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5 overflow-hidden">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex-shrink-0">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[8px]">
                                NO IMG
                              </div>
                            )}
                          </div>
                          <div className="truncate">
                            <h4 className="text-[11px] font-bold text-neutral-900 dark:text-white truncate uppercase tracking-tight">
                              {product.title}
                            </h4>
                            {product.product_code && (
                              <span className="inline-block text-[8px] font-mono font-semibold text-brand-brown-dark dark:text-brand-cream bg-brand-gold-dark/10 px-1 py-0.2 rounded">
                                {product.product_code}
                              </span>
                            )}
                            {catName && (
                              <span className="block text-[8px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                                {catName}
                              </span>
                            )}
                            <span className="block text-[11px] font-extrabold text-black dark:text-white font-mono">
                              ₹{getEffectivePrice(product).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 transition-all ml-1 flex-shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Default State (Popular Suggestions & Recommendations) */
            <>
              {/* Popular Suggestions Pills */}
              <div className="space-y-2">
                <div className="flex items-center gap-1 px-0.5">
                  <Sparkles size={11} className="text-brand-gold-dark" />
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                    POPULAR CATEGORIES
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularPills.map((pill, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSearchSubmit(pill.search)}
                      className="px-3 py-1 rounded-lg bg-neutral-100/90 dark:bg-neutral-800/80 text-[11px] font-medium text-neutral-800 dark:text-neutral-200 hover:bg-brand-brown-dark hover:text-white dark:hover:bg-brand-cream dark:hover:text-black transition-all duration-200 cursor-pointer shadow-2xs"
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggested Products List */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                    FEATURED COLLECTIONS
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSearchSubmit("")}
                    className="inline-flex items-center text-[11px] font-bold text-brand-brown-dark dark:text-brand-cream hover:opacity-80 transition-opacity cursor-pointer space-x-1"
                  >
                    <span>View All</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {displaySuggested.map((product) => {
                    const catName = getCategoryName(product);
                    return (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.slug)}
                        className="group flex items-center justify-between p-2 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/40 hover:bg-white dark:hover:bg-neutral-800 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5 overflow-hidden">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex-shrink-0">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[8px]">
                                NO IMG
                              </div>
                            )}
                          </div>
                          <div className="truncate">
                            <h4 className="text-[11px] font-bold text-neutral-900 dark:text-white truncate uppercase tracking-tight">
                              {product.title}
                            </h4>
                            {product.product_code && (
                              <span className="inline-block text-[8px] font-mono font-semibold text-brand-brown-dark dark:text-brand-cream bg-brand-gold-dark/10 px-1 py-0.2 rounded">
                                {product.product_code}
                              </span>
                            )}
                            {catName && (
                              <span className="block text-[8px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                                {catName}
                              </span>
                            )}
                            <span className="block text-[11px] font-extrabold text-black dark:text-white font-mono">
                              ₹{getEffectivePrice(product).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 transition-all ml-1 flex-shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Link */}
        {cleanQuery && matchingProducts.length > 0 && (
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => handleSearchSubmit(query)}
              className="inline-flex items-center text-[11px] font-bold text-brand-brown-dark dark:text-brand-cream hover:opacity-80 transition-opacity cursor-pointer space-x-1 py-1.5 px-3 rounded-lg bg-neutral-100/80 dark:bg-neutral-800/80"
            >
              <span>View all results for &quot;{query}&quot;</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

