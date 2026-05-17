"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });
      if (authErr) {
        const msg = authErr.message || "";
        if (/email.*not.*confirmed/i.test(msg)) {
          setError("Имэйл баталгаажаагүй. Supabase Auth дашбордоос confirm хийнэ үү.");
        } else if (/invalid.*credentials/i.test(msg)) {
          setError("Имэйл эсвэл нууц үг буруу байна");
        } else {
          setError(msg || "Нэвтрэх боломжгүй");
        }
      } else {
        router.refresh();
        router.push("/admin");
        return;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Холболтын алдаа: ${msg}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #C9A45F 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #A8753F 0%, transparent 70%)" }}
      />

      <div className="surface bg-cream/80 backdrop-blur-xs p-10 max-w-md w-full relative animate-fade-in-up">
        <div className="w-12 h-12 bg-bark/10 rounded-full flex items-center justify-center mb-6">
          <Lock size={20} className="text-bark" />
        </div>
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-2">Удирдлага</p>
        <h1 className="font-serif text-4xl text-bark mb-1 leading-tight">
          Админ <span className="italic text-accent">нэвтрэх</span>
        </h1>
        <p className="text-sm text-muted mb-8">Baganuur Investment Group</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Имэйл</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-sand bg-white px-4 py-3 focus:border-bark focus:bg-cream/50 transition text-bark"
              placeholder="admin@example.mn"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-[10px] text-muted uppercase tracking-widest block mb-1.5">Нууц үг</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-sand bg-white px-4 py-3 pr-12 focus:border-bark focus:bg-cream/50 transition text-bark"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-bark transition"
                aria-label={showPwd ? "Нуух" : "Харах"}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-700 text-sm bg-red-50 px-4 py-2.5 border border-red-200 animate-fade-in">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>
        </form>
      </div>
    </div>
  );
}
