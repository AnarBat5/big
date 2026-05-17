"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/lib/store/toast";
import Reveal from "@/components/Reveal";

export default function ContactPage() {
  const showToast = useToast((s) => s.show);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast("Талбаруудыг бөглөнө үү", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Алдаа гарлаа");
      }
      showToast("Зурвас амжилттай илгээгдлээ");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Илгээж чадсангүй", "error");
    } finally { setLoading(false); }
  };

  const inputCls = "w-full border border-sand bg-cream/60 px-4 py-3 focus:outline-none focus:border-bark transition text-bark";

  const items = [
    { icon: Phone, title: "Утас",     value: "7000-1234, 9911-5678", link: "tel:+97670001234" },
    { icon: Mail,  title: "Имэйл",    value: "info@baganuur.mn",      link: "mailto:info@baganuur.mn" },
    { icon: MapPin,title: "Хаяг",     value: "Улаанбаатар, Сүхбаатар дүүрэг, 1-р хороо, Энхтайваны өргөн чөлөө 17" },
    { icon: Clock, title: "Цаг",      value: "Даваа–Бямба: 09:00 — 19:00 / Ням: 10:00 — 17:00" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-0 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #C9A45F 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 h-[500px] w-[500px] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #A8753F 0%, transparent 70%)" }}
      />

      <div className="text-center mb-20 relative animate-fade-in-up">
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-4">Холбогдох</p>
        <h1 className="font-serif text-5xl md:text-7xl text-bark leading-[0.95]">
          Бидэнтэй <span className="italic text-accent">холбогдоорой</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 relative">
        <div>
          <Reveal>
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-3">Холбоо барих мэдээлэл</p>
            <h2 className="font-serif text-3xl md:text-4xl text-bark mb-10">Бид <span className="italic text-accent">хүлээж байна</span></h2>
          </Reveal>

          <div className="space-y-3">
            {items.map(({ icon: Icon, title, value, link }, i) => (
              <Reveal key={title} delay={i * 80}>
                {link ? (
                  <a href={link} className="surface bg-cream/40 p-5 flex gap-4 hover:bg-cream transition group">
                    <div className="w-10 h-10 bg-accent/15 flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-cream transition">
                      <Icon size={16} className="text-accent group-hover:text-cream transition" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-widest mb-1">{title}</p>
                      <p className="text-bark">{value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="surface bg-cream/40 p-5 flex gap-4">
                    <div className="w-10 h-10 bg-accent/15 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-widest mb-1">{title}</p>
                      <p className="text-bark">{value}</p>
                    </div>
                  </div>
                )}
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <div className="mt-8 aspect-video bg-sand surface overflow-hidden">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=106.91%2C47.91%2C106.95%2C47.93&layer=mapnik"
                className="w-full h-full"
                title="Газрын зураг"
              />
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-3">Зурвас</p>
            <h2 className="font-serif text-3xl md:text-4xl text-bark mb-10">Зурвас <span className="italic text-accent">илгээх</span></h2>
          </Reveal>

          <Reveal delay={120}>
            <form onSubmit={submit} className="surface bg-cream/40 p-7 space-y-4">
              <div>
                <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Нэр *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Имэйл *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} required />
                </div>
                <div>
                  <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Утас</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Зурвас *</label>
                <textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputCls} required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                <Send size={14} /> {loading ? "Илгээж байна..." : "Илгээх"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
