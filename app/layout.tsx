import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Toaster from "@/components/Toaster";
import ProductsInit from "@/components/ProductsInit";

export const metadata: Metadata = {
  title: {
    default: "Baganuur Investment Group — Чанартай тавилга",
    template: "%s | Baganuur Investment Group",
  },
  description:
    "Монголын тэргүүлэх тавилгын брэнд. 12+ жилийн туршлага, 15,000+ үйлчлүүлэгч. Буйдан, ор, ширээ, шүүгээ.",
  keywords: ["тавилга", "буйдан", "ор", "ширээ", "шүүгээ", "Монгол тавилга", "Baganuur"],
  openGraph: {
    type: "website",
    locale: "mn_MN",
    siteName: "Baganuur Investment Group",
    title: "Baganuur Investment Group — Чанартай тавилга",
    description: "Монголын тэргүүлэх тавилгын брэнд.",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://baganuurig.mn"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body>
        <ProductsInit />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
        <Toaster />
      </body>
    </html>
  );
}
