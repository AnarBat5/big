"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/products";

type CartItem = { product: Product; qty: number };

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (p, qty = 1) =>
        set((state) => {
          const found = state.items.find((i) => i.product.id === p.id);
          const newQty = found ? Math.min(found.qty + qty, p.inStock) : Math.min(qty, p.inStock);
          if (found) {
            return {
              items: state.items.map((i) =>
                i.product.id === p.id ? { ...i, qty: newQty } : i
              ),
            };
          }
          return { items: [...state.items, { product: p, qty: newQty }] };
        }),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.product.id !== id) })),
      updateQty: (id, qty) =>
        set((state) => {
          if (qty <= 0) return { items: state.items.filter((i) => i.product.id !== id) };
          return {
            items: state.items.map((i) =>
              i.product.id === id ? { ...i, qty: Math.min(qty, i.product.inStock) } : i
            ),
          };
        }),
      clear: () => set({ items: [] }),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
    }),
    { name: "baganuur-cart" }
  )
);

export const cartTotal = (items: CartItem[]) =>
  items.reduce((s, i) => s + i.product.price * i.qty, 0);

export const cartCount = (items: CartItem[]) =>
  items.reduce((s, i) => s + i.qty, 0);
