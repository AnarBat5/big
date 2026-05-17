import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Package, MapPin, Heart, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Миний бүртгэл",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/account",            label: "Тойм",       icon: User },
  { href: "/account/orders",     label: "Захиалга",   icon: Package },
  { href: "/account/addresses",  label: "Хаяг",       icon: MapPin },
  { href: "/account/wishlist",   label: "Хадгалсан",  icon: Heart },
  { href: "/account/password",   label: "Нууц үг",    icon: KeyRound },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const { data: profile } = await sb.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle();
  const displayName = profile?.full_name || user.email?.split("@")[0] || "Хэрэглэгч";

  return (
    <div className="relative max-w-7xl mx-auto px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-0 h-[400px] w-[400px] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #C9A45F 0%, transparent 70%)" }}
      />

      <div className="mb-12 relative">
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-3">Миний бүртгэл</p>
        <h1 className="font-serif text-5xl md:text-6xl text-bark leading-[0.95]">
          Сайн уу, <span className="italic text-accent">{displayName}</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-10 relative">
        <aside className="lg:sticky lg:top-24 self-start">
          <nav className="surface bg-cream/40 p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-3 px-4 py-2.5 text-xs tracking-widest uppercase text-bark/70 hover:text-bark hover:bg-cream transition whitespace-nowrap"
              >
                <n.icon size={14} />
                {n.label}
              </Link>
            ))}
            <LogoutButton />
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
