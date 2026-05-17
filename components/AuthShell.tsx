"use client";
import Link from "next/link";
import { Lock } from "lucide-react";

export function AuthShell({ title, subtitle, children, footer }: {
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #C9A45F 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #A8753F 0%, transparent 70%)" }}
      />

      <div className="surface bg-cream/80 backdrop-blur-xs p-10 max-w-md w-full relative animate-fade-in-up">
        <div className="w-12 h-12 bg-bark/10 rounded-full flex items-center justify-center mb-6">
          <Lock size={20} className="text-bark" />
        </div>
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-2">Хэрэглэгч</p>
        <h1 className="font-serif text-4xl text-bark mb-1 leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted mb-8">{subtitle}</p>}
        {!subtitle && <div className="mb-8" />}
        {children}
        {footer && <div className="mt-6 text-sm text-center text-muted">{footer}</div>}
      </div>
    </div>
  );
}

export const inputCls =
  "w-full border border-sand bg-white px-4 py-3 focus:border-bark focus:bg-cream/50 transition text-bark";
export const labelCls = "text-[10px] text-muted uppercase tracking-widest block mb-1.5";

export function AuthFooterLink({ href, prefix, label }: { href: string; prefix: string; label: string }) {
  return (
    <span>
      {prefix}{" "}
      <Link href={href} className="text-accent link-underline">{label}</Link>
    </span>
  );
}
