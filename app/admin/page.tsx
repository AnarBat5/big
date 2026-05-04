"use client";
import { useState } from "react";
import { Package, ShoppingCart, TrendingUp, Users, Plus, Edit2, Trash2, X, Lock } from "lucide-react";
import { products as initialProducts, categories, formatPrice, Product } from "@/lib/products";

type Order = {
  id: string;
  customer: string;
  total: number;
  status: "Хүлээгдэж буй" | "Хүргэгдэж буй" | "Дууссан";
  date: string;
};

const mockOrders: Order[] = [
  { id: "BG10234", customer: "Болд Б.", total: 2850000, status: "Хүлээгдэж буй", date: "2026-05-03" },
  { id: "BG10235", customer: "Сараа Д.", total: 1450000, status: "Хүргэгдэж буй", date: "2026-05-02" },
  { id: "BG10236", customer: "Энхбат Э.", total: 4200000, status: "Дууссан", date: "2026-05-01" },
  { id: "BG10237", customer: "Цэцэг Ц.", total: 980000, status: "Хүргэгдэж буй", date: "2026-04-30" },
  { id: "BG10238", customer: "Ганаа Г.", total: 3450000, status: "Дууссан", date: "2026-04-29" },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [tab, setTab] = useState<"dash" | "products" | "orders">("dash");
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="bg-cream border border-sand p-10 max-w-md w-full">
          <Lock size={32} className="text-bark mb-4" />
          <h1 className="font-serif text-3xl text-bark mb-2">Админ нэвтрэх</h1>
          <p className="text-sm text-muted mb-6">Нууц үг: <code className="bg-sand px-2">admin123</code></p>
          <input
            type="password"
            placeholder="Нууц үг"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && pwd === "admin123" && setAuthed(true)}
            className="w-full border border-sand bg-cream px-4 py-3 mb-4 focus:outline-none focus:border-bark"
          />
          <button
            onClick={() => pwd === "admin123" && setAuthed(true)}
            className="btn-primary w-full"
          >
            Нэвтрэх
          </button>
        </div>
      </div>
    );
  }

  const totalRevenue = mockOrders.reduce((s, o) => s + o.total, 0);
  const stats = [
    { icon: TrendingUp, label: "Нийт орлого", value: formatPrice(totalRevenue), color: "text-accent" },
    { icon: ShoppingCart, label: "Захиалга", value: mockOrders.length.toString(), color: "text-bark" },
    { icon: Package, label: "Бүтээгдэхүүн", value: products.length.toString(), color: "text-bark" },
    { icon: Users, label: "Үйлчлүүлэгч", value: "1,247", color: "text-bark" },
  ];

  const deleteProduct = (id: string) => {
    if (confirm("Энэ бүтээгдэхүүнийг устгах уу?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const saveProduct = (p: Product) => {
    if (products.find((x) => x.id === p.id)) {
      setProducts(products.map((x) => (x.id === p.id ? p : x)));
    } else {
      setProducts([...products, { ...p, id: Date.now().toString() }]);
    }
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-1">Админ</p>
          <h1 className="font-serif text-4xl text-bark">Хяналтын самбар</h1>
        </div>
        <button onClick={() => setAuthed(false)} className="text-sm text-muted hover:text-bark">
          Гарах
        </button>
      </div>

      <div className="flex gap-2 mb-8 border-b border-sand">
        {[
          { id: "dash", label: "Тойм" },
          { id: "products", label: "Бүтээгдэхүүн" },
          { id: "orders", label: "Захиалга" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-6 py-3 text-sm transition border-b-2 ${
              tab === t.id ? "border-bark text-bark" : "border-transparent text-muted hover:text-bark"
            }`}
          >
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
            <h2 className="font-serif text-2xl text-bark mb-4">Сүүлийн захиалгууд</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-sand">
                  <th className="pb-3">Дугаар</th>
                  <th className="pb-3">Үйлчлүүлэгч</th>
                  <th className="pb-3">Дүн</th>
                  <th className="pb-3">Төлөв</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-b border-sand/50">
                    <td className="py-3 text-bark">#{o.id}</td>
                    <td className="py-3 text-bark">{o.customer}</td>
                    <td className="py-3 text-bark">{formatPrice(o.total)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs ${
                        o.status === "Дууссан" ? "bg-accent/20 text-accent" :
                        o.status === "Хүргэгдэж буй" ? "bg-walnut/20 text-walnut" :
                        "bg-sand text-muted"
                      }`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "products" && (
        <div>
          <div className="flex justify-between mb-6">
            <p className="text-muted text-sm">{products.length} бүтээгдэхүүн</p>
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="btn-primary inline-flex items-center gap-2 !py-2 !px-4 text-xs"
            >
              <Plus size={14} /> Шинэ нэмэх
            </button>
          </div>

          <div className="bg-cream border border-sand">
            <table className="w-full text-sm">
              <thead className="bg-sand/30">
                <tr className="text-left text-muted">
                  <th className="p-4">Зураг</th>
                  <th className="p-4">Нэр</th>
                  <th className="p-4">Ангилал</th>
                  <th className="p-4">Үнэ</th>
                  <th className="p-4">Үлдэгдэл</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-sand">
                    <td className="p-4">
                      <div className="w-12 h-12 bg-sand">
                        <img src={p.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4 text-bark">{p.name}</td>
                    <td className="p-4 text-muted">{p.categoryName}</td>
                    <td className="p-4 text-bark">{formatPrice(p.price)}</td>
                    <td className="p-4 text-bark">{p.inStock}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-2 hover:bg-sand">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteProduct(p.id)} className="p-2 hover:bg-sand text-accent">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showForm && (
            <ProductForm
              product={editing}
              onSave={saveProduct}
              onClose={() => { setShowForm(false); setEditing(null); }}
            />
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="bg-cream border border-sand">
          <table className="w-full text-sm">
            <thead className="bg-sand/30">
              <tr className="text-left text-muted">
                <th className="p-4">Дугаар</th>
                <th className="p-4">Үйлчлүүлэгч</th>
                <th className="p-4">Огноо</th>
                <th className="p-4">Дүн</th>
                <th className="p-4">Төлөв</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((o) => (
                <tr key={o.id} className="border-t border-sand">
                  <td className="p-4 text-bark">#{o.id}</td>
                  <td className="p-4 text-bark">{o.customer}</td>
                  <td className="p-4 text-muted">{o.date}</td>
                  <td className="p-4 text-bark">{formatPrice(o.total)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs ${
                      o.status === "Дууссан" ? "bg-accent/20 text-accent" :
                      o.status === "Хүргэгдэж буй" ? "bg-walnut/20 text-walnut" :
                      "bg-sand text-muted"
                    }`}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProductForm({ product, onSave, onClose }: {
  product: Product | null;
  onSave: (p: Product) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Product>(product || {
    id: "", name: "", category: "buidan", categoryName: "Буйдан",
    price: 0, image: "", description: "", material: "", dimensions: "", inStock: 1,
  });

  const inputCls = "w-full border border-sand bg-cream px-3 py-2 focus:outline-none focus:border-bark text-bark text-sm";

  return (
    <div className="fixed inset-0 bg-charcoal/60 flex items-center justify-center p-6 z-50">
      <div className="bg-cream max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl text-bark">
            {product ? "Засах" : "Шинэ бүтээгдэхүүн"}
          </h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <input placeholder="Нэр" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
          <select value={form.category}
            onChange={(e) => {
              const cat = categories.find((c) => c.id === e.target.value)!;
              setForm({ ...form, category: cat.id as any, categoryName: cat.name });
            }} className={inputCls}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="number" placeholder="Үнэ" value={form.price || ""}
            onChange={(e) => setForm({ ...form, price: +e.target.value })} className={inputCls} />
          <input placeholder="Зургийн URL" value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputCls} />
          <textarea placeholder="Тайлбар" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} h-20`} />
          <input placeholder="Материал" value={form.material}
            onChange={(e) => setForm({ ...form, material: e.target.value })} className={inputCls} />
          <input placeholder="Хэмжээ" value={form.dimensions}
            onChange={(e) => setForm({ ...form, dimensions: e.target.value })} className={inputCls} />
          <input type="number" placeholder="Үлдэгдэл" value={form.inStock || ""}
            onChange={(e) => setForm({ ...form, inStock: +e.target.value })} className={inputCls} />
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-outline flex-1">Болих</button>
          <button onClick={() => onSave(form)} className="btn-primary flex-1">Хадгалах</button>
        </div>
      </div>
    </div>
  );
}
