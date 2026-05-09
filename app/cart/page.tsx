"use client";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart, cartTotal } from "@/lib/store/cart";
import { formatPrice } from "@/lib/products";
import { calculateShipping, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { PLACEHOLDER_IMAGE } from "@/lib/config";

export default function CartPage() {
  const { items, remove, updateQty } = useCart();
  const total = cartTotal(items);

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

  const shipping = calculateShipping(total);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="font-serif text-5xl text-bark mb-12">Таны сагс</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="flex gap-6 pb-6 border-b border-sand">
              <Link href={`/product/${product.id}`} className="w-32 h-32 bg-sand flex-shrink-0 relative overflow-hidden">
                <Image src={product.images[0] || PLACEHOLDER_IMAGE} alt={product.name} fill sizes="128px" className="object-cover" />
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
                    <button
                      onClick={() => updateQty(product.id, qty + 1)}
                      disabled={qty >= product.inStock}
                      className="p-2 hover:bg-sand disabled:opacity-30"
                    >
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
          {shipping > 0 && (
            <div className="mb-5">
              <p className="text-xs text-muted mb-2">
                Үнэгүй хүргэлтэнд <span className="text-bark font-medium">{formatPrice(FREE_SHIPPING_THRESHOLD - total)}</span> үлдлээ
              </p>
              <div className="w-full bg-sand h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-accent h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
          )}
          {shipping === 0 && (
            <p className="text-xs text-accent mb-4 font-medium">✓ Та үнэгүй хүргэлт авах эрхтэй!</p>
          )}
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
            Дэлгүүрээр үргэлжүүлэх
          </Link>
        </div>
      </div>
    </div>
  );
}
