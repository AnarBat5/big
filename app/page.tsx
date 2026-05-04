"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { categories } from "@/lib/products";
import { useProducts } from "@/lib/store/products";
import ProductCard from "@/components/ProductCard";

function ShopContent() {
  const params = useSearchParams();
  const initialCat = params.get("cat") || "all";
  const products = useProducts((s) => s.products);
  const [cat, setCat] = useState(initialCat);
  const [sort, setSort] = useState<"new" | "low" | "high">("new");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = cat === "all" ? products : products.filter((p) => p.category === cat);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [cat, sort, query, products]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">Бүх бүтээгдэхүүн</p>
        <h1 className="font-serif text-5xl text-bark">Дэлгүүр</h1>
      </div>

      <div className="relative mb-8 max-w-md mx-auto">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Бүтээгдэхүүн хайх..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-sand bg-cream focus:outline-none focus:border-bark"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-sand">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCat("all")}
            className={`px-4 py-2 text-sm tracking-wide transition ${
              cat === "all" ? "bg-bark text-cream" : "border border-sand text-bark hover:border-bark"
            }`}
          >
            Бүгд
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`px-4 py-2 text-sm tracking-wide transition ${
                cat === c.id ? "bg-bark text-cream" : "border border-sand text-bark hover:border-bark"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="border border-sand bg-cream px-4 py-2 text-sm text-bark focus:outline-none focus:border-bark"
        >
          <option value="new">Шинэ нь түрүүнд</option>
          <option value="low">Үнэ: бага → их</option>
          <option value="high">Үнэ: их → бага</option>
        </select>
      </div>

      <p className="text-sm text-muted mb-8">{filtered.length} бүтээгдэхүүн олдлоо</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted py-20">Илэрц олдсонгүй.</p>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Ачааллаж байна...</div>}>
      <ShopContent />
    </Suspense>
  );
}
