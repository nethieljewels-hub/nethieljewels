"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "@/types/cart";

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">, openDrawer?: boolean) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalCount: number;
  totalAmount: number;
  totalOriginalAmount: number;
  totalSavings: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "nethiel_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever items change (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items, isLoaded]);

  const addToCart = (
    newItem: Omit<CartItem, "id">,
    openDrawer: boolean = true
  ) => {
    const compositeId = `${newItem.productId}_${newItem.selectedColor || "default"}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === compositeId);

      if (existingIndex > -1) {
        // Item with same product and color already exists, increase quantity
        const updated = [...prevItems];
        const existing = updated[existingIndex];
        if (existing) {
          updated[existingIndex] = {
            ...existing,
            quantity: existing.quantity + (newItem.quantity || 1),
          };
        }
        return updated;
      } else {
        // Add new item to beginning of cart
        return [
          {
            ...newItem,
            id: compositeId,
            quantity: newItem.quantity || 1,
          },
          ...prevItems,
        ];
      }
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculations
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalOriginalAmount = items.reduce(
    (acc, item) => acc + (item.originalPrice || item.price) * item.quantity,
    0
  );

  const totalSavings = Math.max(0, totalOriginalAmount - totalAmount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalCount,
        totalAmount,
        totalOriginalAmount,
        totalSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
