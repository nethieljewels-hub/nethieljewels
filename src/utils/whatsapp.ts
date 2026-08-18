interface WhatsAppMessageParams {
  productName: string;
  productCode?: string | null;
  selectedColor?: string | null;
  category: string;
  productPrice: number;
  quantity: number;
  stateName: string;
  shippingCharge: number;
  grandTotal: number;
  customerName: string;
  houseName: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  phone: string;
  productUrl: string;
}

export interface MultiProductOrderItem {
  title: string;
  productCode?: string | null;
  selectedColor?: string | null;
  price: number;
  quantity: number;
  productUrl: string;
}

export interface MultiProductWhatsAppParams {
  items: MultiProductOrderItem[];
  stateName: string;
  shippingCharge: number;
  subtotal: number;
  grandTotal: number;
  customerName: string;
  houseName: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  phone: string;
}

export function generateWhatsAppMessage(params: WhatsAppMessageParams): string {
  const subtotal = params.productPrice * params.quantity;
  const line = "━━━━━━━━━━━━━━━━━━";

  return [
    `✨ *New Jewelry Order / Inquiry*`,
    "",
    line,
    "",
    `💍 *${params.productName.toUpperCase()}*`,
    ...(params.productCode ? [`🏷️ *Product Code:* ${params.productCode}`] : []),
    ...(params.selectedColor ? [`🎨 *Color:* ${params.selectedColor}`] : []),
    "------------------",
    `🏷️ Category: ${params.category}`,
    `💰 Price: ₹${params.productPrice.toFixed(2)}`,
    `📦 Quantity: ${params.quantity}`,
    `💵 Subtotal: ₹${subtotal.toFixed(2)}`,
    "------------------",
    "",
    line,
    "",
    `🚚 *SHIPPING*`,
    "",
    `📍 State: ${params.stateName}`,
    `💲 Shipping Charge: ${params.shippingCharge > 0 ? `₹${params.shippingCharge.toFixed(2)}` : "Free"}`,
    "",
    line,
    "",
    `💰 *GRAND TOTAL: ₹${params.grandTotal.toFixed(2)}*`,
    "",
    line,
    "",
    `👤 *CUSTOMER DETAILS*`,
    "",
    `📛 Name: ${params.customerName}`,
    `🏠 House: ${params.houseName}`,
    `📍 Address: ${params.address}`,
    `🏙️ District: ${params.district}`,
    `🗺️ State: ${params.state}`,
    `📮 Pincode: ${params.pincode}`,
    `📞 Phone: ${params.phone}`,
    "",
    line,
    "",
    `🔗 *VIEW PRODUCT ON SITE*`,
    params.productUrl,
    "",
    line,
    "",
    `Looking forward to your response! 🙏`,
  ].join("\n");
}

export function generateMultiProductWhatsAppMessage(
  params: MultiProductWhatsAppParams
): string {
  const line = "━━━━━━━━━━━━━━━━━━";
  const totalItemsCount = params.items.reduce((acc, item) => acc + item.quantity, 0);

  const itemsList = params.items
    .map((item, index) => {
      const itemSubtotal = item.price * item.quantity;
      return [
        `*${index + 1}. ${item.title.toUpperCase()}*`,
        ...(item.productCode ? [`   🏷️ Code: ${item.productCode}`] : []),
        ...(item.selectedColor ? [`   🎨 Color: ${item.selectedColor}`] : []),
        `   📦 Qty: ${item.quantity} × ₹${item.price.toFixed(2)} = ₹${itemSubtotal.toFixed(2)}`,
        `   🔗 ${item.productUrl}`,
      ].join("\n");
    })
    .join("\n\n");

  return [
    `✨ *NEW MULTI-ITEM ORDER - NETHIEL JEWELRY* ✨`,
    "",
    line,
    `🛍️ *ORDERED ITEMS (${totalItemsCount} ${totalItemsCount === 1 ? "piece" : "pieces"})*`,
    line,
    "",
    itemsList,
    "",
    line,
    `📊 *PRICE BREAKDOWN*`,
    `💵 Items Subtotal: ₹${params.subtotal.toFixed(2)}`,
    `🚚 Shipping (${params.stateName || "Standard"}): ${
      params.shippingCharge > 0 ? `₹${params.shippingCharge.toFixed(2)}` : "FREE"
    }`,
    `💰 *GRAND TOTAL: ₹${params.grandTotal.toFixed(2)}*`,
    line,
    "",
    `👤 *CUSTOMER DELIVERY DETAILS*`,
    `📛 Name: ${params.customerName}`,
    `🏠 House: ${params.houseName}`,
    `📍 Address: ${params.address}`,
    `🏙️ District: ${params.district}`,
    `🗺️ State: ${params.state}`,
    `📮 Pincode: ${params.pincode}`,
    `📞 Phone: ${params.phone}`,
    "",
    line,
    `Please confirm my order. Thank you! 🙏`,
  ].join("\n");
}

export function openWhatsApp(phone: string, message: string): void {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  // Ensure the message string is processed as clean UTF-8
  const processedMessage = new TextDecoder("utf-8").decode(
    new TextEncoder().encode(message)
  );
  const encoded = encodeURIComponent(processedMessage);
  const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
