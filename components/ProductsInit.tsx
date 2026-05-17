"use client";
import { useEffect } from "react";
import { useProducts } from "@/lib/store/products";

export default function ProductsInit() {
  const fetchProducts = useProducts((s) => s.fetchProducts);
  const fetched = useProducts((s) => s.fetched);

  useEffect(() => {
    if (fetched) return;
    // Defer fetch until after first paint so it never blocks rendering
    const id = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(id);
  }, [fetched, fetchProducts]);

  return null;
}
