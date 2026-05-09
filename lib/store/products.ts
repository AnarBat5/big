"use client";
import { create } from "zustand";
import { Product, initialProducts } from "@/lib/products";

type ProductState = {
  products: Product[];
  loading: boolean;
  fetched: boolean;
  setSeed: (products: Product[]) => void;
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

  setSeed: (products) => {
    if (!get().fetched && products.length > 0) {
      set({ products, fetched: true });
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          set({ products: data, fetched: true, loading: false });
          return;
        }
      }
    } catch {}
    // Fallback to static data
    set({ products: initialProducts, fetched: true, loading: false });
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
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `PATCH failed: ${res.status}`);
    }
    const updated = await res.json();
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    }));
  },

  remove: async (id) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `DELETE failed: ${res.status}`);
    }
    // Re-fetch from Supabase to stay in sync
    set({ fetched: false });
    await get().fetchProducts();
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
