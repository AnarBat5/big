"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { User, Package, MapPin, Heart, KeyRound, LogIn, LogOut, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AccountIcon() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [name, setName] = useState<string>("");
  const ref = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sb = createClient();
    let mounted = true;
    sb.auth.getUser().then(async ({ data }) => {
      if (!mounted) return;
      if (data.user?.email) {
        setUser({ email: data.user.email });
        const { data: p } = await sb.from("profiles").select("full_name").eq("id", data.user.id).maybeSingle();
        if (mounted) setName(p?.full_name || data.user.email.split("@")[0]);
      }
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      if (!mounted) return;
      setUser(session?.user?.email ? { email: session.user.email } : null);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  const logout = async () => {
    const sb = createClient();
    await sb.auth.signOut();
    setOpen(false);
    setUser(null);
    ref.refresh();
    ref.push("/");
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Бүртгэл"
        className="p-2.5 rounded-full hover:bg-sand/60 text-bark hover:text-accent transition"
      >
        <User size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 surface bg-cream backdrop-blur-xs animate-fade-in-up z-50">
          {user ? (
            <>
              <div className="px-4 py-3 border-b border-sand/60">
                <p className="text-[10px] tracking-widest uppercase text-muted">Нэвтэрсэн</p>
                <p className="font-serif text-bark truncate">{name}</p>
                <p className="text-xs text-muted truncate">{user.email}</p>
              </div>
              <ul className="py-2 text-sm">
                {[
                  { href: "/account",           label: "Тойм",      icon: User },
                  { href: "/account/orders",    label: "Захиалга",  icon: Package },
                  { href: "/account/addresses", label: "Хаяг",      icon: MapPin },
                  { href: "/account/wishlist",  label: "Хадгалсан", icon: Heart },
                  { href: "/account/password",  label: "Нууц үг",   icon: KeyRound },
                ].map((i) => (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-bark/80 hover:bg-sand/40 hover:text-bark transition"
                    >
                      <i.icon size={14} /> {i.label}
                    </Link>
                  </li>
                ))}
                <li className="border-t border-sand/60 mt-1 pt-1">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-bark/80 hover:bg-sand/40 hover:text-accent transition"
                  >
                    <LogOut size={14} /> Гарах
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <ul className="py-2 text-sm">
              <li>
                <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 text-bark/80 hover:bg-sand/40 hover:text-bark transition">
                  <LogIn size={14} /> Нэвтрэх
                </Link>
              </li>
              <li>
                <Link href="/signup" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 text-bark/80 hover:bg-sand/40 hover:text-bark transition">
                  <UserPlus size={14} /> Бүртгүүлэх
                </Link>
              </li>
              <li className="border-t border-sand/60 mt-1 pt-1">
                <Link href="/order-tracking" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 text-bark/80 hover:bg-sand/40 hover:text-bark transition">
                  <Package size={14} /> Захиалга хайх
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
