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
    const supabase = createClient();
    const { error: authErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authErr) {
      setError("Нэвтрэх нэр эсвэл нууц үг буруу байна");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="bg-cream border border-sand p-10 max-w-md w-full">
        <div className="w-12 h-12 bg-bark/10 rounded-full flex items-center justify-center mb-6">
          <Lock size={24} className="text-bark" />
        </div>
        <h1 className="font-serif text-3xl text-bark mb-1">Админ нэвтрэх</h1>
        <p className="text-sm text-muted mb-8">Baganuur Investment Group</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-muted uppercase tracking-wider block mb-1">
              Имэйл
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-sand bg-white px-4 py-3 focus:outline-none focus:border-bark text-bark"
              placeholder="admin@example.mn"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-xs text-muted uppercase tracking-wider block mb-1">
              Нууц үг
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-sand bg-white px-4 py-3 pr-12 focus:outline-none focus:border-bark text-bark"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-bark"
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 px-4 py-2 border border-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>
        </form>
      </div>
    </div>
  );
}
