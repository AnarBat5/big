"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", phone: "", message: "" });
    }, 3000);
  };

  const inputCls = "w-full border border-sand bg-cream px-4 py-3 focus:outline-none focus:border-bark text-bark";

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">Холбогдох</p>
        <h1 className="font-serif text-5xl text-bark">Бидэнтэй холбогдоорой</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="font-serif text-3xl text-bark mb-8">Холбоо барих мэдээлэл</h2>
          <div className="space-y-6">
            {[
              { icon: Phone, title: "Утас", value: "7000-1234, 9911-5678" },
              { icon: Mail, title: "Имэйл", value: "info@baganuur.mn" },
              { icon: MapPin, title: "Хаяг", value: "Улаанбаатар, Сүхбаатар дүүрэг, 1-р хороо, Энхтайваны өргөн чөлөө 17" },
              { icon: Clock, title: "Цагийн хуваарь", value: "Даваа–Бямба: 09:00 — 19:00 / Ням: 10:00 — 17:00" },
            ].map(({ icon: Icon, title, value }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 bg-sand flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-bark" />
                </div>
                <div>
                  <p className="text-sm text-muted uppercase tracking-wider mb-1">{title}</p>
                  <p className="text-bark">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 aspect-video bg-sand">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=106.91%2C47.91%2C106.95%2C47.93&layer=mapnik"
              className="w-full h-full"
              title="Газрын зураг"
            />
          </div>
        </div>

        <div>
          <h2 className="font-serif text-3xl text-bark mb-8">Зурвас илгээх</h2>
          <form onSubmit={submit} className="space-y-4">
            <input required placeholder="Нэр" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
            <input type="email" required placeholder="Имэйл" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
            <input placeholder="Утас" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
            <textarea required placeholder="Зурвас" rows={6} value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputCls} />
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              {sent ? "Илгээгдлээ ✓" : <><Send size={16} /> Илгээх</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
