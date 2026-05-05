"use client";
import { useEffect } from "react";
import { useProducts } from "@/lib/store/products";

export default function ProductsInit() {
  const fetchProducts = useProducts((s) => s.fetchProducts);
  const fetched = useProducts((s) => s.fetched);

  useEffect(() => {
    if (!fetched) fetchProducts();
  }, [fetched, fetchProducts]);

  return null;
}
