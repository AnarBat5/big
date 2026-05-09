import type { Metadata } from "next";
import ShopGrid from "@/components/ShopGrid";

export const metadata: Metadata = {
  title: "Дэлгүүр",
  description: "Буйдан, ор, ширээ, шүүгээ — чанартай тавилгын бүрэн цуглуулга. Монголд үнэгүй хүргэлттэй.",
  openGraph: {
    title: "Дэлгүүр | Baganuur Investment Group",
    description: "Монголын тэргүүлэх тавилгын брэндийн бүтэн цуглуулга.",
  },
};

export default function ShopPage() {
  return <ShopGrid />;
}
