import Link from "next/link";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/80 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-serif text-2xl text-cream mb-3">Baganuur</h3>
          <p className="text-sm leading-relaxed">
            Монголын гэр бүлүүдэд чанартай тавилга, тав тухтай орчин бүтээж байна.
          </p>
        </div>

        <div>
          <h4 className="text-cream font-medium mb-4 text-sm tracking-wider uppercase">Хайчилбар</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop" className="hover:text-accent">Дэлгүүр</Link></li>
            <li><Link href="/about" className="hover:text-accent">Бидний тухай</Link></li>
            <li><Link href="/contact" className="hover:text-accent">Холбогдох</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-cream font-medium mb-4 text-sm tracking-wider uppercase">Үйлчилгээ</h4>
          <ul className="space-y-2 text-sm">
            <li>Хүргэлт</li>
            <li>Угсралт</li>
            <li>Баталгаа</li>
            <li>Буцаалт</li>
          </ul>
        </div>

        <div>
          <h4 className="text-cream font-medium mb-4 text-sm tracking-wider uppercase">Холбоо барих</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone size={14} /> 7000-1234</li>
            <li className="flex items-center gap-2"><Mail size={14} /> info@baganuur.mn</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Улаанбаатар, Монгол</li>
          </ul>
          <div className="flex gap-3 mt-4">
            <Facebook size={18} className="hover:text-accent cursor-pointer" />
            <Instagram size={18} className="hover:text-accent cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Baganuur Investment Group. Бүх эрх хуулиар хамгаалагдсан.
      </div>
    </footer>
  );
}
