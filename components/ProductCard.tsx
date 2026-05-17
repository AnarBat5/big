"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { Product, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/store/cart";
import { useToast } from "@/lib/store/toast";
import { useWishlist } from "@/lib/store/wishlist";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PLACEHOLDER_IMAGE } from "@/lib/config";

export default function ProductCard({ product }: { product: Product }) {
  const [hover, setHover] = useState(false);
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.openDrawer);
  const showToast = useToast((s) => s.show);

  const wishHas = useWishlist((s) => s.has(product.id));
  const wishLoad = useWishlist((s) => s.load);
  const wishToggle = useWishlist((s) => s.toggle);

  useEffect(() => { wishLoad(); }, [wishLoad]);

  const outOfStock = product.inStock === 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (outOfStock) return;
    setAdding(true);
    add(product, 1);
    showToast(`${product.name} сагсанд нэмэгдлээ`);
    setTimeout(() => { setAdding(false); openDrawer(); }, 400);
  };

  const handleHeart = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const r = await wishToggle(product.id);
    if (r === null) {
      showToast("Хадгалахын тулд нэвтэрнэ үү", "info");
      router.push("/login?next=/shop");
      return;
    }
    showToast(r.added ? "Хадгалсан жагсаалтад нэмэгдлээ" : "Хадгалсан жагсаалтаас хасагдлаа");
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="card overflow-hidden"
        style={{ boxShadow: hover ? "0 20px 40px rgba(45,36,36,0.15)" : "0 4px 12px rgba(45,36,36,0.08)" }}
      >
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-sand to-cream">
          <Image
            src={product.images[0] || PLACEHOLDER_IMAGE}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`object-cover transition-transform duration-700 ${hover ? "scale-110" : "scale-100"}`}
          />

          {outOfStock && (
            <div className="absolute inset-0 bg-bark/50 backdrop-blur-sm flex items-center justify-center z-10">
              <span className="px-4 py-2 bg-white/95 rounded-full text-bark font-medium text-sm">Дууссан</span>
            </div>
          )}

          {/* Heart button — always visible top-right */}
          <button
            onClick={handleHeart}
            aria-label={wishHas ? "Хадгалсан" : "Хадгалах"}
            className={`absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-card z-20 hover:scale-110 active:scale-95 transition-transform`}
          >
            <Heart size={18} className={`transition-all ${wishHas ? "fill-accent text-accent scale-110" : "text-bark"}`} />
          </button>

          {/* Hover overlay with action buttons */}
          {hover && !outOfStock && (
            <div className="absolute inset-0 bg-bark/75 backdrop-blur-sm flex items-center justify-center gap-4 z-10 animate-fade-in">
              <span
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/product/${product.id}`); }}
                className="p-3.5 bg-cream rounded-full shadow-card hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                aria-label="Үзэх"
              >
                <Eye size={22} className="text-bark" />
              </span>
              <button
                onClick={handleAdd}
                disabled={adding}
                aria-label="Сагсанд нэмэх"
                className="p-3.5 bg-accent rounded-full shadow-card hover:scale-110 active:scale-95 transition-transform"
              >
                {adding ? (
                  <span className="block w-[22px] h-[22px] border-2 border-bark border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ShoppingCart size={22} className="text-bark" />
                )}
              </button>
            </div>
          )}
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 flex-1 min-w-0">
              <p className="text-xs text-bark/60 uppercase tracking-wider">{product.categoryName}</p>
              <h3 className="font-bold text-bark line-clamp-2">{product.name}</h3>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-accent">{formatPrice(product.price)}</p>
            {!outOfStock && (
              <span className="text-xs px-3 py-1 bg-sand text-bark rounded-full">Нөөцтэй</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
