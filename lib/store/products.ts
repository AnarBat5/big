"use client";
import { create } from "zustand";
import { Product, initialProducts } from "@/lib/products";

type ProductState = {
  products: Product[];
  loading: boolean;
  fetched: boolean;
  fetchProducts: () => Promise<void>;
  add: (p: Omit<Product, "id">) => Promise<void>;
  update: (id: string, p: Partial<Product>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reset: () => Promise<void>;
  getById: (id: string) => Product | undefined;
};

export const useProducts = create<ProductState>()((set, get) => ({
  products: initialProducts,
  loading: false,
  fetched: false,

  fetchProducts: async () => {
    if (get().fetched) return;
    set({ loading: true });
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          set({ products: data, fetched: true });
          return;
        }
      }
    } catch {}
    // Fallback to static data
    set({ products: initialProducts, fetched: true });
    set({ loading: false });
  },

  add: async (p) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      if (res.ok) {
        const product = await res.json();
        set((state) => ({ products: [...state.products, product] }));
        return;
      }
    } catch {}
    // Fallback local
    set((state) => ({
      products: [...state.products, { ...p, id: Date.now().toString() }],
    }));
  },

  update: async (id, patch) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch {}
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  },

  remove: async (id) => {
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
    } catch {}
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
  },

  reset: async () => {
    try {
      await fetch("/api/seed", { method: "POST" });
      set({ fetched: false });
      await get().fetchProducts();
    } catch {
      set({ products: initialProducts });
    }
  },

  getById: (id) => get().products.find((p) => p.id === id),
}));
