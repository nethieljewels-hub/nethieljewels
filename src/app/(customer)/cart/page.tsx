"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
  Truck,
  MessageSquare,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import DeliveryForm from "@/components/purchase/DeliveryForm";
import {
  validateName,
  validatePhone,
  validatePincode,
  validateRequired,
} from "@/utils/validation";
import {
  generateMultiProductWhatsAppMessage,
  openWhatsApp,
} from "@/utils/whatsapp";
import { DEFAULT_WHATSAPP_NUMBER } from "@/utils/constants";
import {
  saveDeliveryDetails,
  loadDeliveryDetails,
  type DeliveryDetails,
} from "@/utils/localStorage";
import { createClient } from "@/utils/supabase/client";

const emptyForm: DeliveryDetails = {
  customerName: "",
  houseName: "",
  address: "",
  district: "",
  state: "",
  pincode: "",
  phone: "",
};

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalCount,
    totalAmount,
    totalSavings,
  } = useCart();

  const { showToast } = useToast();

  const [formData, setFormData] = useState<DeliveryDetails>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shippingCharge, setShippingCharge] = useState<number | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState<string>(DEFAULT_WHATSAPP_NUMBER);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [toastError, setToastError] = useState("");

  const handleClearCart = () => {
    clearCart();
    showToast("All items have been removed from your bag.", "success");
  };

  const handleRemoveItem = (id: string, title: string) => {
    removeFromCart(id);
    showToast(`${title} removed from bag`, "success");
  };

  // Load saved delivery details on mount
  useEffect(() => {
    const saved = loadDeliveryDetails();
    if (saved) {
      setFormData(saved);
    }
  }, []);

  // Fetch store settings & shipping rates
  useEffect(() => {
    async function fetchSettings() {
      setSettingsLoading(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("settings")
          .select("whatsapp, shop_name")
          .eq("id", true)
          .maybeSingle();

        if (data && data.whatsapp) {
          setWhatsappNumber(data.whatsapp);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setSettingsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSetFormData = (newData: DeliveryDetails) => {
    setFormData(newData);
    saveDeliveryDetails(newData);
    setErrors({});
  };

  const handleStateChange = (stateName: string, charge?: number) => {
    setFormData((prev) => {
      const next = { ...prev, state: stateName };
      saveDeliveryDetails(next);
      return next;
    });

    if (typeof charge === "number") {
      setShippingCharge(charge);
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameRes = validateName(formData.customerName);
    if (!nameRes.valid) newErrors.customerName = nameRes.message;

    const houseRes = validateRequired(formData.houseName, "House/Building Name");
    if (!houseRes.valid) newErrors.houseName = houseRes.message;

    const addrRes = validateRequired(formData.address, "Road/Area/Street Address");
    if (!addrRes.valid) newErrors.address = addrRes.message;

    const distRes = validateRequired(formData.district, "District/City");
    if (!distRes.valid) newErrors.district = distRes.message;

    const stateRes = validateRequired(formData.state, "State");
    if (!stateRes.valid) newErrors.state = stateRes.message;

    const pinRes = validatePincode(formData.pincode);
    if (!pinRes.valid) newErrors.pincode = pinRes.message;

    const phoneRes = validatePhone(formData.phone);
    if (!phoneRes.valid) newErrors.phone = phoneRes.message;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const activeShipping = shippingCharge ?? 0;
  const grandTotal = totalAmount + activeShipping;

  const handleOrderWhatsApp = () => {
    if (items.length === 0) {
      setToastError("Your shopping bag is empty.");
      return;
    }

    if (!validateAll()) {
      setToastError("Please fill all required delivery details correctly.");
      return;
    }

    setSending(true);
    saveDeliveryDetails(formData);

    try {
      const orderItems = items.map((item) => ({
        title: item.title,
        productCode: item.productCode,
        selectedColor: item.selectedColor,
        price: item.price,
        quantity: item.quantity,
        productUrl: typeof window !== "undefined" ? `${window.location.origin}/products/${item.slug}` : `/products/${item.slug}`,
      }));

      const msg = generateMultiProductWhatsAppMessage({
        items: orderItems,
        stateName: formData.state,
        shippingCharge: activeShipping,
        subtotal: totalAmount,
        grandTotal,
        customerName: formData.customerName,
        houseName: formData.houseName,
        address: formData.address,
        district: formData.district,
        state: formData.state,
        pincode: formData.pincode,
        phone: formData.phone,
      });

      openWhatsApp(whatsappNumber, msg);
    } catch (err) {
      console.error("Order error:", err);
      setToastError("Failed to open WhatsApp. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-850 pb-5">
          <div className="space-y-1">
            <Link
              href="/products"
              className="inline-flex items-center space-x-1.5 text-xs text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Continue Shopping</span>
            </Link>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wide text-[#1E3A5F] dark:text-[#CBD5E1] uppercase">
              Shopping Bag &amp; Checkout
            </h1>
          </div>

          {items.length > 0 && (
            <div className="flex items-center space-x-3 text-xs">
              <span className="text-neutral-500 font-medium">
                {totalCount} {totalCount === 1 ? "Item" : "Items"} in Bag
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <button
                type="button"
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-600 font-medium cursor-pointer transition-colors"
              >
                Clear Bag
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-md p-12 text-center max-w-lg mx-auto space-y-5">
            <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-850 flex items-center justify-center mx-auto text-neutral-400">
              <ShoppingBag size={36} strokeWidth={1.2} />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-serif-luxury font-bold text-xl text-black dark:text-white uppercase tracking-wider">
                Your Shopping Bag is Empty
              </h2>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto font-light leading-relaxed">
                Explore our curated South Indian gold, silver, and traditional jewelry collections to find your perfect pieces.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 bg-brand-brown-dark text-white dark:bg-brand-gold dark:text-brand-brown-dark px-7 py-3 text-xs font-semibold uppercase tracking-widest rounded-xs hover:bg-brand-brown-medium dark:hover:bg-brand-gold-dark transition-all shadow-md"
            >
              <span>Browse All Collections</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column on Desktop / Bottom on Mobile: Delivery Details & WhatsApp Order (7 Cols on desktop) */}
            <div className="order-2 lg:order-1 lg:col-span-7 space-y-6">
              {/* Delivery Details Card */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-md p-5 sm:p-6 shadow-sm space-y-4">
                <div className="border-b border-neutral-200 dark:border-neutral-850 pb-3">
                  <h2 className="font-serif-luxury font-bold text-base text-black dark:text-white uppercase tracking-wider">
                    1. Delivery Details
                  </h2>
                  <p className="text-[11px] text-neutral-500 font-light">
                    Provide your address for order delivery and calculation.
                  </p>
                </div>

                <DeliveryForm
                  formData={formData}
                  setFormData={handleSetFormData}
                  errors={errors}
                  onStateChange={handleStateChange}
                />
              </div>

              {/* Order Summary & WhatsApp CTA Card */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-md p-5 sm:p-6 shadow-sm space-y-4">
                <div className="border-b border-neutral-200 dark:border-neutral-850 pb-3">
                  <h2 className="font-serif-luxury font-bold text-base text-black dark:text-white uppercase tracking-wider">
                    2. Order Summary
                  </h2>
                </div>

                {/* Savings notification */}
                {totalSavings > 0 && (
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3.5 py-2 rounded-xs border border-emerald-200 dark:border-emerald-900/40">
                    <span>Total Bag Discount</span>
                    <span>-₹{Math.round(totalSavings)}</span>
                  </div>
                )}

                {/* Cost breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                    <span>Items Subtotal ({totalCount} {totalCount === 1 ? "item" : "items"})</span>
                    <span className="font-mono font-semibold text-black dark:text-white text-sm">
                      ₹{Math.round(totalAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                    <span>
                      Shipping Charges {formData.state ? `(${formData.state})` : ""}
                    </span>
                    <span className="font-mono font-semibold">
                      {activeShipping > 0 ? (
                        `₹${Math.round(activeShipping)}`
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                          FREE
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="h-px bg-neutral-200 dark:bg-neutral-850 my-2" />

                  <div className="flex justify-between items-baseline text-sm sm:text-base font-bold">
                    <span className="text-black dark:text-white uppercase tracking-wider">
                      Grand Total
                    </span>
                    <span className="text-black dark:text-white font-mono text-lg sm:text-xl font-extrabold">
                      ₹{Math.round(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Toast error */}
                {toastError && (
                  <div className="flex items-center space-x-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 p-2.5 rounded-xs animate-shake">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>{toastError}</span>
                  </div>
                )}

                {/* Primary WhatsApp Order CTA */}
                <button
                  type="button"
                  onClick={handleOrderWhatsApp}
                  disabled={sending || settingsLoading}
                  className="w-full flex items-center justify-center space-x-2.5 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white py-3.5 px-4 text-xs sm:text-sm font-bold tracking-widest uppercase rounded-xs transition-all cursor-pointer shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:animate-scale-tap"
                >
                  {sending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Opening WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare size={18} />
                      <span>Order on WhatsApp (₹{Math.round(grandTotal)})</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-neutral-400 text-center font-light leading-relaxed">
                  Clicking will open WhatsApp with your itemized order and delivery address pre-formatted.
                </p>
              </div>
            </div>

            {/* Right Column on Desktop / Top on Mobile: Cart Items List & Sticky Review (5 Cols on desktop) */}
            <div className="order-1 lg:order-2 lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-md divide-y divide-neutral-150 dark:divide-neutral-850 overflow-hidden shadow-xs">
                <div className="p-4 bg-neutral-50/70 dark:bg-neutral-950/50 border-b border-neutral-200 dark:border-neutral-850 flex items-center justify-between">
                  <span className="font-serif-luxury font-bold text-xs uppercase tracking-wider text-black dark:text-white">
                    Order Items ({totalCount})
                  </span>
                  <span className="text-xs font-mono font-bold text-black dark:text-white">
                    ₹{Math.round(totalAmount)}
                  </span>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="p-4 flex gap-3.5">
                    {/* Thumbnail */}
                    <Link
                      href={`/products/${item.slug}`}
                      className="relative w-20 h-20 sm:w-22 sm:h-22 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xs overflow-hidden shrink-0 group"
                    >
                      {item.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                          NO IMAGE
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        {item.categoryName && (
                          <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold block truncate">
                            {item.categoryName}
                          </span>
                        )}
                        <div className="flex items-start justify-between gap-1.5">
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-serif-luxury font-bold text-xs sm:text-sm text-black dark:text-white uppercase truncate hover:underline block max-w-[170px]"
                          >
                            {item.title}
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id, item.title)}
                            className="text-neutral-400 hover:text-red-500 p-0.5 transition-colors cursor-pointer shrink-0"
                            aria-label={`Remove ${item.title}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* Variants and Code */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          {item.selectedColor && (
                            <span className="text-[9px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-1.5 py-0.5 rounded-2xs font-semibold uppercase tracking-wider">
                              Color: {item.selectedColor}
                            </span>
                          )}
                          {item.productCode && (
                            <span className="text-[9px] font-mono text-neutral-500">
                              {item.productCode}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing and Quantity Stepper */}
                      <div className="flex items-end justify-between mt-2 pt-1 border-t border-neutral-100 dark:border-neutral-850">
                        <div>
                          <span className="font-bold text-xs text-black dark:text-white font-mono block">
                            ₹{Math.round(item.price * item.quantity)}
                          </span>
                          <span className="text-[9px] text-neutral-400 font-light">
                            ₹{Math.round(item.price)} each
                          </span>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-xs bg-white dark:bg-neutral-900">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="px-2 text-[11px] font-mono font-bold text-black dark:text-white">
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

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2 pt-1">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-xs p-2.5 flex items-center space-x-2.5">
                  <ShieldCheck size={16} className="text-brand-gold shrink-0" />
                  <div className="text-[10px]">
                    <p className="font-bold text-black dark:text-white uppercase">100% Authentic</p>
                    <p className="text-neutral-500 font-light">Handcrafted Fine Jewelry</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-xs p-2.5 flex items-center space-x-2.5">
                  <Truck size={16} className="text-brand-gold shrink-0" />
                  <div className="text-[10px]">
                    <p className="font-bold text-black dark:text-white uppercase">Insured Shipping</p>
                    <p className="text-neutral-500 font-light">Safe Doorstep Delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
