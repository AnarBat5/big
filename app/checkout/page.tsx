"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/products";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "", district: "", note: "", payment: "card",
  });

  const shipping = total > 5000000 ? 0 : 50000;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    setTimeout(() => clear(), 100);
  };

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-6 py-32 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-accent/20 rounded-full flex items-center justify-center">
          <Check size={36} className="text-accent" />
        </div>
        <h1 className="font-serif text-4xl text-bark mb-4">Захиалга амжилттай!</h1>
        <p className="text-muted mb-2">Захиалгын дугаар: <span className="text-bark font-medium">#BG{Math.floor(Math.random() * 90000) + 10000}</span></p>
        <p className="text-muted mb-8">Манай ажилтан тантай удахгүй холбогдох болно.</p>
        <Link href="/" className="btn-primary inline-block">Нүүр хуудас руу</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-32 text-center">
        <p className="text-muted mb-6">Сагсанд бүтээгдэхүүн алга.</p>
        <Link href="/shop" className="btn-primary inline-block">Дэлгүүр үзэх</Link>
      </div>
    );
  }

  const inputCls = "w-full border border-sand bg-cream px-4 py-3 focus:outline-none focus:border-bark text-bark";

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="font-serif text-5xl text-bark mb-12">Захиалга</h1>

      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="font-serif text-2xl text-bark mb-6">Хүргэлтийн мэдээлэл</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Овог нэр" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              <input required placeholder="Утас" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
              <input type="email" required placeholder="Имэйл" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} className={`${inputCls} sm:col-span-2`} />
              <select required value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })} className={inputCls}>
                <option value="">Дүүрэг сонгох</option>
                <option>Сүхбаатар</option>
                <option>Чингэлтэй</option>
                <option>Баянзүрх</option>
                <option>Баянгол</option>
                <option>Сонгинохайрхан</option>
                <option>Хан-Уул</option>
              </select>
              <input required placeholder="Дэлгэрэнгүй хаяг" value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} />
              <textarea placeholder="Нэмэлт тайлбар (заавал биш)" value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })} className={`${inputCls} sm:col-span-2 h-24`} />
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark mb-6">Төлбөрийн хэлбэр</h2>
            <div className="space-y-3">
              {[
                { id: "card", label: "Картаар төлөх" },
                { id: "bank", label: "Банкны шилжүүлэг" },
                { id: "cod", label: "Хүргэгдэх үед төлөх" },
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-3 border border-sand p-4 cursor-pointer hover:border-bark">
                  <input type="radio" name="payment" value={opt.id}
                    checked={form.payment === opt.id}
                    onChange={(e) => setForm({ ...form, payment: e.target.value })} />
                  <span className="text-bark">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="bg-sand/40 p-8 h-fit">
          <h2 className="font-serif text-2xl text-bark mb-6">Захиалга</h2>
          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3 text-sm">
                <div className="w-12 h-12 bg-sand flex-shrink-0">
                  <img src={product.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-bark">{product.name}</p>
                  <p className="text-muted text-xs">{qty} × {formatPrice(product.price)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-sand pt-4">
            <div className="flex justify-between"><span className="text-muted">Дэд дүн</span><span>{formatPrice(total)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Хүргэлт</span><span>{shipping === 0 ? "Үнэгүй" : formatPrice(shipping)}</span></div>
            <div className="flex justify-between font-medium text-lg pt-2 border-t border-sand">
              <span>Нийт</span><span>{formatPrice(total + shipping)}</span>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full mt-6">Захиалга баталгаажуулах</button>
        </div>
      </form>
    </div>
  );
}
