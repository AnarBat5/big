"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, Star, MapPin } from "lucide-react";
import { useToast } from "@/lib/store/toast";

type Addr = { id: number; label: string; recipient: string; phone: string; district: string; detail: string; is_default: boolean };
const DISTRICTS = ["Сүхбаатар","Чингэлтэй","Баянзүрх","Баянгол","Сонгинохайрхан","Хан-Уул"];

export default function AddressesPage() {
  const [items, setItems] = useState<Addr[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const showToast = useToast((s) => s.show);

  const load = async () => {
    const res = await fetch("/api/addresses", { credentials: "include" });
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm("Энэ хаягийг устгах уу?")) return;
    const res = await fetch(`/api/addresses?id=${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) { showToast("Устгагдлаа"); load(); }
  };

  const setDefault = async (id: number) => {
    const res = await fetch(`/api/addresses?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_default: true }),
      credentials: "include",
    });
    if (res.ok) { showToast("Үндсэн хаяг сонгогдлоо"); load(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-3xl text-bark">Хадгалсан хаяг</h2>
        <button onClick={() => setAdding(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus size={14} /> Хаяг нэмэх
        </button>
      </div>

      {loading ? (
        <div className="surface bg-cream/40 p-12 text-center text-muted">Ачаалж байна...</div>
      ) : items.length === 0 ? (
        <div className="surface bg-cream/40 p-12 text-center">
          <MapPin size={32} className="mx-auto text-muted mb-4" />
          <p className="text-muted">Хадгалсан хаяг байхгүй байна.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((a) => (
            <div key={a.id} className="surface bg-cream/40 p-5 relative">
              {a.is_default && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[9px] tracking-widest uppercase text-accent">
                  <Star size={10} fill="currentColor" /> Үндсэн
                </span>
              )}
              <p className="text-[10px] tracking-widest uppercase text-muted mb-2">{a.label || "Хаяг"}</p>
              <p className="font-serif text-xl text-bark">{a.recipient}</p>
              <p className="text-sm text-bark/70 mt-1">{a.phone}</p>
              <p className="text-sm text-bark/70 mt-2">{a.district}, {a.detail}</p>

              <div className="flex gap-3 mt-5 text-[10px] tracking-widest uppercase">
                {!a.is_default && (
                  <button onClick={() => setDefault(a.id)} className="text-bark/70 hover:text-accent">Үндсэн болгох</button>
                )}
                <button onClick={() => remove(a.id)} className="text-bark/70 hover:text-red-700 inline-flex items-center gap-1">
                  <Trash2 size={11} /> Устгах
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {adding && <AddModal districts={DISTRICTS} onClose={() => setAdding(false)} onSaved={() => { setAdding(false); load(); }} />}
    </div>
  );
}

function AddModal({ districts, onClose, onSaved }: { districts: string[]; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ label: "", recipient: "", phone: "", district: "", detail: "", is_default: false });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const showToast = useToast((s) => s.show);
  const cls = "w-full border border-sand bg-white px-3 py-2.5 focus:outline-none focus:border-bark text-bark text-sm";

  const save = async () => {
    setError("");
    if (!form.recipient || !form.phone || !form.district || !form.detail) {
      setError("Шаардлагатай талбаруудыг бөглөнө үү");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    if (res.ok) { showToast("Хаяг нэмэгдлээ"); onSaved(); }
    else { const j = await res.json().catch(() => ({})); setError(j.error || "Алдаа"); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-noir/60 flex items-center justify-center p-6 animate-fade-in" onClick={onClose}>
      <div className="surface bg-cream max-w-lg w-full p-8 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-2xl text-bark mb-6">Шинэ хаяг</h3>
        <div className="space-y-3">
          <input placeholder="Тэмдэглэгээ (Гэр, Ажил...)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={cls} />
          <input placeholder="Хүлээн авагч" value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} className={cls} />
          <input placeholder="Утас" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={cls} />
          <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className={cls}>
            <option value="">Дүүрэг сонгох</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <input placeholder="Дэлгэрэнгүй хаяг" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} className={cls} />
          <label className="flex items-center gap-2 text-sm text-bark/80">
            <input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} />
            Үндсэн хаяг болгох
          </label>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-outline flex-1">Болих</button>
          <button onClick={save} disabled={saving} className="btn-primary flex-1">{saving ? "Хадгалж байна..." : "Хадгалах"}</button>
        </div>
      </div>
    </div>
  );
}
