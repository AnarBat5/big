import { products } from "@/lib/products";
import ProductClient from "./ProductClient";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default function ProductPage() {
  return <ProductClient />;
}
