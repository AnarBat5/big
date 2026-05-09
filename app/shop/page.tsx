import type { Metadata } from "next";
import ShopGrid from "@/components/ShopGrid";
import { getProducts } from "@/lib/server/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Дэлгүүр",
  description: "Буйдан, ор, ширээ, шүүгээ — чанартай тавилгын бүрэн цуглуулга. Монголд үнэгүй хүргэлттэй.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Дэлгүүр | Baganuur Investment Group",
    description: "Монголын тэргүүлэх тавилгын брэндийн бүтэн цуглуулга.",
  },
};

export default async function ShopPage() {
  const products = await getProducts();
  return <ShopGrid initialProducts={products} />;
}
