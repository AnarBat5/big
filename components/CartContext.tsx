"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/lib/products";

type CartItem = { product: Product; qty: number };

type CartContextType = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (p: Product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product.id === p.id);
      if (found)
        return prev.map((i) =>
          i.product.id === p.id ? { ...i, qty: i.qty + qty } : i
        );
      return [...prev, { product: p, qty }];
    });
  };

  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.product.id !== id));

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return remove(id);
    setItems((prev) =>
      prev.map((i) => (i.product.id === id ? { ...i, qty } : i))
    );
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};
