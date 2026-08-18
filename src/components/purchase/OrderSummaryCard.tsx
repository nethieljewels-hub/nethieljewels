"use client";

interface OrderSummaryCardProps {
  productImage: string;
  productName: string;
  productCode?: string | null;
  selectedColor?: string | null;
  category: string;
  productPrice: number;
  quantity: number;
  shippingCharge?: number | null;
  shippingLoading?: boolean;
  stateName?: string;
}

export default function OrderSummaryCard({
  productImage,
  productName,
  productCode,
  selectedColor,
  category,
  productPrice,
  quantity,
  shippingCharge = 0,
  stateName,
}: OrderSummaryCardProps) {
  const subtotal = productPrice * quantity;
  const activeCharge = shippingCharge ?? 0;
  const grandTotal = subtotal + activeCharge;

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/60 rounded-md overflow-hidden shadow-xs">
      {/* Section Header */}
      <div className="px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900">
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-600 dark:text-neutral-400">
          Product &amp; Order Details
        </h3>
      </div>

      {/* Product Information Block */}
      <div className="flex items-start space-x-4 p-5">
        <div className="w-20 h-24 sm:w-24 sm:h-28 bg-neutral-100 dark:bg-neutral-800 rounded-sm overflow-hidden flex-shrink-0 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-2">
          {category && (
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-500 dark:text-neutral-400 block">
              {category}
            </span>
          )}
          <h4 className="text-sm sm:text-base font-bold text-black dark:text-white uppercase tracking-tight leading-snug">
            {productName}
          </h4>

          {/* Product Code */}
          <div className="flex items-center space-x-2 pt-0.5">
            <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-neutral-500 dark:text-neutral-400">
              Product Code:
            </span>
            <span className="text-xs font-mono font-bold text-black dark:text-white bg-neutral-200/70 dark:bg-neutral-800 px-2 py-0.5 rounded-xs border border-neutral-300/80 dark:border-neutral-700">
              {productCode && productCode.trim() !== "" ? productCode : "N/A"}
            </span>
          </div>

          {/* Selected Color */}
          {selectedColor && (
            <div className="flex items-center space-x-2 pt-0.5">
              <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-neutral-500 dark:text-neutral-400">
                Selected Color:
              </span>
              <span className="text-xs font-mono font-bold text-black dark:text-white bg-neutral-200/70 dark:bg-neutral-800 px-2 py-0.5 rounded-xs border border-neutral-300/80 dark:border-neutral-700 uppercase">
                {selectedColor}
              </span>
            </div>
          )}

          <div className="pt-1">
            <span className="inline-flex items-center text-xs uppercase tracking-wider font-bold bg-black dark:bg-white text-white dark:text-black px-2.5 py-1 rounded-xs shadow-2xs">
              Qty: {quantity}
            </span>
          </div>
        </div>
      </div>

      {/* Price Breakdown Section */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 px-5 py-4 space-y-3 bg-white/40 dark:bg-neutral-900/30">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-neutral-600 dark:text-neutral-400 font-medium">Unit Price</span>
          <span className="text-black dark:text-white font-mono font-semibold">₹{productPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-neutral-600 dark:text-neutral-400 font-medium">Quantity</span>
          <span className="text-black dark:text-white font-mono font-semibold">x{quantity}</span>
        </div>

        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-neutral-600 dark:text-neutral-400 font-medium">Subtotal</span>
          <span className="text-black dark:text-white font-mono font-semibold">₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-neutral-600 dark:text-neutral-400 font-medium">
            Shipping {stateName ? `(${stateName})` : ""}
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
            {activeCharge > 0 ? `₹${activeCharge.toFixed(2)}` : "FREE"}
          </span>
        </div>

        <div className="h-[1px] bg-neutral-250 dark:bg-neutral-800 my-1.5" />

        <div className="flex justify-between items-center pt-1">
          <span className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-black dark:text-white">
            Grand Total
          </span>
          <span className="text-base sm:text-lg font-mono font-extrabold text-black dark:text-white">
            ₹{grandTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
