import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatPrice } from "@/lib/products";

export const dynamic = "force-dynamic";

const statusClr = (s: string) =>
  s === "Дууссан"          ? "bg-accent/15 text-accent" :
  s === "Хүргэгдэж буй"    ? "bg-amber-100 text-amber-700" :
  s === "Төлбөр хийгдсэн"  ? "bg-green-100 text-green-700" :
  s === "Цуцлагдсан"        ? "bg-red-100 text-red-700" :
                              "bg-sand text-muted";

type Item = { product?: { name?: string; price?: number; images?: string[] }; qty: number };
type Order = {
  id: string; status: string; created_at: string; total: number; items: Item[];
};

export default async function AccountOrdersPage() {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from("orders")
    .select("id,status,created_at,total,items")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as Order[];

  return (
    <div>
      <h2 className="font-serif text-3xl text-bark mb-8">Бүх захиалга</h2>

      {orders.length === 0 ? (
        <div className="surface bg-cream/40 p-12 text-center">
          <p className="text-muted mb-6">Захиалга байхгүй байна.</p>
          <Link href="/shop" className="btn-primary inline-block">Дэлгүүр үзэх</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <details key={o.id} className="surface bg-cream/40 group">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <div>
                  <p className="font-serif text-xl text-bark">#{o.id}</p>
                  <p className="text-xs text-muted mt-1">
                    {new Date(o.created_at).toLocaleDateString("mn-MN", { year: "numeric", month: "long", day: "numeric" })}
                    {" · "}{o.items?.length ?? 0} бүтээгдэхүүн
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-bark font-medium">{formatPrice(o.total)}</p>
                  <span className={`inline-block px-2 py-1 text-[10px] tracking-widest uppercase mt-1 ${statusClr(o.status)}`}>{o.status}</span>
                </div>
              </summary>
              <div className="px-5 pb-5 border-t border-sand">
                <div className="space-y-3 pt-4">
                  {(o.items ?? []).map((it: Item, i: number) => (
                    <div key={i} className="flex items-center gap-4 text-sm">
                      <div className="w-14 h-14 bg-sand flex-shrink-0">
                        {it.product?.images?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={it.product.images[0]} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-bark">{it.product?.name ?? "—"}</p>
                        <p className="text-xs text-muted">{it.qty} × {formatPrice(it.product?.price ?? 0)}</p>
                      </div>
                      <p className="text-bark text-sm">{formatPrice((it.product?.price ?? 0) * it.qty)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
