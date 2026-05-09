import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/server/products";
import ProductCard from "@/components/ProductCard";
import ShopGrid from "@/components/ShopGrid";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured && p.inStock > 0).slice(0, 4);

  return (
    <>
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16 border-b border-sand">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">Онцлох</p>
              <h2 className="font-serif text-4xl text-bark">Шилмэл бүтээгдэхүүн</h2>
            </div>
            <Link
              href="/shop"
              className="text-sm text-muted hover:text-bark transition tracking-wide hidden md:block"
            >
              Бүгдийг үзэх →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop" className="text-sm text-muted hover:text-bark transition">
              Бүгдийг үзэх →
            </Link>
          </div>
        </section>
      )}
      <ShopGrid initialProducts={products} />
    </>
  );
}
