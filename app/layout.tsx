import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Toaster from "@/components/Toaster";
import ProductsInit from "@/components/ProductsInit";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
});
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://baganuurig.mn";

export const metadata: Metadata = {
  title: {
    default: "Baganuur Investment Group — Чанартай тавилга",
    template: "%s | Baganuur Investment Group",
  },
  description:
    "Монголын тэргүүлэх тавилгын брэнд. 12+ жилийн туршлага, 15,000+ үйлчлүүлэгч. Буйдан, ор, ширээ, шүүгээ.",
  keywords: ["тавилга", "буйдан", "ор", "ширээ", "шүүгээ", "Монгол тавилга", "Baganuur"],
  applicationName: "Baganuur Investment Group",
  authors: [{ name: "Baganuur Investment Group" }],
  openGraph: {
    type: "website",
    locale: "mn_MN",
    url: APP_URL,
    siteName: "Baganuur Investment Group",
    title: "Baganuur Investment Group — Чанартай тавилга",
    description: "Монголын тэргүүлэх тавилгын брэнд.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  metadataBase: new URL(APP_URL),
};

export const viewport: Viewport = {
  themeColor: "#F5F0E8",
  colorScheme: "light",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  name: "Baganuur Investment Group",
  url: APP_URL,
  description: "Монголын тэргүүлэх тавилгын брэнд.",
  telephone: "+976-7000-1234",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Энхтайваны өргөн чөлөө 17",
    addressLocality: "Улаанбаатар",
    addressRegion: "Сүхбаатар дүүрэг",
    addressCountry: "MN",
  },
  openingHours: ["Mo-Sa 09:00-19:00", "Su 10:00-17:00"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
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
