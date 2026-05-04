"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { useProducts } from "@/lib/store/products";
import { useCart } from "@/lib/store/cart";
import { useToast } from "@/lib/store/toast";
import ProductCard from "@/components/ProductCard";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const products = useProducts((s) => s.products);
  const product = products.find((p) => p.id === id);
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.openDrawer);
  const showToast = useToast((s) => s.show);

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <h1 className="font-serif text-4xl text-bark mb-4">Бүтээгдэхүүн олдсонгүй</h1>
        <button onClick={() => router.push("/shop")} className="btn-primary">
          Дэлгүүр рүү буцах
        </button>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const outOfStock = product.inStock === 0;

  const handleAdd = () => {
    if (outOfStock) return;
    add(product, qty);
    showToast(`${product.name} (${qty}ш) сагсанд нэмэгдлээ`);
    openDrawer();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button onClick={() => router.back()} className="text-sm text-muted hover:text-bark mb-8">
        ← Буцах
      </button>

      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <div>
          <div className="aspect-square bg-sand overflow-hidden mb-4">
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square bg-sand overflow-hidden border-2 transition ${
                    activeImg === i ? "border-bark" : "border-transparent hover:border-sand"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
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
              <span className={outOfStock ? "text-red-700" : product.inStock <= 3 ? "text-accent" : "text-bark"}>
                {outOfStock ? "Дууссан" : `${product.inStock} ширхэг`}
              </span>
            </div>
          </div>

          {!outOfStock && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-muted">Тоо:</span>
              <div className="flex items-center border border-sand">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-sand">
                  <Minus size={14} />
                </button>
                <span className="px-6 font-medium">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.inStock, qty + 1))}
                  disabled={qty >= product.inStock}
                  className="p-3 hover:bg-sand disabled:opacity-30"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} />
            {outOfStock ? "Дууссан" : "Сагсанд нэмэх"}
          </button>

          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 text-muted">
              <Truck size={18} className="text-accent" />
              <span>Үнэгүй хүргэлт</span>
            </div>
            <div className="flex items-center gap-3 text-muted">
              <ShieldCheck size={18} className="text-accent" />
              <span>5 жилийн баталгаа</span>
            </div>
          </div>
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
