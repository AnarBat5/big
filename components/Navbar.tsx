"use client";
import Link from "next/link";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { useCart, cartCount } from "@/lib/store/cart";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.openDrawer);
  const count = cartCount(items);

  const links = [
    { href: "/", label: "Нүүр" },
    { href: "/shop", label: "Дэлгүүр" },
    { href: "/about", label: "Бидний тухай" },
    { href: "/contact", label: "Холбогдох" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-sand">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-serif text-2xl text-bark tracking-wide">Baganuur</span>
            <span className="text-[10px] tracking-[0.3em] text-muted uppercase mt-1">Investment Group</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-bark hover:text-accent transition tracking-wide"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="p-2 hover:text-accent transition">
              <Search size={20} />
            </button>
            <button onClick={openCart} className="relative p-2 hover:text-accent transition">
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-cream text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {count}
                </span>
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-sand bg-cream px-6 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-bark hover:text-accent"
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
