export interface CartItem {
  id: string; // Unique composite key e.g. `${productId}_${selectedColor || "default"}`
  productId: string;
  title: string;
  slug: string;
  image: string;
  price: number; // Effective active price
  originalPrice?: number;
  quantity: number;
  productCode?: string | null;
  selectedColor?: string | null;
  categoryName?: string | null;
}
