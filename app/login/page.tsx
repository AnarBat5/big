"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, AuthFooterLink, inputCls, labelCls } from "@/components/AuthShell";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const sb = createClient();
      const { error: err } = await sb.auth.signInWithPassword({ email, password });
      if (err) {
        if (/invalid.*credentials/i.test(err.message)) setError("Имэйл эсвэл нууц үг буруу байна");
        else if (/email.*not.*confirmed/i.test(err.message)) setError("Имэйл хаягаа баталгаажуулна уу");
        else setError(err.message);
      } else {
        router.refresh();
        router.push(next);
        return;
      }
    } catch (err) {
      setError(`Холболтын алдаа: ${err instanceof Error ? err.message : String(err)}`);
    }
    setLoading(false);
  };

  return (
    <AuthShell
      title={<>Тавтай <span className="italic text-accent">морил</span></>}
      subtitle="Бүртгэлтэй имэйл хаягаараа нэвтэрнэ үү"
      footer={<AuthFooterLink href="/signup" prefix="Шинэ хэрэглэгч үү?" label="Бүртгүүлэх" />}
    >
      <form onSubmit={handle} className="space-y-4">
        <div>
          <label className={labelCls}>Имэйл</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className={inputCls} required autoComplete="email" placeholder="you@email.mn" />
        </div>
        <div>
          <label className={labelCls}>Нууц үг</label>
          <div className="relative">
            <input type={showPwd ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)} className={inputCls + " pr-12"}
              required autoComplete="current-password" placeholder="••••••••" />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-bark transition"
              aria-label={showPwd ? "Нуух" : "Харах"}>
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
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
