"use client";

import Link from "next/link";
import CustomerProductCard from "@/components/ui/CustomerProductCard";
import { ChevronRight, ArrowRight, Sparkles } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  seo_description?: string | null;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  product_code?: string | null;
  original_price?: number;
  selling_price?: number | null;
  price?: number;
  is_out_of_stock?: boolean;
  featured: boolean;
  images: string[];
  category_id: string;
  categories?: {
    name: string;
  };
}

interface CollectionClientProps {
  category: Category;
  products: Product[];
  allCategories: Category[];
}

export default function CollectionClient({
  category,
  products,
  allCategories,
}: CollectionClientProps) {
  return (
    <div className="w-full bg-transparent select-none pb-24">
      {/* Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-6 pb-2">
        <ol className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-medium">
          <li>
            <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
              Home
            </Link>
          </li>
          <li>
            <ChevronRight size={10} className="text-neutral-400" />
          </li>
          <li>
            <Link href="/products" className="hover:text-black dark:hover:text-white transition-colors">
              Collections
            </Link>
          </li>
          <li>
            <ChevronRight size={10} className="text-neutral-400" />
          </li>
          <li className="text-black dark:text-white font-bold" aria-current="page">
            {category.name}
          </li>
        </ol>
      </nav>

      {/* Hero Category Header */}
      <header className="mx-auto max-w-7xl px-6 pt-6 pb-8 border-b border-neutral-200/80 dark:border-neutral-850">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.25em] text-brand-gold-dark uppercase">
              <Sparkles size={12} />
              SOUTH INDIAN SIGNATURE DESIGNS
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif-luxury font-light tracking-wide text-brand-brown-dark dark:text-brand-cream uppercase leading-tight">
              {category.name} Collection
            </h1>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1">
              {category.seo_description ||
                `Explore our exclusive collection of handcrafted ${category.name.toLowerCase()} at Nethiel Jewelry. Bringing together timeless South Indian tradition and contemporary elegance.`}
            </p>
          </div>

          <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            {products.length} {products.length === 1 ? "PIECE" : "PIECES"} AVAILABLE
          </div>
        </div>

        {/* Other Collection Quick Links Pills */}
        {allCategories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-6 pb-1">
            <Link
              href="/products"
              className="px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-black dark:hover:border-white transition-colors shrink-0"
            >
              ALL COLLECTIONS
            </Link>
            {allCategories.map((cat) => {
              const isCurrent = cat.slug === category.slug;
              return (
                <Link
                  key={cat.id}
                  href={`/collections/${cat.slug}`}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border transition-all shrink-0 ${
                    isCurrent
                      ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-black dark:hover:border-white"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Collection Products Grid */}
      <main className="mx-auto max-w-7xl px-6 pt-10">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/20 p-16 text-center space-y-4">
            <p className="text-xs sm:text-sm uppercase tracking-widest text-neutral-500 font-light">
              No pieces currently in this collection.
            </p>
            <div>
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 bg-black text-white dark:bg-white dark:text-black px-6 py-2.5 text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity"
              >
                <span>EXPLORE ALL JEWELRY</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <CustomerProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
