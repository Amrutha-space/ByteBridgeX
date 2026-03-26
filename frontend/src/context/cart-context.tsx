"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { readCartStorage, writeCartStorage } from "@/lib/storage";
import type { CartItem, Product } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  loading: boolean;
  addItem: (product: Product) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedItems = readCartStorage();
    setItems(storedItems);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      writeCartStorage(items);
    }
  }, [items, loading]);

  const value = useMemo(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce(
      (total, item) => total + Number(item.product.price) * item.quantity,
      0,
    );

    return {
      items,
      itemCount,
      subtotal,
      loading,
      addItem: (product: Product) =>
        setItems((currentItems) => {
          const existingItem = currentItems.find(
            (item) => item.product.slug === product.slug,
          );

          if (existingItem) {
            return currentItems.map((item) =>
              item.product.slug === product.slug
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          }

          return [...currentItems, { product, quantity: 1 }];
        }),
      removeItem: (slug: string) =>
        setItems((currentItems) =>
          currentItems.filter((item) => item.product.slug !== slug),
        ),
      updateQuantity: (slug: string, quantity: number) =>
        setItems((currentItems) =>
          currentItems.map((item) =>
            item.product.slug === slug
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          ),
        ),
      clearCart: () => setItems([]),
    };
  }, [items, loading]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
