"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, QrCode, Clock, RefreshCw, ArrowRight, MapPin } from "lucide-react";
import { useCart, cartTotal } from "@/lib/store/cart";
import { formatPrice } from "@/lib/products";
import { calculateShipping, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { QPAY_ENABLED, PLACEHOLDER_IMAGE } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

type Phase = "form" | "qpay" | "success";
type SavedAddress = { id: number; label: string; recipient: string; phone: string; district: string; detail: string; is_default: boolean };

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const total = cartTotal(items);
  const shipping = calculateShipping(total);

  const [phase, setPhase]       = useState<Phase>("form");
  const [orderId, setOrderId]   = useState<string | null>(null);
  const [qpayData, setQpayData] = useState<{ invoiceId: string; qrText: string; urls: { name: string; description: string; logo: string; link: string }[] } | null>(null);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(false);
  const [countdown, setCountdown] = useState(180);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState<number | null>(null);
  const [saveAddress, setSaveAddress] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "", district: "", note: "",
    payment: QPAY_ENABLED ? "qpay" : "cod",
  });

  // Prefill from logged-in user + saved addresses
  useEffect(() => {
    (async () => {
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;
      const [{ data: profile }, { data: addrs }] = await Promise.all([
        sb.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle(),
        sb.from("addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false }),
      ]);
      setForm((f) => ({
        ...f,
        name:  f.name  || profile?.full_name || "",
        email: f.email || user.email || "",
        phone: f.phone || profile?.phone || "",
      }));
      const list = (addrs ?? []) as SavedAddress[];
      setSavedAddresses(list);
      const def = list.find((a) => a.is_default) ?? list[0];
      if (def) {
        setSelectedAddrId(def.id);
        setForm((f) => ({
          ...f,
          name:     f.name     || def.recipient,
          phone:    f.phone    || def.phone,
          district: f.district || def.district,
          address:  f.address  || def.detail,
        }));
      }
    })();
  }, []);

  const inputCls = "w-full border bg-cream/60 px-4 py-3 focus:outline-none focus:border-bark transition text-bark";
  const errCls = (f: string) => errors[f] ? "border-red-500" : "border-sand";

  // Poll QPay
  useEffect(() => {
    if (phase !== "qpay" || !qpayData || !orderId) return;
    const check = async () => {
      try {
        const res = await fetch("/api/qpay/check", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invoiceId: qpayData.invoiceId, orderId }),
        });
        if (res.ok) {
          const { paid } = await res.json();
          if (paid) {
            if (pollRef.current) clearInterval(pollRef.current);
            clear();
            setPhase("success");
          }
        }
      } catch {}
    };
    pollRef.current = setInterval(check, 4000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [phase, qpayData, orderId, clear]);

  useEffect(() => {
    if (phase !== "qpay") return;
    if (countdown <= 0) { if (pollRef.current) clearInterval(pollRef.current); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Нэр оруулна уу";
    if (!/^\d{8}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "8 оронтой утас оруулна уу";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Зөв имэйл оруулна уу";
    if (!form.district) e.district = "Дүүрэг сонгоно уу";
    if (!form.address.trim()) e.address = "Хаяг оруулна уу";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (saveAddress) {
        await fetch("/api/addresses", {
          method: "POST", headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            recipient: form.name, phone: form.phone, district: form.district, detail: form.address,
            label: "Захиалгаас", is_default: savedAddresses.length === 0,
          }),
        }).catch(() => {});
      }

      const res = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customer: { name: form.name, phone: form.phone, email: form.email },
          address:  { district: form.district, detail: form.address, note: form.note },
          payment:  form.payment,
          items, subtotal: total, shipping, total: total + shipping,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrderId(data.orderId);
      if (form.payment === "qpay" && data.qpayInvoiceId && data.qpayQrText) {
        setQpayData({ invoiceId: data.qpayInvoiceId, qrText: data.qpayQrText, urls: data.qpayUrls ?? [] });
        setPhase("qpay");
      } else {
        clear();
        setPhase("success");
      }
    } catch {
      setErrors({ submit: "Алдаа гарлаа. Дахин оролдоно уу." });
    } finally { setLoading(false); }
  };

  // Success
  if (phase === "success") {
    return (
      <div className="max-w-xl mx-auto px-6 py-32 text-center relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #C9A45F 0%, transparent 70%)" }} />
        <div className="w-20 h-20 mx-auto mb-6 bg-accent/20 rounded-full flex items-center justify-center relative">
          <Check size={36} className="text-accent" />
        </div>
        <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-3 relative">Баярлалаа</p>
        <h1 className="font-serif text-5xl text-bark mb-4 relative">Захиалга <span className="italic text-accent">амжилттай</span></h1>
        <p className="text-muted mb-2 relative">Захиалгын дугаар: <span className="text-bark font-medium">#{orderId}</span></p>
        <p className="text-muted mb-10 relative">Манай ажилтан тантай удахгүй холбогдох болно.</p>
        <div className="flex gap-4 justify-center relative">
          <Link href="/account/orders" className="btn-outline">Захиалга харах</Link>
          <Link href="/shop" className="btn-primary">Дэлгүүр үргэлжлүүлэх</Link>
        </div>
      </div>
    );
  }

  // QPay screen
  if (phase === "qpay" && qpayData) {
    const mm = String(Math.floor(countdown / 60)).padStart(2, "0");
    const ss = String(countdown % 60).padStart(2, "0");
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center relative">
        <div aria-hidden className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #C9A45F 0%, transparent 70%)" }} />
        <div className="surface bg-cream/60 backdrop-blur-xs p-8 relative">
          <div className="flex items-center justify-center gap-2 text-muted mb-2">
            <QrCode size={18} /> <span className="text-[10px] tracking-widest uppercase">QPay QR код</span>
          </div>
          <p className="font-serif text-2xl text-bark mb-1">#{orderId}</p>
          <p className="text-muted text-sm mb-6">Нийт: <strong className="text-bark">{formatPrice(total + shipping)}</strong></p>

          <div className="flex justify-center mb-4">
            { /* eslint-disable-next-line @next/next/no-img-element */ }
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qpayData.qrText)}`}
              alt="QPay QR" className="w-56 h-56 border border-sand" />
          </div>

          <div className={`flex items-center justify-center gap-2 mb-4 ${countdown <= 30 ? "text-red-600" : "text-muted"}`}>
            <Clock size={14} /><span className="text-sm font-mono">{mm}:{ss}</span>
          </div>

          {countdown <= 0 ? (
            <p className="text-red-600 text-sm mb-4">Хугацаа дууссан. Дахин оролдоно уу.</p>
          ) : (
            <p className="text-muted text-sm mb-6">Дараах банкны аппыг нээж QR кодыг уншуулна уу.</p>
          )}

          {qpayData.urls.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-6">
              {qpayData.urls.slice(0, 6).map((u, i) => (
                <a key={i} href={u.link} target="_blank" rel="noopener noreferrer"
                  className="surface bg-cream/40 flex flex-col items-center gap-1 p-3 hover:bg-cream transition text-xs text-bark">
                  { /* eslint-disable-next-line @next/next/no-img-element */ }
                  {u.logo ? <img src={u.logo} alt={u.name} className="w-8 h-8 object-contain" /> : <div className="w-8 h-8 bg-sand rounded-full" />}
                  <span className="truncate w-full text-center">{u.name}</span>
                </a>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => { setPhase("form"); setQpayData(null); }} className="btn-outline flex-1">Буцах</button>
            <button
              onClick={async () => {
                const res = await fetch("/api/qpay/check", {
                  method: "POST", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ invoiceId: qpayData.invoiceId, orderId }),
                });
                if (res.ok) {
                  const { paid } = await res.json();
                  if (paid) { clear(); setPhase("success"); }
                  else alert("Төлбөр бүртгэгдсэнгүй. Дахин оролдоно уу.");
                }
              }}
              className="btn-primary flex-1 flex items-center justify-center gap-2">
              <RefreshCw size={14} /> Шалгах
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-32 text-center">
        <p className="text-muted mb-6">Сагсанд бүтээгдэхүүн алга.</p>
        <Link href="/shop" className="btn-primary inline-block">Дэлгүүр үзэх</Link>
      </div>
    );
  }

  // Form
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 relative">
      <div aria-hidden className="pointer-events-none absolute -top-20 left-0 h-[400px] w-[400px] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #C9A45F 0%, transparent 70%)" }} />

      <div className="mb-12 relative">
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-3">Захиалга</p>
        <h1 className="font-serif text-5xl md:text-6xl text-bark leading-[0.95]">
          <span className="italic text-accent">Баталгаажуул</span>
        </h1>
      </div>

      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_400px] gap-10 relative">
        <div className="space-y-8">

          {savedAddresses.length > 0 && (
            <section className="surface bg-cream/40 p-6">
              <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-4">Хадгалсан хаяг</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {savedAddresses.map((a) => (
                  <button
                    type="button"
                    key={a.id}
                    onClick={() => {
                      setSelectedAddrId(a.id);
                      setForm({ ...form, name: a.recipient, phone: a.phone, district: a.district, address: a.detail });
                    }}
                    className={`text-left p-4 border transition ${
                      selectedAddrId === a.id ? "border-accent bg-accent/5" : "border-sand bg-cream/60 hover:border-bark/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={12} className="text-accent" />
                      <p className="text-[10px] tracking-widest uppercase text-muted">{a.label || "Хаяг"}</p>
                    </div>
                    <p className="text-bark text-sm font-medium">{a.recipient}</p>
                    <p className="text-xs text-muted">{a.district}, {a.detail}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="surface bg-cream/40 p-6">
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-4">Хүргэлтийн мэдээлэл</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <input placeholder="Овог нэр" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${inputCls} ${errCls("name")}`} />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <input placeholder="Утас (8 оронтой)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={`${inputCls} ${errCls("phone")}`} />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <input type="email" placeholder="Имэйл" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`${inputCls} ${errCls("email")}`} />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>
              <div>
                <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className={`${inputCls} ${errCls("district")}`}>
                  <option value="">Дүүрэг сонгох</option>
                  <option>Сүхбаатар</option><option>Чингэлтэй</option><option>Баянзүрх</option>
                  <option>Баянгол</option><option>Сонгинохайрхан</option><option>Хан-Уул</option>
                </select>
                {errors.district && <p className="text-xs text-red-600 mt-1">{errors.district}</p>}
              </div>
              <div>
                <input placeholder="Дэлгэрэнгүй хаяг" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={`${inputCls} ${errCls("address")}`} />
                {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
              </div>
              <textarea placeholder="Нэмэлт тайлбар (заавал биш)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
                className={`${inputCls} border-sand sm:col-span-2 h-24`} />
              <label className="sm:col-span-2 flex items-center gap-2 text-sm text-bark/80 cursor-pointer">
                <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                Энэ хаягийг бүртгэлд хадгалах
              </label>
            </div>
          </section>

          <section className="surface bg-cream/40 p-6">
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-4">Төлбөрийн хэлбэр</p>
            <div className="space-y-2">
              {[
                ...(QPAY_ENABLED ? [{ id: "qpay", label: "QPay", desc: "Ухаалаг утасны QR кодоор" }] : []),
                { id: "bank", label: "Банкны шилжүүлэг", desc: "Дансны мэдээллийг имэйлд илгээнэ" },
                { id: "cod",  label: "Хүргэгдэх үед төлөх", desc: "Бэлэн мөнгөөр" },
              ].map((opt) => (
                <label key={opt.id} className={`flex items-center gap-3 border p-4 cursor-pointer transition ${
                  form.payment === opt.id ? "border-bark bg-cream" : "border-sand hover:border-bark/50"
                }`}>
                  <input type="radio" name="payment" value={opt.id} checked={form.payment === opt.id}
                    onChange={(e) => setForm({ ...form, payment: e.target.value })} />
                  <div>
                    <p className="text-bark text-sm">{opt.label}</p>
                    <p className="text-xs text-muted">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {errors.submit && <p className="text-red-600 bg-red-50 border border-red-200 px-4 py-3 text-sm">{errors.submit}</p>}
        </div>

        <aside className="lg:sticky lg:top-24 self-start">
          <div className="surface bg-cream/40 p-7">
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-3">Дүн</p>
            <h2 className="font-serif text-3xl text-bark mb-6">Захиалга</h2>

            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3 text-sm">
                  <div className="w-12 h-12 bg-sand flex-shrink-0 relative overflow-hidden">
                    <Image src={product.images[0] || PLACEHOLDER_IMAGE} alt="" fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-bark truncate">{product.name}</p>
                    <p className="text-muted text-xs">{qty} × {formatPrice(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-sand pt-4">
              <div className="flex justify-between"><span className="text-muted">Дэд дүн</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between">
                <span className="text-muted">Хүргэлт</span>
                <span>{shipping === 0 ? <span className="text-accent">Үнэгүй</span> : formatPrice(shipping)}</span>
              </div>
              {total < FREE_SHIPPING_THRESHOLD && (
                <p className="text-xs text-muted">5,000,000₮-ас дээш захиалгад хүргэлт үнэгүй</p>
              )}
              <div className="flex justify-between font-medium text-lg pt-3 border-t border-sand">
                <span>Нийт</span><span>{formatPrice(total + shipping)}</span>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-6 disabled:opacity-60 group">
              <span className="inline-flex items-center gap-2">
                {loading ? "Боловсруулж байна..." : "Захиалга баталгаажуулах"}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}
