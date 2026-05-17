"use client";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, cartTotal } from "@/lib/store/cart";
import { formatPrice } from "@/lib/products";
import { calculateShipping, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { PLACEHOLDER_IMAGE } from "@/lib/config";

export default function CartPage() {
  const { items, remove, updateQty } = useCart();
  const total = cartTotal(items);
  const shipping = calculateShipping(total);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #C9A45F 0%, transparent 70%)" }}
        />
        <ShoppingBag size={48} className="mx-auto mb-6 text-muted relative" />
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-3 relative">Хоосон</p>
        <h1 className="font-serif text-5xl text-bark mb-4 relative">Сагс <span className="italic text-accent">хоосон</span></h1>
        <p className="text-muted mb-10 relative">Хүссэн бүтээгдэхүүнээ сонгож сагсандаа нэмнэ үү.</p>
        <Link href="/shop" className="btn-primary inline-flex items-center gap-2 group relative">
          Дэлгүүр үзэх <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 relative">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #A8753F 0%, transparent 70%)" }}
      />

      <div className="mb-12 relative">
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-3">Захиалга</p>
        <h1 className="font-serif text-5xl md:text-6xl text-bark leading-[0.95]">
          Таны <span className="italic text-accent">сагс</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-3">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="surface bg-cream/40 p-5 flex gap-5 group">
              <Link href={`/product/${product.id}`} className="relative w-28 h-28 bg-sand flex-shrink-0 overflow-hidden">
                <Image src={product.images[0] || PLACEHOLDER_IMAGE} alt={product.name} fill sizes="120px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted tracking-[0.25em] uppercase mb-1">{product.categoryName}</p>
                <Link href={`/product/${product.id}`} className="font-serif text-xl text-bark hover:text-accent transition-colors line-clamp-2">{product.name}</Link>
                <p className="text-xs text-muted mt-1">{product.material}</p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-sand bg-cream">
                    <button onClick={() => updateQty(product.id, qty - 1)} className="p-2 hover:bg-sand transition" aria-label="Хасах"><Minus size={12} /></button>
                    <span className="px-4 text-sm">{qty}</span>
                    <button onClick={() => updateQty(product.id, qty + 1)} disabled={qty >= product.inStock} className="p-2 hover:bg-sand disabled:opacity-30 transition" aria-label="Нэмэх"><Plus size={12} /></button>
                  </div>
                  <p className="font-medium text-bark whitespace-nowrap">{formatPrice(product.price * qty)}</p>
                </div>
              </div>
              <button onClick={() => remove(product.id)} className="self-start p-2 text-muted hover:text-red-700 transition" aria-label="Устгах">
                <X size={18} />
              </button>
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 self-start">
          <div className="surface bg-cream/40 p-7">
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-3">Дүн</p>
            <h2 className="font-serif text-3xl text-bark mb-6">Захиалгын дүн</h2>

            {shipping > 0 && (
              <div className="mb-5">
                <p className="text-xs text-muted mb-2">
                  Үнэгүй хүргэлтэнд <span className="text-accent font-medium">{formatPrice(FREE_SHIPPING_THRESHOLD - total)}</span> үлдлээ
                </p>
                <div className="w-full bg-sand h-1 rounded-full overflow-hidden">
                  <div className="bg-accent h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100)}%` }} />
                </div>
              </div>
            )}
            {shipping === 0 && <p className="text-xs text-accent mb-4 font-medium tracking-widest uppercase">✓ Үнэгүй хүргэлт</p>}

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-muted">Дэд дүн</span><span className="text-bark">{formatPrice(total)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Хүргэлт</span><span className="text-bark">{shipping === 0 ? "Үнэгүй" : formatPrice(shipping)}</span></div>
              <div className="border-t border-sand pt-3 flex justify-between font-medium text-lg">
                <span className="text-bark">Нийт</span>
                <span className="text-bark">{formatPrice(total + shipping)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary block text-center mt-6 group">
              <span className="inline-flex items-center gap-2">Захиалга өгөх <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span>
            </Link>
            <Link href="/shop" className="block text-center text-xs tracking-widest uppercase text-muted mt-4 hover:text-bark transition-colors">
              Дэлгүүрээр үргэлжлүүлэх
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
