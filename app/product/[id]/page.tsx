"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { getProduct, formatPrice, products } from "@/lib/products";
import { useCart } from "@/components/CartContext";
import ProductCard from "@/components/ProductCard";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = getProduct(id);
  if (!product) {
    return <div className="max-w-7xl mx-auto px-6 py-20 text-center">Бүтээгдэхүүн олдсонгүй.</div>;
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button onClick={() => router.back()} className="text-sm text-muted hover:text-bark mb-8">
        ← Буцах
      </button>

      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <div className="aspect-square bg-sand overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-3">{product.categoryName}</p>
          <h1 className="font-serif text-5xl text-bark mb-4">{product.name}</h1>
          <p className="text-3xl text-bark mb-8">{formatPrice(product.price)}</p>

          <p className="text-bark/80 leading-relaxed mb-8">{product.description}</p>

          <div className="border-y border-sand py-6 mb-8 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Материал</span>
              <span className="text-bark">{product.material}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Хэмжээ</span>
              <span className="text-bark">{product.dimensions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Үлдэгдэл</span>
              <span className="text-bark">{product.inStock} ширхэг</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-muted">Тоо:</span>
            <div className="flex items-center border border-sand">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-sand">
                <Minus size={14} />
              </button>
              <span className="px-6 font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-sand">
                <Plus size={14} />
              </button>
            </div>
          </div>

          <button onClick={handleAdd} className="btn-primary w-full flex items-center justify-center gap-2">
            {added ? (
              <>
                <Check size={18} /> Сагсанд нэмэгдлээ
              </>
            ) : (
              <>
                <ShoppingBag size={18} /> Сагсанд нэмэх
              </>
            )}
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="font-serif text-3xl text-bark mb-8">Холбоотой бүтээгдэхүүн</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
