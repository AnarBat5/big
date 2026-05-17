"use client";
import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { categories, type Product } from "@/lib/products";
import { useProducts } from "@/lib/store/products";
import ProductCard from "@/components/ProductCard";

type SortKey = "new" | "low" | "high";
type StockKey = "all" | "in" | "low";
type PriceKey = "all" | "0-1000000" | "1000000-3000000" | "3000000+";

function ShopGridContent({ initialProducts }: { initialProducts?: Product[] }) {
  const params = useSearchParams();
  const initialCat = params.get("cat") || "all";

  const storeProducts = useProducts((s) => s.products);
  const setSeed       = useProducts((s) => s.setSeed);
  const loading       = useProducts((s) => s.loading);
  const fetched       = useProducts((s) => s.fetched);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) setSeed(initialProducts);
  }, [initialProducts, setSeed]);

  const products = storeProducts.length > 0 ? storeProducts : initialProducts ?? [];
  const isLoading = (loading || !fetched) && products.length === 0;

  const [cat, setCat] = useState(initialCat);
  const [sort, setSort] = useState<SortKey>("new");
  const [stock, setStock] = useState<StockKey>("all");
  const [price, setPrice] = useState<PriceKey>("all");
  const [materials, setMaterials] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const materialOptions = useMemo(() => {
    const unique = new Set<string>();
    for (const p of products) {
      const raw = (p.material || "").trim();
      if (!raw) continue;
      unique.add(raw);
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b, "mn")).slice(0, 10);
  }, [products]);

  const categoryCount = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    }
    return map;
  }, [products]);

  const filtered = useMemo(() => {
    let list = cat === "all" ? products : products.filter((p) => p.category === cat);

    if (stock === "in") list = list.filter((p) => p.inStock > 0);
    if (stock === "low") list = list.filter((p) => p.inStock > 0 && p.inStock <= 3);

    if (price === "0-1000000") list = list.filter((p) => p.price < 1_000_000);
    if (price === "1000000-3000000") list = list.filter((p) => p.price >= 1_000_000 && p.price <= 3_000_000);
    if (price === "3000000+") list = list.filter((p) => p.price > 3_000_000);

    if (materials.length > 0) {
      list = list.filter((p) => materials.includes((p.material || "").trim()));
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }
    if (sort === "low")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [cat, sort, stock, price, materials, query, products]);

  const inStockCount = useMemo(() => products.filter((p) => p.inStock > 0).length, [products]);

  const clearFilters = () => {
    setCat("all");
    setStock("all");
    setPrice("all");
    setMaterials([]);
    setQuery("");
    setSort("new");
  };

  const toggleMaterial = (m: string) => {
    setMaterials((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-14 ambient-bg">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl text-bark leading-tight">Дэлгүүр</h1>
          <p className="text-xs tracking-widest uppercase text-muted mt-3">
            Нийт {products.length} • Нөөцтэй {inStockCount} • Илэрц {filtered.length}
          </p>
        </div>
        <div className="relative w-full max-w-md futuristic-panel rounded-xl p-1.5">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Нэр, материал, ангиллаар хайх"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-sand/70 bg-cream/70 rounded-lg focus:outline-none focus:border-bark transition"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[270px,1fr] gap-6 items-start">
        <aside className="futuristic-panel rounded-2xl p-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-medium text-bark inline-flex items-center gap-2">
              <SlidersHorizontal size={14} /> Шүүлтүүр
            </p>
            <button onClick={clearFilters} className="text-[10px] tracking-widest uppercase text-accent hover:text-bark transition-colors">
              Цэвэрлэх
            </button>
          </div>

          <div className="space-y-6 text-sm">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-muted mb-3">Ангилал</p>
              <div className="space-y-2">
                <button
                  onClick={() => setCat("all")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition ${
                    cat === "all" ? "bg-bark text-cream border-bark" : "border-sand hover:border-bark/50 text-bark"
                  }`}
                >
                  <span>Бүгд</span>
                  <span className="text-xs opacity-70">{products.length}</span>
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCat(c.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition ${
                      cat === c.id ? "bg-bark text-cream border-bark" : "border-sand hover:border-bark/50 text-bark"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-xs opacity-70">{categoryCount.get(c.id) ?? 0}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] tracking-widest uppercase text-muted mb-3">Төлөв</p>
              <div className="space-y-2">
                {[
                  { key: "all", label: "Бүгд" },
                  { key: "in", label: "Нөөцтэй" },
                  { key: "low", label: "Цөөн үлдсэн" },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setStock(s.key as StockKey)}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition ${
                      stock === s.key ? "bg-bark text-cream border-bark" : "border-sand hover:border-bark/50 text-bark"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] tracking-widest uppercase text-muted mb-3">Үнэ</p>
              <div className="space-y-2">
                {[
                  { key: "all", label: "Бүгд" },
                  { key: "0-1000000", label: "1,000,000₮-с бага" },
                  { key: "1000000-3000000", label: "1,000,000₮ - 3,000,000₮" },
                  { key: "3000000+", label: "3,000,000₮-с дээш" },
                ].map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPrice(p.key as PriceKey)}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition ${
                      price === p.key ? "bg-bark text-cream border-bark" : "border-sand hover:border-bark/50 text-bark"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {materialOptions.length > 0 && (
              <div>
                <p className="text-[10px] tracking-widest uppercase text-muted mb-3">Материал</p>
                <div className="space-y-2 max-h-52 overflow-auto pr-1">
                  {materialOptions.map((m) => (
                    <button
                      key={m}
                      onClick={() => toggleMaterial(m)}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition ${
                        materials.includes(m) ? "bg-bark text-cream border-bark" : "border-sand hover:border-bark/50 text-bark"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <div>
          <div className="futuristic-panel rounded-2xl p-4 md:p-5 mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[10px] tracking-[0.28em] uppercase text-muted">{filtered.length} илэрц</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border border-sand/80 bg-cream/80 rounded-lg px-4 py-2 text-xs text-bark focus:outline-none focus:border-bark"
            >
              <option value="new">Шинэ нь түрүүнд</option>
              <option value="low">Үнэ: бага → их</option>
              <option value="high">Үнэ: их → бага</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-12">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div className="aspect-[4/5] shimmer mb-4 rounded-xl" />
                  <div className="h-3 shimmer w-1/3 mb-2 rounded" />
                  <div className="h-4 shimmer w-2/3 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-12">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {filtered.length === 0 && (
                <p className="text-center text-muted py-20">Илэрц олдсонгүй.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopGrid({ initialProducts }: { initialProducts?: Product[] } = {}) {
  return (
    <Suspense fallback={<div className="p-20 text-center text-muted">Ачаалж байна...</div>}>
      <ShopGridContent initialProducts={initialProducts} />
    </Suspense>
  );
}
