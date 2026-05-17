import Link from "next/link";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-noir text-cream/75 mt-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #A8753F 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-0 h-[400px] w-[400px] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #C9A45F 0%, transparent 70%)" }}
      />

      <div className="border-b border-cream/10 py-12 md:py-16 relative">
        <p className="font-serif text-[18vw] md:text-[14rem] leading-[0.85] text-cream/[0.06] tracking-tight px-6 select-none">
          Baganuur
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12 relative">
        <div>
          <h3 className="font-serif text-2xl text-cream mb-3">Baganuur</h3>
          <p className="text-sm leading-relaxed text-cream/60">
            Монголын гэр бүлүүдэд чанартай тавилга, тав тухтай орчин бүтээж байна.
          </p>
        </div>

        <div>
          <h4 className="text-cream/90 font-medium mb-5 text-[10px] tracking-[0.3em] uppercase">Хайчилбар</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/shop"           className="link-underline hover:text-accent">Дэлгүүр</Link></li>
            <li><Link href="/order-tracking" className="link-underline hover:text-accent">Захиалга хайх</Link></li>
            <li><Link href="/about"          className="link-underline hover:text-accent">Бидний тухай</Link></li>
            <li><Link href="/contact"        className="link-underline hover:text-accent">Холбогдох</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-cream/90 font-medium mb-5 text-[10px] tracking-[0.3em] uppercase">Үйлчилгээ</h4>
          <ul className="space-y-3 text-sm text-cream/60">
            <li>Хүргэлт</li>
            <li>Угсралт</li>
            <li>5 жилийн баталгаа</li>
            <li>Буцаалт</li>
          </ul>
        </div>

        <div>
          <h4 className="text-cream/90 font-medium mb-5 text-[10px] tracking-[0.3em] uppercase">Холбоо барих</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="tel:+97670001234" className="flex items-center gap-2 hover:text-accent transition">
                <Phone size={14} /> 7000-1234
              </a>
            </li>
            <li>
              <a href="mailto:info@baganuur.mn" className="flex items-center gap-2 hover:text-accent transition">
                <Mail size={14} /> info@baganuur.mn
              </a>
            </li>
            <li className="flex items-center gap-2 text-cream/60"><MapPin size={14} /> Улаанбаатар, Монгол</li>
          </ul>
          <div className="flex gap-2 mt-6">
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-cream/15 flex items-center justify-center hover:bg-accent hover:border-accent transition"
            >
              <Facebook size={15} />
            </a>
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-cream/15 flex items-center justify-center hover:bg-accent hover:border-accent transition"
            >
              <Instagram size={15} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6 text-center text-[10px] tracking-widest uppercase text-cream/40 relative">
        © {new Date().getFullYear()} Baganuur Investment Group · Бүх эрх хуулиар хамгаалагдсан
      </div>
    </footer>
  );
}
