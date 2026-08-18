"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, ShoppingBag, ZoomIn, ZoomOut, Check } from "lucide-react";
import PurchaseSheet from "@/components/purchase/PurchaseSheet";
import { loadDeliveryDetails } from "@/utils/localStorage";
import CustomerProductCard from "@/components/ui/CustomerProductCard";
import { ProductDetailSkeleton } from "@/components/ui/Skeletons";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  title: string;
  slug: string;
  product_code?: string | null;
  colors?: string[] | null;
  description: string | null;
  original_price?: number;
  selling_price?: number | null;
  price?: number; // legacy fallback
  is_out_of_stock?: boolean;
  featured: boolean;
  images: string[];
  categories?: {
    name: string;
  };
}

interface ProductDetailsClientProps {
  product: Product;
  recommendedProducts: Product[];
}

export default function ProductDetailsClient({ product, recommendedProducts }: ProductDetailsClientProps) {
  const [mounted, setMounted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedState, setSelectedState] = useState("");
  const [shippingCharge, setShippingCharge] = useState<number | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { items, addToCart, updateQuantity, setIsCartOpen } = useCart();

  const compositeId = `${product.id}_${selectedColor || "default"}`;
  const existingCartItem = items.find((item) => item.id === compositeId);

  // Sync quantity state when cart item or selected color changes
  useEffect(() => {
    if (existingCartItem) {
      setQuantity(existingCartItem.quantity);
    }
  }, [existingCartItem?.quantity, selectedColor]);

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    setQuantity(newQty);
    if (existingCartItem) {
      updateQuantity(compositeId, newQty);
    }
  };

  // Quantity of this product (or matching color) already in cart
  const inCartQty = existingCartItem
    ? existingCartItem.quantity
    : items
        .filter((item) => item.productId === product.id)
        .reduce((sum, item) => sum + item.quantity, 0);

  const origPrice = product.original_price ?? product.price ?? 0;
  const sellingPrice = product.selling_price;

  const hasOffer =
    sellingPrice !== undefined &&
    sellingPrice !== null &&
    sellingPrice < origPrice;

  const effectivePrice = hasOffer ? sellingPrice! : origPrice;

  const handleAddToCart = () => {
    if (product.is_out_of_stock) return;

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert("Please select a color variant first.");
      return;
    }

    if (existingCartItem) {
      updateQuantity(compositeId, quantity);
      setIsCartOpen(true);
    } else {
      addToCart(
        {
          productId: product.id,
          title: product.title,
          slug: product.slug,
          image: product.images?.[activeImage] || product.images?.[0] || "",
          price: effectivePrice,
          originalPrice: origPrice,
          quantity,
          productCode: product.product_code,
          selectedColor: selectedColor || null,
          categoryName: product.categories?.name,
        },
        true
      );
    }
  };

  const discountPercentage = hasOffer
    ? Math.round(((origPrice - sellingPrice!) / origPrice) * 100)
    : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-select first available color
  useEffect(() => {
    if (product.colors && product.colors.length > 0 && product.colors[0]) {
      setSelectedColor(product.colors[0]);
    }
  }, [product.colors]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const saved = loadDeliveryDetails();
    if (saved?.state) {
      setTimeout(() => setSelectedState(saved.state), 0);
      setShippingCharge(0);
    }
  }, []);

  // Drag/Swipe support for both touch and mouse
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const hasMoved = useRef(false);

  const galleryImages = product.images.length > 0 ? product.images : ["/placeholder-product.jpg"];

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    isDragging.current = true;
    dragStartX.current = clientX;
    dragStartY.current = clientY;
    hasMoved.current = false;
  }, []);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    const diffX = Math.abs(clientX - dragStartX.current);
    const diffY = Math.abs(clientY - dragStartY.current);
    if (diffX > 8 || diffY > 8) {
      hasMoved.current = true;
    }
  }, []);

  const selectImage = useCallback((idx: number) => {
    setActiveImage(idx);
    if (product.colors && product.colors.length > 0 && product.colors[idx]) {
      setSelectedColor(product.colors[idx]);
    }
  }, [product.colors]);

  const selectColor = useCallback((colorName: string, colorIdx: number) => {
    setSelectedColor(colorName);
    if (colorIdx >= 0 && colorIdx < galleryImages.length) {
      setActiveImage(colorIdx);
    }
  }, [galleryImages.length]);

  const handleDragEnd = useCallback((clientX: number) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const diff = dragStartX.current - clientX;
    const threshold = 45; // swipe threshold in pixels

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && activeImage < galleryImages.length - 1) {
        selectImage(activeImage + 1);
      } else if (diff < 0 && activeImage > 0) {
        selectImage(activeImage - 1);
      }
    }
  }, [activeImage, galleryImages.length, selectImage]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      handleDragStart(touch.clientX, touch.clientY);
    }
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      handleDragMove(touch.clientX, touch.clientY);
    }
  }, [handleDragMove]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    if (touch) {
      handleDragEnd(touch.clientX);
    }
  }, [handleDragEnd]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    handleDragStart(e.clientX, e.clientY);
  }, [handleDragStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  }, [handleDragMove]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    handleDragEnd(e.clientX);
  }, [handleDragEnd]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
    }
  }, []);

  const handleImageClick = useCallback(() => {
    if (!hasMoved.current) {
      setZoomed((prev) => !prev);
    }
  }, []);

  function handleBuyNow() {
    if (product.is_out_of_stock) return;
    setSheetOpen(true);
  }

  // Smooth skeleton loading state before client hydration finishes
  if (!mounted) {
    return <ProductDetailSkeleton />;
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-8 space-y-5 flex-1 flex flex-col justify-start pb-20">
        {/* Return to collection */}
        <div className="select-none">
          <Link
            href="/products"
            className="inline-flex items-center space-x-1.5 text-[9px] uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <ChevronLeft size={12} />
            <span>Back to Collection</span>
          </Link>
        </div>

        {/* ================================================== */}
        {/* MOBILE VIEW: CLEAN VERTICAL ORDER (ITEMS 1 TO 7) */}
        {/* ================================================== */}
        <div className="md:hidden space-y-5 select-none">
          {/* 1. PRODUCT IMAGE / IMAGE GALLERY */}
          <div className="space-y-3 max-w-full overflow-hidden">
            <div
              className="group relative aspect-square w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-md overflow-hidden select-none cursor-pointer flex items-center justify-center shadow-xs"
              style={{ touchAction: "pan-y" }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onClick={handleImageClick}
            >
              {product.is_out_of_stock && (
                <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-xs shadow-sm">
                  OUT OF STOCK
                </span>
              )}
              {!product.is_out_of_stock && hasOffer && (
                <span className="absolute top-3 left-3 z-10 bg-emerald-600 text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-xs shadow-sm">
                  {discountPercentage}% OFF SPECIAL OFFER
                </span>
              )}
              {!product.is_out_of_stock && !hasOffer && product.featured && (
                <span className="absolute top-3 left-3 z-10 bg-white text-black text-[8px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-xs flex items-center space-x-1 shadow-sm">
                  <Star size={8} fill="currentColor" />
                  <span>Best Seller</span>
                </span>
              )}

              {/* Zoom indicator */}
              <button
                type="button"
                className="absolute top-3 right-3 z-10 bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm cursor-pointer hover:bg-black/70 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomed(!zoomed);
                }}
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
              >
                {zoomed ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
              </button>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={galleryImages[activeImage]}
                alt={product.title}
                className={`w-full h-full transition-transform duration-300 ease-out object-contain p-2 ${
                  zoomed ? "scale-150" : ""
                } ${product.is_out_of_stock ? "opacity-60 grayscale-[25%]" : ""}`}
                draggable={false}
              />

              {/* Swipe indicator dots */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectImage(idx);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === activeImage
                          ? "bg-white w-4"
                          : "bg-white/40 hover:bg-white/70"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail list */}
            {galleryImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1 select-none scrollbar-thin">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectImage(idx)}
                    className={`relative aspect-square w-14 bg-neutral-50 dark:bg-neutral-900 border rounded-xs overflow-hidden flex-shrink-0 cursor-pointer transition-all ${
                      idx === activeImage
                        ? "border-black dark:border-white ring-1 ring-black dark:ring-white"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. PRODUCT TITLE / HEADING */}
          <div className="space-y-1">
            {product.categories?.name && (
              <span className="text-[9px] tracking-[0.2em] text-neutral-500 uppercase font-semibold block">
                {product.categories.name}
              </span>
            )}
            <h1 className="font-serif-luxury text-xl font-bold tracking-wide text-black dark:text-white uppercase leading-tight">
              {product.title}
            </h1>
          </div>

          {/* 3. PRODUCT CODE */}
          {product.product_code && (
            <div className="flex items-center space-x-2 pt-0.5">
              <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-neutral-500">
                PRODUCT CODE:
              </span>
              <span className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 tracking-wider bg-neutral-100 dark:bg-neutral-850 px-2 py-0.5 rounded-xs border border-neutral-200 dark:border-neutral-800">
                {product.product_code}
              </span>
            </div>
          )}

          {/* 4. PRICE / EXISTING PRICE INFORMATION */}
          <div className="space-y-1">
            <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
              Price
            </h4>
            <div className="flex items-baseline space-x-2">
              {hasOffer ? (
                <>
                  <p className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{effectivePrice.toFixed(2)}
                  </p>
                  <p className="text-sm font-mono font-normal text-neutral-400 line-through">
                    ₹{origPrice.toFixed(2)}
                  </p>
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-xs border border-emerald-500/20">
                    Save ₹{(origPrice - effectivePrice).toFixed(0)} ({discountPercentage}%)
                  </span>
                </>
              ) : (
                <p className="text-xl font-mono font-bold text-black dark:text-white">
                  ₹{origPrice.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* 5. AVAILABLE COLORS / COLOR SELECTOR */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                  Available Colors <span className="text-red-500">*</span>
                </h4>
                {selectedColor && (
                  <span className="text-[10px] font-bold text-black dark:text-white uppercase tracking-wider">
                    Selected: {selectedColor}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.colors.map((colorName, colorIdx) => {
                  const isSelected = selectedColor === colorName;
                  return (
                    <button
                      key={colorName}
                      type="button"
                      onClick={() => selectColor(colorName, colorIdx)}
                      className={`px-2 py-0.5 rounded-xs text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-2xs"
                          : "bg-neutral-100 dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-750 hover:border-black dark:hover:border-white"
                      }`}
                    >
                      {isSelected && <span className="mr-1 text-[8px]">✓</span>}
                      {colorName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. EXISTING PRODUCT INFORMATION / DETAILS */}
          {product.description && (
            <div className="space-y-1 pt-1">
              <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                Description / Composition
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-350 font-light leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* 7. EXISTING ACTIONS AND OTHER CONTENT */}
          <div className="space-y-4 pt-1">
            {/* Quantity picker & In Cart Badge in Same Row */}
            <div className="space-y-1.5">
              <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                Quantity
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || product.is_out_of_stock}
                    className="w-8 h-8 flex items-center justify-center border border-neutral-300 dark:border-neutral-800 rounded-xs text-neutral-600 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors active:animate-scale-tap"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-mono font-bold text-black dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={product.is_out_of_stock}
                    className="w-8 h-8 flex items-center justify-center border border-neutral-300 dark:border-neutral-800 rounded-xs text-neutral-600 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors active:animate-scale-tap"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Already in cart badge in same row */}
                {inCartQty > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(true)}
                    className="inline-flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs animate-fade-in"
                  >
                    <Check size={14} className="text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                    <span>Already in cart: {inCartQty}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Cost Summary */}
            <div className="border border-neutral-200 dark:border-neutral-850 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-md p-3 space-y-2">
              <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-850 pb-1.5">
                Cost Summary
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400 font-light">
                    Subtotal ({quantity} {quantity === 1 ? "item" : "items"})
                  </span>
                  <span className="text-black dark:text-white font-mono font-semibold">
                    ₹{(effectivePrice * quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400 font-light">Shipping</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">FREE</span>
                </div>
                <div className="h-[1px] bg-neutral-200 dark:bg-neutral-850 my-1" />
                <div className="flex justify-between text-xs sm:text-sm font-bold">
                  <span className="text-black dark:text-white uppercase tracking-wider">Total Estimate</span>
                  <span className="text-black dark:text-white font-mono font-extrabold">
                    ₹{(effectivePrice * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Action Buttons (Add to Bag + Buy Now) */}
            <div className="grid grid-cols-2 gap-2.5">
              {product.is_out_of_stock ? (
                <button
                  type="button"
                  disabled
                  className="col-span-2 flex w-full items-center justify-center space-x-2 bg-neutral-300 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 py-3.5 text-xs font-bold tracking-widest uppercase rounded-md cursor-not-allowed select-none"
                >
                  <span>OUT OF STOCK</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex w-full items-center justify-center space-x-1.5 border border-neutral-300 dark:border-neutral-700 bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-black dark:text-white py-3.5 text-xs font-bold tracking-widest uppercase transition-all rounded-md cursor-pointer active:animate-scale-tap shadow-xs"
                  >
                    <ShoppingBag size={15} />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex w-full items-center justify-center space-x-1.5 bg-brand-brown-dark text-white dark:bg-brand-gold dark:text-brand-brown-dark py-3.5 text-xs font-bold tracking-widest uppercase transition-all hover:bg-brand-brown-medium dark:hover:bg-brand-gold-dark rounded-md cursor-pointer active:animate-scale-tap shadow-md"
                  >
                    <span>Buy Now</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* DESKTOP & TABLET VIEW: STABLE 2-COLUMN GRID */}
        {/* ================================================== */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 items-start">
          {/* Left side: Images Gallery */}
          <div className="space-y-3 max-w-full overflow-hidden">
            <div
              className="group relative aspect-square w-full max-h-[480px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-md overflow-hidden select-none cursor-pointer flex items-center justify-center shadow-xs"
              style={{ touchAction: "pan-y" }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onClick={handleImageClick}
            >
              {product.is_out_of_stock && (
                <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-xs shadow-sm">
                  OUT OF STOCK
                </span>
              )}
              {!product.is_out_of_stock && hasOffer && (
                <span className="absolute top-3 left-3 z-10 bg-emerald-600 text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-xs shadow-sm">
                  {discountPercentage}% OFF SPECIAL OFFER
                </span>
              )}
              {!product.is_out_of_stock && !hasOffer && product.featured && (
                <span className="absolute top-3 left-3 z-10 bg-white text-black text-[8px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-xs flex items-center space-x-1 shadow-sm">
                  <Star size={8} fill="currentColor" />
                  <span>Best Seller</span>
                </span>
              )}

              {/* Zoom indicator */}
              <button
                type="button"
                className="absolute top-3 right-3 z-10 bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm cursor-pointer hover:bg-black/70 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomed(!zoomed);
                }}
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
              >
                {zoomed ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
              </button>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={galleryImages[activeImage]}
                alt={product.title}
                className={`w-full h-full transition-transform duration-300 ease-out object-contain p-2 ${
                  zoomed ? "scale-150" : ""
                } ${product.is_out_of_stock ? "opacity-60 grayscale-[25%]" : ""}`}
                draggable={false}
              />

              {/* Left/Right navigation arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (activeImage > 0) {
                        selectImage(activeImage - 1);
                      }
                    }}
                    disabled={activeImage === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/35 hover:bg-black/60 disabled:opacity-0 text-white p-2 rounded-full backdrop-blur-sm transition-all cursor-pointer opacity-0 group-hover:opacity-100 flex items-center justify-center border border-white/10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (activeImage < galleryImages.length - 1) {
                        selectImage(activeImage + 1);
                      }
                    }}
                    disabled={activeImage === galleryImages.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/35 hover:bg-black/60 disabled:opacity-0 text-white p-2 rounded-full backdrop-blur-sm transition-all cursor-pointer opacity-0 group-hover:opacity-100 flex items-center justify-center border border-white/10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {/* Swipe indicator dots */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectImage(idx);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === activeImage
                          ? "bg-white w-4"
                          : "bg-white/40 hover:bg-white/70"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail list */}
            {galleryImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1 select-none scrollbar-thin">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectImage(idx)}
                    className={`relative aspect-square w-14 bg-neutral-50 dark:bg-neutral-900 border rounded-xs overflow-hidden flex-shrink-0 cursor-pointer transition-all ${
                      idx === activeImage
                        ? "border-black dark:border-white ring-1 ring-black dark:ring-white"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side: Product info */}
          <div id="product-info-column" className="space-y-5 select-none md:sticky md:top-24 self-start">
            {/* Category & Title */}
            <div className="space-y-2.5">
              {product.categories?.name && (
                <span className="text-[10px] tracking-[0.2em] text-neutral-500 uppercase font-semibold">
                  {product.categories.name}
                </span>
              )}
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wide text-black dark:text-white uppercase leading-tight">
                {product.title}
              </h1>

              {/* Product Code */}
              {product.product_code && (
                <div className="flex items-center space-x-2 pt-0.5">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-neutral-500">
                    PRODUCT CODE:
                  </span>
                  <span className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 tracking-wider bg-neutral-100 dark:bg-neutral-850 px-2 py-0.5 rounded-xs border border-neutral-200 dark:border-neutral-800">
                    {product.product_code}
                  </span>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="space-y-1 pt-1.5 max-w-md">
                  <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                    Description / Composition
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-350 font-light leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Available Colors Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-1.5 pt-2 max-w-md">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                      Available Colors <span className="text-red-500">*</span>
                    </h4>
                    {selectedColor && (
                      <span className="text-[10px] font-bold text-black dark:text-white uppercase tracking-wider">
                        Selected: {selectedColor}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.colors.map((colorName, colorIdx) => {
                      const isSelected = selectedColor === colorName;
                      return (
                        <button
                          key={colorName}
                          type="button"
                          onClick={() => selectColor(colorName, colorIdx)}
                          className={`px-2 py-0.5 rounded-xs text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-2xs"
                              : "bg-neutral-100 dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-750 hover:border-black dark:hover:border-white"
                          }`}
                        >
                          {isSelected && <span className="mr-1 text-[8px]">✓</span>}
                          {colorName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price Display */}
              <div className="flex items-baseline space-x-3 pt-1">
                {hasOffer ? (
                  <>
                    <p className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{effectivePrice.toFixed(2)}
                    </p>
                    <p className="text-base font-mono font-normal text-neutral-400 dark:text-neutral-500 line-through">
                      ₹{origPrice.toFixed(2)}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-xs border border-emerald-500/20">
                      Save ₹{(origPrice - effectivePrice).toFixed(0)} ({discountPercentage}%)
                    </span>
                  </>
                ) : (
                  <p className="text-xl font-mono font-bold text-black dark:text-white">
                    ₹{origPrice.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            <div className="h-[1px] bg-neutral-200 dark:bg-neutral-850 my-1" />

            {/* Quantity picker & In Cart Badge in Same Row */}
            <div className="space-y-1.5">
              <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                Quantity
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || product.is_out_of_stock}
                    className="w-8 h-8 flex items-center justify-center border border-neutral-300 dark:border-neutral-800 rounded-xs text-neutral-600 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors active:animate-scale-tap"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-mono font-bold text-black dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={product.is_out_of_stock}
                    className="w-8 h-8 flex items-center justify-center border border-neutral-300 dark:border-neutral-800 rounded-xs text-neutral-600 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors active:animate-scale-tap"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Already in cart badge in same row */}
                {inCartQty > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(true)}
                    className="inline-flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs animate-fade-in"
                  >
                    <Check size={14} className="text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                    <span>Already in cart: {inCartQty}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Cost Summary */}
            <div className="border border-neutral-200 dark:border-neutral-850 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-md p-3 space-y-2 max-w-md">
              <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-850 pb-1.5">
                Cost Summary
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400 font-light">
                    Subtotal ({quantity} {quantity === 1 ? "item" : "items"})
                  </span>
                  <span className="text-black dark:text-white font-mono font-semibold">
                    ₹{(effectivePrice * quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400 font-light">Shipping</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">FREE</span>
                </div>
                <div className="h-[1px] bg-neutral-200 dark:bg-neutral-850 my-1" />
                <div className="flex justify-between text-xs sm:text-sm font-bold">
                  <span className="text-black dark:text-white uppercase tracking-wider">Total Estimate</span>
                  <span className="text-black dark:text-white font-mono font-extrabold">
                    ₹{(effectivePrice * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons (Add to Bag + Buy Now) */}
            <div className="py-2 w-full max-w-md">
              {product.is_out_of_stock ? (
                <button
                  type="button"
                  disabled
                  className="flex w-full items-center justify-center space-x-2 bg-neutral-300 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 py-3.5 text-xs font-bold tracking-widest uppercase rounded-md cursor-not-allowed select-none"
                >
                  <span>OUT OF STOCK</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex w-full items-center justify-center space-x-2 border border-neutral-300 dark:border-neutral-700 bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-black dark:text-white py-3.5 text-xs sm:text-sm font-bold tracking-widest uppercase transition-all rounded-md cursor-pointer active:animate-scale-tap shadow-xs"
                  >
                    <ShoppingBag size={16} />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex w-full items-center justify-center space-x-2 bg-brand-brown-dark text-white dark:bg-brand-gold dark:text-brand-brown-dark py-3.5 text-xs sm:text-sm font-bold tracking-widest uppercase transition-all hover:bg-brand-brown-medium dark:hover:bg-brand-gold-dark rounded-md cursor-pointer active:animate-scale-tap shadow-md"
                  >
                    <span>Buy Now</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Mobile Bottom Bar for Add to Bag & Buy Now */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md px-4 py-3 border-t border-neutral-200 dark:border-neutral-850 shadow-2xl safe-area-bottom">
        {product.is_out_of_stock ? (
          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center space-x-2 bg-neutral-300 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 py-3.5 text-xs font-bold tracking-widest uppercase rounded-sm cursor-not-allowed select-none"
          >
            <span>OUT OF STOCK</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center space-x-1.5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white py-3 text-xs font-bold tracking-wider uppercase rounded-xs cursor-pointer active:animate-scale-tap"
            >
              <ShoppingBag size={14} />
              <span>Add to Bag</span>
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex w-full items-center justify-center space-x-1.5 bg-brand-brown-dark text-white dark:bg-brand-gold dark:text-brand-brown-dark py-3 text-xs font-bold tracking-wider uppercase rounded-xs cursor-pointer active:animate-scale-tap shadow-md"
            >
              <span>Buy Now</span>
            </button>
          </div>
        )}
      </div>

      {/* Recommended Products */}
      {recommendedProducts && recommendedProducts.length > 0 && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 space-y-4 select-none">
          <div className="border-t border-neutral-200 dark:border-neutral-850 pt-8">
            <span className="text-[9px] font-bold tracking-[0.25em] text-neutral-500 dark:text-neutral-400 uppercase">
              Curated For You
            </span>
            <h2 className="text-base sm:text-xl font-bold tracking-tight text-black dark:text-white uppercase mt-0.5">
              Recommended Products
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
            {Array.from(new Map(recommendedProducts.map((p) => [p.id, p])).values()).map((prod) => (
              <CustomerProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

      {/* Purchase Bottom Sheet */}
      <PurchaseSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        product={product}
        productSlug={product.slug}
        quantity={quantity}
        selectedColor={selectedColor}
        initialState={selectedState}
        initialShippingCharge={shippingCharge}
      />
    </>
  );
}
