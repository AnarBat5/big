"use client";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const { items, remove, updateQty, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <ShoppingBag size={48} className="mx-auto mb-6 text-muted" />
        <h1 className="font-serif text-4xl text-bark mb-4">Сагс хоосон байна</h1>
        <p className="text-muted mb-8">Хүссэн бүтээгдэхүүнээ сонгож сагсандаа нэмнэ үү.</p>
        <Link href="/shop" className="btn-primary inline-block">Дэлгүүр үзэх</Link>
      </div>
    );
  }

  const shipping = total > 5000000 ? 0 : 50000;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="font-serif text-5xl text-bark mb-12">Таны сагс</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="flex gap-6 pb-6 border-b border-sand">
              <Link href={`/product/${product.id}`} className="w-32 h-32 bg-sand flex-shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">{product.categoryName}</p>
                <Link href={`/product/${product.id}`} className="font-serif text-xl text-bark hover:text-accent">
                  {product.name}
                </Link>
                <p className="text-sm text-muted mt-1">{product.material}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-sand">
                    <button onClick={() => updateQty(product.id, qty - 1)} className="p-2 hover:bg-sand">
                      <Minus size={12} />
                    </button>
                    <span className="px-4 text-sm">{qty}</span>
                    <button onClick={() => updateQty(product.id, qty + 1)} className="p-2 hover:bg-sand">
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="font-medium text-bark">{formatPrice(product.price * qty)}</p>
                </div>
              </div>
              <button onClick={() => remove(product.id)} className="self-start p-2 text-muted hover:text-accent">
                <X size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-sand/40 p-8 h-fit">
          <h2 className="font-serif text-2xl text-bark mb-6">Захиалгын дүн</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Дэд дүн</span>
              <span className="text-bark">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Хүргэлт</span>
              <span className="text-bark">{shipping === 0 ? "Үнэгүй" : formatPrice(shipping)}</span>
            </div>
            <div className="border-t border-sand pt-3 flex justify-between font-medium text-lg">
              <span className="text-bark">Нийт</span>
              <span className="text-bark">{formatPrice(total + shipping)}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn-primary block text-center mt-6">
            Захиалга өгөх
          </Link>
          <Link href="/shop" className="block text-center text-sm text-muted mt-4 hover:text-bark">
            Дэлгүүрлэлт үргэлжлүүлэх
          </Link>
        </div>
      </div>
    </div>
  );
}
