"use client";
import { create } from "zustand";

type WishState = {
  ids: Set<string>;
  loaded: boolean;
  load:   () => Promise<void>;
  has:    (id: string) => boolean;
  toggle: (id: string) => Promise<{ added: boolean } | null>;
};

export const useWishlist = create<WishState>((set, get) => ({
  ids: new Set(),
  loaded: false,
  load: async () => {
    if (get().loaded) return;
    try {
      const res = await fetch("/api/wishlist", { credentials: "include" });
      if (res.ok) {
        const arr = await res.json();
        if (Array.isArray(arr)) set({ ids: new Set(arr), loaded: true });
        else set({ loaded: true });
      } else set({ loaded: true });
    } catch { set({ loaded: true }); }
  },
  has: (id) => get().ids.has(id),
  toggle: async (id) => {
    const has = get().ids.has(id);
    if (has) {
      const res = await fetch(`/api/wishlist?productId=${encodeURIComponent(id)}`, { method: "DELETE", credentials: "include" });
      if (res.status === 401) return null;
      if (res.ok) {
        const next = new Set(get().ids); next.delete(id); set({ ids: next });
        return { added: false };
      }
    } else {
      const res = await fetch("/api/wishlist", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ productId: id }),
      });
      if (res.status === 401) return null;
      if (res.ok) {
        const next = new Set(get().ids); next.add(id); set({ ids: next });
        return { added: true };
      }
    }
    return null;
  },
}));
