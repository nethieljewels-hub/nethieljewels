"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CustomerProductCard from "@/components/ui/CustomerProductCard";
import { Search, SlidersHorizontal, X, RotateCcw, Check } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug?: string;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  product_code?: string | null;
  original_price?: number;
  selling_price?: number | null;
  price?: number; // legacy fallback
  featured: boolean;
  images: string[];
  category_id: string;
  created_at: string;
  categories?: {
    name: string;
  };
}

interface ProductsClientProps {
  initialCategories: Category[];
  initialProducts: Product[];
  initialSearch?: string;
  initialProductCode?: string;
}

export default function ProductsClient({
  initialCategories,
  initialProducts,
  initialSearch = "",
  initialProductCode = "",
}: ProductsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryQuery = searchParams.get("category") || "";
  const initialCombinedSearch =
    searchParams.get("search") ||
    searchParams.get("product_code") ||
    searchParams.get("code") ||
    initialSearch ||
    initialProductCode;

  const [search, setSearch] = useState(initialCombinedSearch);
  const [selectedCategory, setSelectedCategory] = useState(categoryQuery);
  const [bestSellerOnly, setBestSellerOnly] = useState(false);
  const [sortKey, setSortKey] = useState("newest");

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Temporary mobile modal state
  const [tempCategory, setTempCategory] = useState(categoryQuery);
  const [tempBestSellerOnly, setTempBestSellerOnly] = useState(false);
  const [tempSortKey, setTempSortKey] = useState("newest");

  // Sync state when URL query parameter changes
  useEffect(() => {
    setTimeout(() => {
      setSelectedCategory(categoryQuery);
      if (searchParams.get("featured") === "true" || searchParams.get("filter") === "bestsellers") {
        setBestSellerOnly(true);
      } else {
        setBestSellerOnly(false);
      }
      if (initialCombinedSearch) {
        setSearch(initialCombinedSearch);
      }
    }, 0);
  }, [categoryQuery, initialCombinedSearch, searchParams]);

  // Helper to push URL changes cleanly
  const updateUrlParams = (cat: string, searchVal: string) => {
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (searchVal.trim()) params.set("search", searchVal.trim());
    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : "/products", { scroll: false });
  };

  // Open mobile modal with synced draft state
  const openMobileFilter = () => {
    setTempCategory(selectedCategory);
    setTempBestSellerOnly(bestSellerOnly);
    setTempSortKey(sortKey);
    setMobileFilterOpen(true);
  };

  // Handle category selection
  const handleCategorySelect = (val: string) => {
    setSelectedCategory(val);
    updateUrlParams(val, search);
  };

  // Handle search input change
  const handleSearchChange = (val: string) => {
    setSearch(val);
    updateUrlParams(selectedCategory, val);
  };

  // Reset all filters
  const handleReset = () => {
    setSelectedCategory("");
    setSearch("");
    setBestSellerOnly(false);
    setSortKey("newest");
    router.push("/products", { scroll: false });
  };

  // Apply mobile filter modal
  const handleApplyMobileFilter = () => {
    setSelectedCategory(tempCategory);
    updateUrlParams(tempCategory, search);
    setBestSellerOnly(tempBestSellerOnly);
    setSortKey(tempSortKey);
    setMobileFilterOpen(false);
  };

  // Reset inside mobile filter modal
  const handleResetMobileFilter = () => {
    setTempCategory("");
    setTempBestSellerOnly(false);
    setTempSortKey("newest");
  };

  // Match category object by slug or id
  const targetCategory = initialCategories.find(
    (c) => c.slug === selectedCategory || c.id === selectedCategory
  );

  // Filtering logic: Search matches title, category name, or product_code
  const filtered = initialProducts.filter((product) => {
    const matchCategory =
      selectedCategory === "" ||
      (targetCategory
        ? product.category_id === targetCategory.id
        : product.category_id === selectedCategory);

    const searchQueryTrimmed = search.trim().toLowerCase();
    const matchSearch =
      searchQueryTrimmed === "" ||
      product.title.toLowerCase().includes(searchQueryTrimmed) ||
      (product.categories?.name &&
        product.categories.name.toLowerCase().includes(searchQueryTrimmed)) ||
      (product.product_code &&
        product.product_code.trim().toLowerCase().includes(searchQueryTrimmed));

    const matchBestSeller = !bestSellerOnly || product.featured === true;

    return matchCategory && matchSearch && matchBestSeller;
  });

  // Helper function to calculate effective price (incorporating offer/selling price)
  const getEffectivePrice = (p: Product) => {
    const orig = p.original_price ?? p.price ?? 0;
    const selling = p.selling_price;
    if (selling !== undefined && selling !== null && selling < orig) {
      return selling;
    }
    return orig;
  };

  // Sorting logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "price-asc") {
      return getEffectivePrice(a) - getEffectivePrice(b);
    }
    if (sortKey === "price-desc") {
      return getEffectivePrice(b) - getEffectivePrice(a);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low → High", value: "price-asc" },
    { label: "Price: High → Low", value: "price-desc" },
  ];

  const hasActiveFilters =
    selectedCategory !== "" ||
    search.trim() !== "" ||
    bestSellerOnly ||
    sortKey !== "newest";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 space-y-6 flex-1 flex flex-col justify-start bg-transparent text-foreground">
      {/* HEADER ROW: Title & Filter/Sort Pills (with Compact Search Bar) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 dark:border-neutral-850 pb-5 gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#0284C7] dark:text-sky-400 uppercase">
            {targetCategory ? targetCategory.name : "COLLECTIONS"}
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#1E3A5F] dark:text-[#CBD5E1] uppercase mt-0.5">
            {targetCategory ? targetCategory.name : "All Products"}
          </h1>
          <p className="text-xs text-neutral-500 font-light mt-1">
            Showing {sorted.length} {sorted.length === 1 ? "piece" : "pieces"}
          </p>
        </div>

        {/* Desktop / Tablet Pills Row (Search + Best Selling + Sort) */}
        <div className="hidden md:flex flex-wrap items-center gap-2">
          {/* Compact Search Bar placed side of Best Selling */}
          <div className="relative w-52 sm:w-60 flex-shrink-0">
            <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
              <Search size={13} />
            </span>
            <input
              type="text"
              placeholder="SEARCH & PRODUCT CODE..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 text-[10px] sm:text-[11px] tracking-wider uppercase pl-8 pr-7 py-1.5 rounded-full placeholder-neutral-400 text-black dark:text-white font-semibold focus:outline-none focus:border-black dark:focus:border-white shadow-xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                aria-label="Clear search"
                className="absolute inset-y-0 right-2.5 flex items-center text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800 mx-0.5" />

          {/* Best Seller Toggle Pill */}
          <button
            type="button"
            onClick={() => setBestSellerOnly(!bestSellerOnly)}
            className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-full border transition-all cursor-pointer ${bestSellerOnly
                ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xs"
                : "bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white border-neutral-250 dark:border-neutral-800 hover:border-black dark:hover:border-white"
              }`}
          >
            Best Selling {bestSellerOnly ? "✓" : ""}
          </button>

          <div className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800 mx-0.5" />

          {/* Sort Options */}
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSortKey(opt.value)}
              className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-full border transition-all cursor-pointer ${sortKey === opt.value
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xs"
                  : "bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white border-neutral-250 dark:border-neutral-800 hover:border-black dark:hover:border-white"
                }`}
            >
              {opt.label}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-black dark:hover:text-white border border-dashed border-neutral-300 dark:border-neutral-700 rounded-full transition-colors cursor-pointer ml-1"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Mobile Filter & Search Bar */}
        <div className="flex md:hidden items-center justify-between gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="SEARCH & PRODUCT CODE..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs tracking-wider uppercase px-9 py-2.5 rounded-full placeholder-neutral-400 text-black dark:text-white font-medium focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute inset-y-0 right-3 flex items-center text-neutral-400"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={openMobileFilter}
            className="inline-flex items-center space-x-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black dark:text-white cursor-pointer active:animate-scale-tap"
          >
            <SlidersHorizontal size={14} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* CATEGORIES ROW: Horizontal Category Chips (Desktop) */}
      <div className="hidden md:flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none select-none">
        <button
          type="button"
          onClick={() => handleCategorySelect("")}
          className={`px-4 py-2 text-xs font-extrabold rounded-full border uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 ${selectedCategory === ""
            ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xs"
            : "bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white font-bold"
            }`}
        >
          All Products
        </button>
        {initialCategories.map((c) => {
          const active = selectedCategory === c.slug || selectedCategory === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCategorySelect(c.slug || c.id)}
              className={`px-4 py-2 text-xs font-extrabold rounded-full border uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${active
                ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xs"
                : "bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white font-bold"
                }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Grid List */}
      {sorted.length === 0 ? (
        <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-16 text-center space-y-2">
          <SlidersHorizontal className="mx-auto text-brand-gold" size={32} />
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-black dark:text-white">
            No jewelry matched
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
            Try adjusting your search criteria or collection filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {sorted.map((product) => (
            <CustomerProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Mobile Bottom Sheet Modal for Sort & Filter */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Bottom Sheet Panel */}
          <div className="relative w-full max-h-[85vh] bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 rounded-t-3xl p-6 flex flex-col justify-between z-10 animate-slide-up-sheet overflow-y-auto space-y-6">
            {/* Grab Bar & Header */}
            <div>
              <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-3">
                <h3 className="text-base font-bold tracking-tight text-black dark:text-white">
                  Sort &amp; Filter
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-neutral-400 hover:text-black dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Best Seller Filter Option */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
                Product Filter
              </span>
              <button
                type="button"
                onClick={() => setTempBestSellerOnly(!tempBestSellerOnly)}
                className={`flex items-center justify-between w-full p-3.5 rounded-xl text-xs font-semibold transition-all ${tempBestSellerOnly
                  ? "bg-black dark:bg-white text-white dark:text-black font-bold"
                  : "bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                  }`}
              >
                <span>Best Selling Products Only</span>
                {tempBestSellerOnly && <Check size={16} />}
              </button>
            </div>

            {/* Sort Options */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
                Sort By
              </span>
              <div className="flex flex-col space-y-2">
                {sortOptions.map((opt) => {
                  const selected = tempSortKey === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTempSortKey(opt.value)}
                      className={`flex items-center justify-between p-3.5 rounded-xl text-xs font-semibold transition-all ${selected
                        ? "bg-black dark:bg-white text-white dark:text-black font-bold"
                        : "bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                        }`}
                    >
                      <span>{opt.label}</span>
                      {selected && <Check size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Options */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
                Category
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTempCategory("")}
                  className={`px-4 py-2.5 rounded-full text-xs font-medium transition-all ${tempCategory === ""
                    ? "bg-black dark:bg-white text-white dark:text-black font-bold"
                    : "bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                    }`}
                >
                  All Products
                </button>
                {initialCategories.map((c) => {
                  const active = tempCategory === c.slug || tempCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setTempCategory(c.slug || c.id)}
                      className={`px-4 py-2.5 rounded-full text-xs font-medium transition-all ${active
                        ? "bg-black dark:bg-white text-white dark:text-black font-bold"
                        : "bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                        }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-4 border-t border-neutral-100 dark:border-neutral-900">
              <button
                type="button"
                onClick={handleResetMobileFilter}
                className="flex-1 py-3.5 bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-200"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleApplyMobileFilter}
                className="flex-1 py-3.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
