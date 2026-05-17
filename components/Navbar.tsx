"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart, cartCount } from "@/lib/store/cart";
import SearchModal from "./SearchModal";
import AccountIcon from "./AccountIcon";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.openDrawer);
  const count = cartCount(items);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/",               label: "Нүүр" },
    { href: "/shop",           label: "Дэлгүүр" },
    { href: "/order-tracking", label: "Захиалга хайх" },
    { href: "/about",          label: "Бидний тухай" },
    { href: "/contact",        label: "Холбогдох" },
  ];
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "glass shadow-ring py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex flex-col leading-none group">
            <span className="font-serif text-2xl text-bark tracking-wide">Baganuur</span>
            <span className="text-[9px] tracking-[0.4em] text-muted uppercase mt-0.5 transition-colors group-hover:text-accent">
              Investment Group
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative text-xs tracking-[0.2em] uppercase transition-colors link-underline ${
                  isActive(l.href) ? "text-accent" : "text-bark/80 hover:text-bark"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Хайх"
              className="p-2.5 rounded-full hover:bg-sand/60 text-bark hover:text-accent transition"
            >
              <Search size={18} />
            </button>
            <AccountIcon />
            <button
              onClick={openCart}
              aria-label="Сагс"
              className="relative p-2.5 rounded-full hover:bg-sand/60 text-bark hover:text-accent transition"
            >
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-cream text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-medium animate-fade-in px-1">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Цэс"
              className="md:hidden p-2.5 rounded-full hover:bg-sand/60 text-bark transition"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden glass border-t border-sand/60 px-6 py-6 flex flex-col gap-1 animate-fade-in">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`py-2 text-sm tracking-wider uppercase transition-colors ${
                  isActive(l.href) ? "text-accent" : "text-bark/80 hover:text-accent"
                }`}
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
