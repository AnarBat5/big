import Link from "next/link";
import { Product, formatPrice } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="aspect-[4/5] bg-sand overflow-hidden mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
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
