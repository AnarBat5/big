import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";

export const metadata: Metadata = {
  title: "Baganuur Investment Group — Чанартай тавилга",
  description: "Монголын тэргүүлэх тавилгын брэнд. Буйдан, ор, ширээ, шүүгээ.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
