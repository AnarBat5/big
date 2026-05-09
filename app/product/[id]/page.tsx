import { notFound } from "next/navigation";
import ProductView from "./view";
import { getProducts, getProductById } from "@/lib/server/products";

export const revalidate = 60;

// Pre-render every product at build time; new ones get ISR'd on first hit.
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

export const dynamicParams = true;

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) notFound();
  const products = await getProducts();
  return <ProductView product={product} initialProducts={products} />;
}
