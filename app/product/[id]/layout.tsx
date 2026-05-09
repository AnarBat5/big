import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Бүтээгдэхүүн",
  description: "Baganuur Investment Group-ийн чанартай тавилга — дэлгэрэнгүй мэдээлэл, үнэ, хэмжээ.",
  openGraph: {
    title: "Бүтээгдэхүүн | Baganuur Investment Group",
    description: "Монголын тэргүүлэх тавилгын брэндийн чанартай бүтээгдэхүүн.",
  },
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
