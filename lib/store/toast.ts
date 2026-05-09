"use client";
import { create } from "zustand";

type Toast = { id: number; message: string; type: "success" | "error" | "info" };

type ToastState = {
  toasts: Toast[];
  show: (message: string, type?: Toast["type"]) => void;
  dismiss: (id: number) => void;
};

let counter = 0;

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  show: (message, type = "success") => {
    const id = ++counter;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
