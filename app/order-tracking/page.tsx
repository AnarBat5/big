"use client";
import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/products";

type OrderResult = {
  id: string;
  status: string;
  created_at: string;
  customer_name: string;
  items: { product: { name: string; price: number; images: string[] }; qty: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  district: string;
  address: string;
};

const STATUS_STEPS = ["Хүлээгдэж буй", "Төлбөр хийгдсэн", "Хүргэгдэж буй", "Дууссан"];

const statusIcon = (s: string) => {
  if (s === "Дууссан")          return <CheckCircle size={20} className="text-accent" />;
  if (s === "Хүргэгдэж буй")   return <Truck size={20} className="text-amber-600" />;
  if (s === "Төлбөр хийгдсэн") return <Package size={20} className="text-green-600" />;
  if (s === "Цуцлагдсан")       return <XCircle size={20} className="text-red-600" />;
  return <Clock size={20} className="text-muted" />;
};

const statusColor = (s: string) =>
  s === "Дууссан"          ? "bg-accent/20 text-accent" :
  s === "Хүргэгдэж буй"   ? "bg-amber-100 text-amber-700" :
  s === "Төлбөр хийгдсэн" ? "bg-green-100 text-green-700" :
  s === "Цуцлагдсан"       ? "bg-red-100 text-red-700" :
                             "bg-sand text-muted";

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [phone,   setPhone]   = useState("");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<OrderResult | null>(null);
  const [error,   setError]   = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(
        `/api/orders/track?id=${encodeURIComponent(orderId.trim())}&phone=${encodeURIComponent(phone.trim())}`
      );
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Алдаа гарлаа"); return; }
      setResult(data);
    } catch {
      setError("Холболтын алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = result ? STATUS_STEPS.indexOf(result.status) : -1;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-3">Захиалгын байдал</p>
        <h1 className="font-serif text-5xl text-bark">Захиалга хайх</h1>
      </div>

      <form onSubmit={handleSearch} className="bg-cream border border-sand p-8 mb-8">
        <div className="space-y-4">
          <div>
            <label className="text-xs tracking-wider uppercase text-muted block mb-2">
              Захиалгын дугаар
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value.toUpperCase())}
              placeholder="BG12345"
              className="w-full border border-sand bg-cream px-4 py-3 focus:outline-none focus:border-bark text-bark"
            />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase text-muted block mb-2">
              Утасны дугаар
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="99XXXXXX"
              className="w-full border border-sand bg-cream px-4 py-3 focus:outline-none focus:border-bark text-bark"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
        >
          <Search size={16} />
          {loading ? "Хайж байна..." : "Захиалга хайх"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 text-sm mb-6">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-cream border border-sand p-8 space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Захиалга</p>
              <h2 className="font-serif text-3xl text-bark">#{result.id}</h2>
              <p className="text-sm text-muted mt-1">
                {new Date(result.created_at).toLocaleDateString("mn-MN", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 text-sm font-medium ${statusColor(result.status)}`}>
              {statusIcon(result.status)}
              {result.status}
            </div>
          </div>

          {/* Progress steps (hide for cancelled) */}
          {result.status !== "Цуцлагдсан" && (
            <div>
              <div className="flex items-center gap-0">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                        i <= stepIndex ? "bg-bark text-cream" : "bg-sand text-muted"
                      }`}>
                        {i < stepIndex ? "✓" : i + 1}
                      </div>
                      <p className={`text-[10px] mt-1 text-center max-w-[60px] leading-tight ${
                        i <= stepIndex ? "text-bark" : "text-muted"
                      }`}>{step}</p>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mb-5 transition-colors ${
                        i < stepIndex ? "bg-bark" : "bg-sand"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery info */}
          <div className="border-t border-sand pt-6">
            <h3 className="font-serif text-lg text-bark mb-3">Хүргэлтийн хаяг</h3>
            <p className="text-bark text-sm">{result.district} дүүрэг</p>
            <p className="text-muted text-sm">{result.address}</p>
          </div>

          {/* Items */}
          <div className="border-t border-sand pt-6">
            <h3 className="font-serif text-lg text-bark mb-4">Бүтээгдэхүүн</h3>
            <div className="space-y-3">
              {result.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-bark">
                    {item.product?.name ?? "—"} × {item.qty}
                  </span>
                  <span className="text-muted">
                    {formatPrice((item.product?.price ?? 0) * item.qty)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-sand pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Дэд дүн</span>
              <span className="text-bark">{formatPrice(result.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Хүргэлт</span>
              <span className="text-bark">{result.shipping === 0 ? "Үнэгүй" : formatPrice(result.shipping)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-2 border-t border-sand">
              <span className="text-bark">Нийт</span>
              <span className="text-bark">{formatPrice(result.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
