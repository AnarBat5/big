import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getProducts } from "@/lib/server/products";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;

  const { data: rows } = await sb.from("wishlist_items").select("product_id").eq("user_id", user.id);
  const ids = new Set((rows ?? []).map((r) => r.product_id));
  const products = await getProducts();
  const wished = products.filter((p) => ids.has(p.id));

  return (
    <div>
      <h2 className="font-serif text-3xl text-bark mb-8">Хадгалсан бүтээгдэхүүн</h2>

      {wished.length === 0 ? (
        <div className="surface bg-cream/40 p-12 text-center">
          <Heart size={32} className="mx-auto text-muted mb-4" />
          <p className="text-muted mb-6">Хадгалсан бүтээгдэхүүн алга байна.</p>
          <Link href="/shop" className="btn-primary inline-block">Дэлгүүр үзэх</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {wished.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
