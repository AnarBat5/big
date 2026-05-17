"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, AuthFooterLink, inputCls, labelCls } from "@/components/AuthShell";

export default function SignupPage() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (password.length < 8) {
      setError("Нууц үг 8-аас доошгүй тэмдэгттэй байх ёстой");
      setLoading(false);
      return;
    }
    if (!/^\d{8}$/.test(phone.replace(/\s/g, ""))) {
      setError("8 оронтой утасны дугаар оруулна уу");
      setLoading(false);
      return;
    }
    try {
      const sb = createClient();
      const { data, error: err } = await sb.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, phone } },
      });
      if (err) {
        setError(err.message);
      } else if (data.session) {
        router.refresh();
        router.push("/account");
        return;
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(`Алдаа: ${err instanceof Error ? err.message : String(err)}`);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <AuthShell
        title={<>Имэйл <span className="italic text-accent">илгээлээ</span></>}
        subtitle="Бүртгэлээ баталгаажуулна уу"
        footer={<AuthFooterLink href="/login" prefix="Бүртгэл бий юу?" label="Нэвтрэх" />}
      >
        <p className="text-bark/80 text-sm leading-relaxed">
          Таны имэйл хаяг руу баталгаажуулах холбоос илгээлээ. Холбоосыг дарж имэйлээ
          баталгаажуулсны дараа нэвтэрнэ үү.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={<>Шинэ <span className="italic text-accent">бүртгэл</span></>}
      subtitle="Захиалга хийхийн тулд бүртгэл үүсгэнэ үү"
      footer={<AuthFooterLink href="/login" prefix="Аль хэдийн бүртгэлтэй юу?" label="Нэвтрэх" />}
    >
      <form onSubmit={handle} className="space-y-4">
        <div>
          <label className={labelCls}>Овог нэр</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Имэйл</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required autoComplete="email" />
          </div>
          <div>
            <label className={labelCls}>Утас</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} required placeholder="99XXXXXX" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Нууц үг</label>
          <div className="relative">
            <input type={showPwd ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)} className={inputCls + " pr-12"}
              required autoComplete="new-password" minLength={8} placeholder="8-аас доошгүй тэмдэгт" />
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
          {loading ? "Үүсгэж байна..." : "Бүртгүүлэх"}
        </button>
        <p className="text-[10px] text-muted text-center leading-relaxed">
          Бүртгэлтэйгээ хамт та манай нөхцөл болон нууцлалын бодлогыг хүлээн зөвшөөрч байна.
        </p>
      </form>
    </AuthShell>
  );
}
