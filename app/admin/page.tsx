"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Package, ShoppingCart, TrendingUp, Users,
  Plus, Edit2, Trash2, X, RotateCcw, LogOut, RefreshCw,
} from "lucide-react";
import { categories, formatPrice, Product } from "@/lib/products";
import { useProducts } from "@/lib/store/products";
import { useToast } from "@/lib/store/toast";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type DBOrder = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  district: string;
  address: string;
  note: string;
  payment_method: string;
  items: { product: { id: string; name: string; price: number; images: string[] }; qty: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  qpay_invoice_id: string | null;
  created_at: string;
};

const STATUSES = ["Хүлээгдэж буй", "Төлбөр хийгдсэн", "Хүргэгдэж буй", "Дууссан", "Цуцлагдсан"];

const statusColor = (s: string) =>
  s === "Дууссан"          ? "bg-accent/20 text-accent" :
  s === "Хүргэгдэж буй"   ? "bg-amber-100 text-amber-700" :
  s === "Төлбөр хийгдсэн" ? "bg-green-100 text-green-700" :
  s === "Цуцлагдсан"       ? "bg-red-100 text-red-700" :
                             "bg-sand text-muted";

export default function AdminPage() {
  const [tab, setTab]           = useState<"dash" | "products" | "orders">("dash");
  const [orders, setOrders]     = useState<DBOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [editing, setEditing]   = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewOrder, setViewOrder] = useState<DBOrder | null>(null);

  const products    = useProducts((s) => s.products);
  const fetchProds  = useProducts((s) => s.fetchProducts);
  const addProduct  = useProducts((s) => s.add);
  const updateProduct = useProducts((s) => s.update);
  const removeProduct = useProducts((s) => s.remove);
  const resetProducts = useProducts((s) => s.reset);
  const showToast   = useToast((s) => s.show);
  const router      = useRouter();

  useEffect(() => { fetchProds(); }, [fetchProds]);

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) setOrders(await res.json());
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const handleSave = async (p: Product) => {
    try {
      if (editing) {
        await updateProduct(p.id, p);
        showToast("Бүтээгдэхүүн шинэчлэгдлээ");
      } else {
        const { id, ...rest } = p;
        await addProduct(rest);
        showToast("Шинэ бүтээгдэхүүн нэмэгдлээ");
      }
      setShowForm(false);
      setEditing(null);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Хадгалахад алдаа гарлаа", "error");
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`"${name}"-г устгах уу?`)) return;
    try {
      await removeProduct(id);
      showToast("Бүтээгдэхүүн устгагдлаа");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Устгахад алдаа гарлаа", "error");
    }
  };

  const handleOrderStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      showToast("Төлөв шинэчлэгдлээ");
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm(`#${id} захиалгыг устгах уу?`)) return;
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      showToast("Устгагдлаа");
    }
  };

  const totalRevenue = orders
    .filter((o) => o.status === "Дууссан")
    .reduce((s, o) => s + o.total, 0);

  const stats = [
    { icon: TrendingUp, label: "Нийт орлого", value: formatPrice(totalRevenue), color: "text-accent" },
    { icon: ShoppingCart, label: "Захиалга",   value: orders.length.toString(),  color: "text-bark" },
    { icon: Package,     label: "Бүтээгдэхүүн", value: products.length.toString(), color: "text-bark" },
    { icon: Users,       label: "Үйлчлүүлэгч",
      value: new Set(orders.map((o) => o.customer_email)).size.toString(), color: "text-bark" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-1">Админ</p>
          <h1 className="font-serif text-4xl text-bark">Хяналтын самбар</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted hover:text-bark transition">
          <LogOut size={16} /> Гарах
        </button>
      </div>

      <div className="flex gap-2 mb-8 border-b border-sand">
        {[
          { id: "dash",     label: "Тойм" },
          { id: "products", label: "Бүтээгдэхүүн" },
          { id: "orders",   label: `Захиалга (${orders.length})` },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as "dash" | "products" | "orders")}
            className={`px-6 py-3 text-sm transition border-b-2 ${
              tab === t.id ? "border-bark text-bark" : "border-transparent text-muted hover:text-bark"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dash" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-cream border border-sand p-6">
                <Icon size={20} className={`${color} mb-3`} />
                <p className="text-sm text-muted mb-1">{label}</p>
                <p className="font-serif text-2xl text-bark">{value}</p>
              </div>
            ))}
          </div>
          <div className="bg-cream border border-sand p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl text-bark">Сүүлийн захиалгууд</h2>
              <button onClick={loadOrders} className="text-muted hover:text-bark"><RefreshCw size={16} /></button>
            </div>
            {ordersLoading ? (
              <p className="text-muted py-8 text-center">Ачааллаж байна...</p>
            ) : orders.length === 0 ? (
              <p className="text-muted py-8 text-center">Захиалга алга.</p>
            ) : (
              <table className="w-full text-sm">
                <thead><tr className="text-left text-muted border-b border-sand">
                  <th className="pb-3">Дугаар</th><th className="pb-3">Үйлчлүүлэгч</th>
                  <th className="pb-3">Дүн</th><th className="pb-3">Төлөв</th>
                </tr></thead>
                <tbody>
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="border-b border-sand/50">
                      <td className="py-3 text-bark">#{o.id}</td>
                      <td className="py-3 text-bark">{o.customer_name}</td>
                      <td className="py-3 text-bark">{formatPrice(o.total)}</td>
                      <td className="py-3"><span className={`px-2 py-1 text-xs ${statusColor(o.status)}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tab === "products" && (
        <div>
          <div className="flex justify-between mb-6">
            <p className="text-muted text-sm">{products.length} бүтээгдэхүүн</p>
            <div className="flex gap-2">
              <button onClick={async () => {
                if (!confirm("Анхны бүтээгдэхүүнүүдийг Supabase-д seed хийх үү?")) return;
                await resetProducts();
                showToast("Seed амжилттай");
              }} className="border border-sand text-bark px-3 py-2 text-xs hover:bg-sand inline-flex items-center gap-2">
                <RotateCcw size={12} /> Seed / Сэргээх
              </button>
              <button onClick={() => { setEditing(null); setShowForm(true); }}
                className="btn-primary inline-flex items-center gap-2 !py-2 !px-4 text-xs">
                <Plus size={14} /> Шинэ нэмэх
              </button>
            </div>
          </div>
          <div className="bg-cream border border-sand overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-sand/30">
                <tr className="text-left text-muted">
                  <th className="p-4">Зураг</th><th className="p-4">Нэр</th><th className="p-4">Ангилал</th>
                  <th className="p-4">Үнэ</th><th className="p-4">Үлдэгдэл</th><th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-sand">
                    <td className="p-4"><div className="w-12 h-12 bg-sand">
                      {p.images[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                    </div></td>
                    <td className="p-4 text-bark">{p.name}</td>
                    <td className="p-4 text-muted">{p.categoryName}</td>
                    <td className="p-4 text-bark">{formatPrice(p.price)}</td>
                    <td className="p-4">
                      <span className={p.inStock === 0 ? "text-red-700" : p.inStock <= 3 ? "text-accent" : "text-bark"}>
                        {p.inStock}
                      </span>
                    </td>
                    <td className="p-4"><div className="flex gap-2">
                      <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-2 hover:bg-sand"><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteProduct(p.id, p.name)} className="p-2 hover:bg-sand text-accent"><Trash2 size={14} /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showForm && <ProductForm product={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
        </div>
      )}

      {tab === "orders" && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={loadOrders} className="flex items-center gap-2 text-sm text-muted hover:text-bark">
              <RefreshCw size={14} /> Шинэчлэх
            </button>
          </div>
          <div className="bg-cream border border-sand overflow-x-auto">
            {ordersLoading ? (
              <p className="text-muted text-center py-16">Ачааллаж байна...</p>
            ) : orders.length === 0 ? (
              <p className="text-muted text-center py-16">Захиалга алга байна.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-sand/30">
                  <tr className="text-left text-muted">
                    <th className="p-4">Дугаар</th><th className="p-4">Үйлчлүүлэгч</th>
                    <th className="p-4">Огноо</th><th className="p-4">Дүн</th><th className="p-4">Төлөв</th><th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t border-sand">
                      <td className="p-4 text-bark">#{o.id}</td>
                      <td className="p-4 text-bark"><div>{o.customer_name}</div><div className="text-xs text-muted">{o.customer_phone}</div></td>
                      <td className="p-4 text-muted">{new Date(o.created_at).toLocaleDateString("mn-MN")}</td>
                      <td className="p-4 text-bark">{formatPrice(o.total)}</td>
                      <td className="p-4">
                        <select value={o.status} onChange={(e) => handleOrderStatus(o.id, e.target.value)}
                          className={`px-2 py-1 text-xs border-0 rounded ${statusColor(o.status)}`}>
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="p-4"><div className="flex gap-2">
                        <button onClick={() => setViewOrder(o)} className="p-2 hover:bg-sand text-xs text-bark">Харах</button>
                        <button onClick={() => handleDeleteOrder(o.id)} className="p-2 hover:bg-sand text-accent"><Trash2 size={14} /></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {viewOrder && <OrderModal order={viewOrder} onClose={() => setViewOrder(null)} />}
    </div>
  );
}

function ProductForm({ product, onSave, onClose }: { product: Product | null; onSave: (p: Product) => void; onClose: () => void }) {
  const [form, setForm] = useState<Product>(product ?? {
    id: "", name: "", category: "buidan", categoryName: "Буйдан",
    price: 0, images: [""], description: "", material: "", dimensions: "", inStock: 1,
  });
  const [uploading, setUploading] = useState(false);
  const cls = "w-full border border-sand bg-cream px-3 py-2 focus:outline-none focus:border-bark text-bark text-sm";
  const updateImg = (i: number, v: string) => { const imgs = [...form.images]; imgs[i] = v; setForm({ ...form, images: imgs }); };
  const uploadImg = async (i: number, file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    setUploading(false);
    if (json.url) updateImg(i, json.url);
    else alert(json.error ?? "Upload амжилтгүй");
  };
  return (
    <div className="fixed inset-0 bg-charcoal/60 flex items-center justify-center p-6 z-50">
      <div className="bg-cream max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl text-bark">{product ? "Засах" : "Шинэ бүтээгдэхүүн"}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <input placeholder="Нэр *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={cls} />
          <select value={form.category} onChange={(e) => { const cat = categories.find((c) => c.id === e.target.value)!; setForm({ ...form, category: cat.id as Product["category"], categoryName: cat.name }); }} className={cls}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="number" placeholder="Үнэ ₮ *" value={form.price || ""} onChange={(e) => setForm({ ...form, price: +e.target.value })} className={cls} />
          <div>
            <p className="text-xs text-muted mb-2">Зургийн URL-үүд</p>
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input placeholder="https://..." value={img} onChange={(e) => updateImg(i, e.target.value)} className={cls} />
                <label className="cursor-pointer px-2 py-1 border border-sand hover:bg-sand text-xs text-bark whitespace-nowrap">
                  {uploading ? "..." : "Upload"}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImg(i, f); e.target.value = ""; }} />
                </label>
                {form.images.length > 1 && <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })} className="text-accent px-2"><X size={14} /></button>}
              </div>
            ))}
            <button type="button" onClick={() => setForm({ ...form, images: [...form.images, ""] })} className="text-xs text-accent hover:underline">+ Зураг нэмэх</button>
          </div>
          <textarea placeholder="Тайлбар" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${cls} h-20`} />
          <input placeholder="Материал" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className={cls} />
          <input placeholder="Хэмжээ (Ж: 200 × 90 × 75 см)" value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} className={cls} />
          <input type="number" placeholder="Үлдэгдэл" value={form.inStock} onChange={(e) => setForm({ ...form, inStock: +e.target.value })} className={cls} />
          <label className="flex items-center gap-2 text-sm text-bark">
            <input type="checkbox" checked={form.featured ?? false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Онцлох бүтээгдэхүүн
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-outline flex-1">Болих</button>
          <button onClick={() => { if (!form.name || !form.price || !form.images[0]) { alert("Нэр, үнэ, зураг оруулна уу."); return; } onSave(form); }} className="btn-primary flex-1">Хадгалах</button>
        </div>
      </div>
    </div>
  );
}

function OrderModal({ order, onClose }: { order: DBOrder; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-charcoal/60 flex items-center justify-center p-6 z-50" onClick={onClose}>
      <div className="bg-cream max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between mb-6">
          <div><p className="text-xs text-muted uppercase tracking-wider">Захиалга</p><h2 className="font-serif text-3xl text-bark">#{order.id}</h2></div>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
          <div><h3 className="font-serif text-lg text-bark mb-2">Үйлчлүүлэгч</h3>
            <p className="text-bark">{order.customer_name}</p><p className="text-muted">{order.customer_phone}</p><p className="text-muted">{order.customer_email}</p>
          </div>
          <div><h3 className="font-serif text-lg text-bark mb-2">Хүргэлт</h3>
            <p className="text-bark">{order.district} дүүрэг</p><p className="text-muted">{order.address}</p>
            {order.note && <p className="text-muted text-xs mt-1">Тайлбар: {order.note}</p>}
          </div>
        </div>
        <p className="text-sm text-muted mb-4">Төлбөр: <strong className="text-bark">{order.payment_method === "qpay" ? "QPay" : "Бэлэн мөнгө"}</strong></p>
        <h3 className="font-serif text-lg text-bark mb-3">Бүтээгдэхүүн</h3>
        <div className="space-y-3 mb-6">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-3 text-sm border-b border-sand pb-3">
              <div className="w-12 h-12 bg-sand flex-shrink-0">
                {item.product?.images?.[0] && <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1"><p className="text-bark">{item.product?.name ?? "—"}</p><p className="text-muted text-xs">{item.qty} × {formatPrice(item.product?.price ?? 0)}</p></div>
              <p className="text-bark">{formatPrice((item.product?.price ?? 0) * item.qty)}</p>
            </div>
          ))}
        </div>
        <div className="space-y-1 text-sm border-t border-sand pt-4">
          <div className="flex justify-between"><span className="text-muted">Дэд дүн</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted">Хүргэлт</span><span>{order.shipping === 0 ? "Үнэгүй" : formatPrice(order.shipping)}</span></div>
          <div className="flex justify-between font-medium text-lg pt-2 border-t border-sand mt-2">
            <span className="text-bark">Нийт</span><span className="text-bark">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
