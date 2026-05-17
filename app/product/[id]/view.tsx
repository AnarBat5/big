"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { useProducts } from "@/lib/store/products";
import { useCart } from "@/lib/store/cart";
import { useToast } from "@/lib/store/toast";
import { PLACEHOLDER_IMAGE } from "@/lib/config";
import ProductCard from "@/components/ProductCard";
import WishlistButton from "@/components/WishlistButton";
import Reveal from "@/components/Reveal";

export default function ProductView({ product, initialProducts }: { product: Product; initialProducts: Product[] }) {
  const router = useRouter();
  const setSeed = useProducts((s) => s.setSeed);
  const allProducts = useProducts((s) => s.products);
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.openDrawer);
  const showToast = useToast((s) => s.show);

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => { setSeed(initialProducts); }, [initialProducts, setSeed]);

  const live = allProducts.find((p) => p.id === product.id);
  const current = live ?? product;
  const outOfStock = current.inStock === 0;
  const productsForRelated = allProducts.length > 0 ? allProducts : initialProducts;
  const related = productsForRelated.filter((p) => p.category === current.category && p.id !== current.id).slice(0, 4);

  const handleAdd = () => {
    if (outOfStock) return;
    add(current, qty);
    showToast(`${current.name} (${qty}ш) сагсанд нэмэгдлээ`);
    openDrawer();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-0 h-[500px] w-[500px] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #C9A45F 0%, transparent 70%)" }}
      />

      <button onClick={() => router.push("/shop")} className="text-[10px] tracking-widest uppercase text-muted hover:text-bark inline-flex items-center gap-2 mb-10 group transition-colors">
        <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" /> Дэлгүүр рүү
      </button>

      <div className="grid md:grid-cols-2 gap-12 mb-24 relative">
        <div className="animate-fade-in">
          <div className="aspect-square bg-sand overflow-hidden mb-4 relative">
            <Image src={current.images[activeImg] || PLACEHOLDER_IMAGE} alt={current.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
            <div className="absolute top-4 right-4">
              <WishlistButton productId={current.id} />
            </div>
          </div>
          {current.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {current.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`aspect-square bg-sand overflow-hidden border-2 transition relative ${activeImg === i ? "border-bark" : "border-transparent hover:border-sand"}`}
                  aria-label={`Зураг ${i + 1}`}>
                  <Image src={img || PLACEHOLDER_IMAGE} alt="" fill sizes="120px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="animate-fade-in-up">
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-4">{current.categoryName}</p>
          <h1 className="font-serif text-5xl md:text-6xl text-bark mb-5 leading-[0.95]">{current.name}</h1>
          <p className="text-3xl text-bark mb-8 font-light">{formatPrice(current.price)}</p>
          <p className="text-bark/70 leading-relaxed mb-8">{current.description}</p>

          <div className="surface bg-cream/40 p-5 mb-8 space-y-3">
            {current.material && (
              <div className="flex justify-between text-sm">
                <span className="text-[10px] uppercase tracking-widest text-muted">Материал</span>
                <span className="text-bark">{current.material}</span>
              </div>
            )}
            {current.dimensions && (
              <div className="flex justify-between text-sm">
                <span className="text-[10px] uppercase tracking-widest text-muted">Хэмжээ</span>
                <span className="text-bark">{current.dimensions}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-[10px] uppercase tracking-widest text-muted">Үлдэгдэл</span>
              <span className={outOfStock ? "text-red-700" : current.inStock <= 3 ? "text-accent" : "text-bark"}>
                {outOfStock ? "Дууссан" : `${current.inStock} ширхэг`}
              </span>
            </div>
          </div>

          {!outOfStock && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] uppercase tracking-widest text-muted">Тоо</span>
              <div className="flex items-center border border-sand bg-cream">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-sand transition" aria-label="Хасах"><Minus size={14} /></button>
                <span className="px-6 font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(current.inStock, qty + 1))} disabled={qty >= current.inStock} className="p-3 hover:bg-sand disabled:opacity-30 transition" aria-label="Нэмэх"><Plus size={14} /></button>
              </div>
            </div>
          )}

          <button onClick={handleAdd} disabled={outOfStock} className="btn-primary w-full flex items-center justify-center gap-2 group">
            <ShoppingBag size={16} />
            {outOfStock ? "Дууссан" : "Сагсанд нэмэх"}
          </button>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="surface bg-cream/40 p-4 flex items-center gap-3 text-sm">
              <Truck size={16} className="text-accent" />
              <div>
                <p className="text-[10px] tracking-widest uppercase text-muted">Хүргэлт</p>
                <p className="text-bark">Үнэгүй</p>
              </div>
            </div>
            <div className="surface bg-cream/40 p-4 flex items-center gap-3 text-sm">
              <ShieldCheck size={16} className="text-accent" />
              <div>
                <p className="text-[10px] tracking-widest uppercase text-muted">Баталгаа</p>
                <p className="text-bark">5 жил</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <Reveal>
          <section>
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-3">Холбоотой</p>
            <h2 className="font-serif text-3xl md:text-4xl text-bark mb-10">Танд <span className="italic text-accent">таалагдах</span></h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        </Reveal>
      )}
    </div>
  );
}
