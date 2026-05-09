"use client";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart, cartTotal, cartCount } from "@/lib/store/cart";
import { formatPrice } from "@/lib/products";
import { calculateShipping, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { PLACEHOLDER_IMAGE } from "@/lib/config";

export default function CartDrawer() {
  const { items, isOpen, closeDrawer, updateQty, remove } = useCart();
  const total = cartTotal(items);
  const count = cartCount(items);
  const shipping = calculateShipping(total);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-charcoal/60 z-[55] animate-fade-in" onClick={closeDrawer} />
      )}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-cream z-[56] shadow-2xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
        <div className="flex items-center justify-between p-6 border-b border-sand">
          <h2 className="font-serif text-2xl text-bark">Сагс ({count})</h2>
          <button onClick={closeDrawer}><X size={20} /></button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag size={40} className="text-muted mb-4" />
            <p className="text-muted mb-6">Сагс хоосон байна</p>
            <Link href="/shop" onClick={closeDrawer} className="btn-primary">Дэлгүүр үзэх</Link>
            <Link href="/order-tracking" onClick={closeDrawer} className="text-xs text-muted hover:text-bark mt-4 underline">
              Өмнөх захиалга хайх
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3 pb-4 border-b border-sand/50">
                  <Link href={`/product/${product.id}`} onClick={closeDrawer} className="w-20 h-20 bg-sand flex-shrink-0 relative overflow-hidden">
                    <Image src={product.images[0] || PLACEHOLDER_IMAGE} alt={product.name} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-bark truncate">{product.name}</p>
                    <p className="text-xs text-muted mb-2">{product.categoryName}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-sand">
                        <button onClick={() => updateQty(product.id, qty - 1)} className="p-1.5 hover:bg-sand"><Minus size={12} /></button>
                        <span className="px-3 text-sm">{qty}</span>
                        <button onClick={() => updateQty(product.id, qty + 1)} disabled={qty >= product.inStock} className="p-1.5 hover:bg-sand disabled:opacity-30"><Plus size={12} /></button>
                      </div>
                      <p className="text-sm font-medium text-bark">{formatPrice(product.price * qty)}</p>
                    </div>
                  </div>
                  <button onClick={() => remove(product.id)} className="text-muted hover:text-accent p-1 self-start"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>

            <div className="border-t border-sand p-6 space-y-3">
              {shipping > 0 && (
                <div>
                  <p className="text-xs text-muted mb-1.5">Үнэгүй хүргэлтэнд <span className="text-bark font-medium">{formatPrice(FREE_SHIPPING_THRESHOLD - total)}</span> үлдлээ</p>
                  <div className="w-full bg-sand h-1 rounded-full overflow-hidden">
                    <div className="bg-accent h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100)}%` }} />
                  </div>
                </div>
              )}
              {shipping === 0 && <p className="text-xs text-accent font-medium">✓ Үнэгүй хүргэлт!</p>}
              <div className="flex justify-between text-sm"><span className="text-muted">Дэд дүн</span><span className="text-bark">{formatPrice(total)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted">Хүргэлт</span><span className="text-bark">{shipping === 0 ? "Үнэгүй" : formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-medium text-lg pt-3 border-t border-sand">
                <span className="text-bark">Нийт</span>
                <span className="text-bark">{formatPrice(total + shipping)}</span>
              </div>
              <Link href="/checkout" onClick={closeDrawer} className="btn-primary block text-center">Захиалга өгөх</Link>
              <Link href="/cart" onClick={closeDrawer} className="block text-center text-sm text-muted hover:text-bark">Сагсыг бүтэн харах</Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
