"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/store/toast";

export default function PasswordPage() {
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const showToast = useToast((s) => s.show);
  const cls = "w-full border border-sand bg-white px-4 py-3 focus:outline-none focus:border-bark text-bark";

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (pwd.length < 8) { setError("Шинэ нууц үг 8-аас доошгүй тэмдэгттэй байх ёстой"); return; }
    if (pwd !== confirm) { setError("Нууц үг таарахгүй байна"); return; }
    setLoading(true);
    const sb = createClient();
    const { error: err } = await sb.auth.updateUser({ password: pwd });
    setLoading(false);
    if (err) { setError(err.message); return; }
    showToast("Нууц үг шинэчлэгдлээ");
    setPwd(""); setConfirm("");
  };

  return (
    <div>
      <h2 className="font-serif text-3xl text-bark mb-8">Нууц үг солих</h2>
      <form onSubmit={save} className="surface bg-cream/40 p-8 max-w-md space-y-4">
        <div>
          <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Шинэ нууц үг</label>
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} className={cls} required minLength={8} />
        </div>
        <div>
          <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Дахин оруулна уу</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={cls} required minLength={8} />
        </div>
        {error && <p className="text-red-700 text-sm bg-red-50 px-4 py-2.5 border border-red-200">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Шинэчилж байна..." : "Шинэчлэх"}
        </button>
      </form>
    </div>
  );
}
