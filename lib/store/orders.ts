"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/products";

export type OrderStatus = "Хүлээгдэж буй" | "Хүргэгдэж буй" | "Дууссан" | "Цуцлагдсан";

export type Order = {
  id: string;
  customer: { name: string; phone: string; email: string };
  address: { district: string; detail: string; note?: string };
  payment: string;
  items: { product: Product; qty: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  date: string;
};

type OrderState = {
  orders: Order[];
  add: (order: Omit<Order, "id" | "date" | "status">) => string;
  updateStatus: (id: string, status: OrderStatus) => void;
  remove: (id: string) => void;
};

export const useOrders = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      add: (order) => {
        const id = "BG" + (Math.floor(Math.random() * 90000) + 10000);
        const newOrder: Order = {
          ...order,
          id,
          date: new Date().toISOString().split("T")[0],
          status: "Хүлээгдэж буй",
        };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return id;
      },
      updateStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      remove: (id) =>
        set((state) => ({ orders: state.orders.filter((o) => o.id !== id) })),
    }),
    { name: "baganuur-orders" }
  )
);
