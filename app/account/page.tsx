import { createClient } from "@/lib/supabase/server";
import { Package, MapPin, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;

  const [{ data: orders }, { data: addrs }, { data: wish }] = await Promise.all([
    sb.from("orders").select("id,created_at,status,total").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
    sb.from("addresses").select("id").eq("user_id", user.id),
    sb.from("wishlist_items").select("product_id").eq("user_id", user.id),
  ]);

  const stats = [
    { label: "Захиалга",  value: orders?.length ?? 0, icon: Package, href: "/account/orders" },
    { label: "Хаяг",      value: addrs?.length ?? 0,  icon: MapPin,  href: "/account/addresses" },
    { label: "Хадгалсан", value: wish?.length ?? 0,   icon: Heart,   href: "/account/wishlist" },
  ];

  return (
    <div className="space-y-12">
      <div className="grid sm:grid-cols-3 gap-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="surface bg-cream/40 p-6 group hover:bg-cream transition">
            <s.icon size={18} className="text-accent mb-4" />
            <p className="text-[10px] tracking-widest uppercase text-muted mb-1">{s.label}</p>
            <p className="font-serif text-3xl text-bark">{s.value}</p>
            <span className="block h-px w-6 bg-accent mt-4 transition-all duration-500 group-hover:w-12" />
          </Link>
        ))}
      </div>

      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-serif text-3xl text-bark">Сүүлийн захиалгууд</h2>
          <Link href="/account/orders" className="text-xs tracking-widest uppercase text-bark/70 hover:text-accent inline-flex items-center gap-2 group">
            Бүгд <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        {!orders || orders.length === 0 ? (
          <div className="surface bg-cream/40 p-12 text-center">
            <p className="text-muted mb-6">Захиалга байхгүй байна.</p>
            <Link href="/shop" className="btn-primary inline-block">Дэлгүүр үзэх</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => (
              <Link key={o.id} href={`/account/orders`} className="surface bg-cream/40 p-5 flex items-center justify-between hover:bg-cream transition">
                <div>
                  <p className="font-serif text-xl text-bark">#{o.id}</p>
                  <p className="text-xs text-muted mt-1">{new Date(o.created_at).toLocaleDateString("mn-MN")}</p>
                </div>
                <div className="text-right">
                  <p className="text-bark">{formatPrice(o.total)}</p>
                  <p className="text-[10px] tracking-widest uppercase text-accent mt-1">{o.status}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
