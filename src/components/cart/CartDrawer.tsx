"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalCount,
    totalAmount,
    totalSavings,
  } = useCart();

  const { showToast } = useToast();
  const router = useRouter();

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/cart");
  };

  return (
    <div className="fixed inset-0 z-[999] flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <aside
        className="relative w-full max-w-md bg-white dark:bg-neutral-950 h-full shadow-2xl flex flex-col justify-between z-10 animate-slide-left border-l border-neutral-200 dark:border-neutral-850"
        aria-label="Shopping Bag"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-850 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag size={18} className="text-black dark:text-white" />
            <h2 className="font-serif-luxury font-bold text-base sm:text-lg tracking-wider text-black dark:text-white uppercase">
              Shopping Bag ({totalCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-850 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close Bag"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400">
                <ShoppingBag size={28} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <p className="font-serif-luxury font-bold text-lg text-black dark:text-white uppercase tracking-wide">
                  Your bag is empty
                </p>
                <p className="text-xs text-neutral-500 max-w-xs font-light">
                  Discover our timeless collections and add your favorite jewelry pieces.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/products");
                }}
                className="mt-2 bg-brand-brown-dark text-white dark:bg-white dark:text-black px-6 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-xs hover:bg-brand-brown-medium dark:hover:bg-neutral-200 transition-all cursor-pointer"
              >
                Explore Jewelry
              </button>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-neutral-150 dark:divide-neutral-850">
              {items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex space-x-3.5">
                  {/* Thumbnail */}
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={() => setIsCartOpen(false)}
                    className="relative w-20 h-20 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs overflow-hidden shrink-0"
                  >
                    {item.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-neutral-400">
                        NO IMG
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-semibold text-xs text-black dark:text-white uppercase truncate hover:underline block max-w-[200px]"
                        >
                          {item.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            removeFromCart(item.id);
                            showToast(`${item.title} removed from bag`, "success");
                          }}
                          className="text-neutral-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Color or Code info */}
                      <div className="flex items-center space-x-2 text-[10px] text-neutral-500 mt-0.5">
                        {item.selectedColor && (
                          <span className="bg-neutral-100 dark:bg-neutral-850 px-1.5 py-0.5 rounded-2xs font-medium uppercase">
                            Color: {item.selectedColor}
                          </span>
                        )}
                        {item.productCode && (
                          <span className="font-mono">{item.productCode}</span>
                        )}
                      </div>
                    </div>

                    {/* Price & Quantity Stepper */}
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <div className="flex items-baseline space-x-1.5">
                        <span className="font-bold text-xs text-black dark:text-white font-mono">
                          ₹{Math.round(item.price * item.quantity)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-[10px] text-neutral-400 line-through font-mono">
                            ₹{Math.round(item.originalPrice * item.quantity)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-300 dark:border-neutral-750 rounded-xs bg-white dark:bg-neutral-900">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-black dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-5 border-t border-neutral-200 dark:border-neutral-850 bg-neutral-50/70 dark:bg-neutral-900/50 space-y-3">
            {/* Savings Notice */}
            {totalSavings > 0 && (
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-xs border border-emerald-200 dark:border-emerald-900/40">
                <span>Total Bag Savings</span>
                <span>-₹{Math.round(totalSavings)}</span>
              </div>
            )}

            {/* Subtotal */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                <span>Subtotal ({totalCount} items)</span>
                <span className="font-bold text-black dark:text-white font-mono text-sm">
                  ₹{Math.round(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-neutral-500">
                <span>Estimated Shipping</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                  Calculated at Checkout
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full flex items-center justify-center space-x-2 bg-brand-brown-dark text-white dark:bg-brand-gold dark:text-brand-brown-dark py-3 text-xs sm:text-sm font-bold tracking-widest uppercase rounded-xs hover:bg-brand-brown-medium dark:hover:bg-brand-gold-dark transition-all cursor-pointer shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/cart");
                }}
                className="w-full text-center text-[11px] uppercase tracking-wider text-neutral-500 hover:text-black dark:hover:text-white font-medium py-1 transition-colors cursor-pointer"
              >
                View Full Bag Details
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
