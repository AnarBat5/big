import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сагс",
  description: "Таны захиалгын сагс — бүтээгдэхүүнээ шалгаад захиалгаа өгнө үү.",
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
