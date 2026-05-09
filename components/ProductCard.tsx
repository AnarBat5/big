"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Product, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/store/cart";
import { useToast } from "@/lib/store/toast";
import { PLACEHOLDER_IMAGE } from "@/lib/config";

export default function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.openDrawer);
  const showToast = useToast((s) => s.show);
  const outOfStock = product.inStock === 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    add(product, 1);
    showToast(`${product.name} сагсанд нэмэгдлээ`);
    openDrawer();
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="aspect-[4/5] bg-sand overflow-hidden mb-4 relative">
        <Image
          src={product.images[0] || PLACEHOLDER_IMAGE}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition duration-700"
        />
        {outOfStock && (
          <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center">
            <span className="bg-cream text-bark px-4 py-2 text-xs tracking-wider uppercase">
              Дууссан
            </span>
          </div>
        )}
        {!outOfStock && product.inStock <= 3 && (
          <span className="absolute top-3 left-3 bg-accent text-cream text-[10px] px-2 py-1 tracking-wider uppercase">
            Цөөн үлдсэн
          </span>
        )}
        {!outOfStock && (
          <button
            onClick={handleAdd}
            className="absolute bottom-3 right-3 bg-bark text-cream p-3 opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-accent"
            aria-label="Сагсанд нэмэх"
          >
            <ShoppingBag size={16} />
          </button>
        )}
      </div>
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-xs text-muted tracking-wider uppercase mb-1">{product.categoryName}</p>
          <h3 className="font-serif text-xl text-bark group-hover:text-accent transition">
            {product.name}
          </h3>
        </div>
        <p className="text-bark font-medium whitespace-nowrap">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
