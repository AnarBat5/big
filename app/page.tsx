import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Hammer, Globe } from "lucide-react";
import { getProducts } from "@/lib/server/products";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero";
import CategoriesGrid from "@/components/CategoriesGrid";
import Reveal from "@/components/Reveal";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const PROMISES = [
  { icon: Truck,       title: "Үнэгүй хүргэлт",   desc: "5M₮-аас дээш захиалгад" },
  { icon: ShieldCheck, title: "5 жилийн баталгаа", desc: "Бүтээгдэхүүн бүрд" },
  { icon: Hammer,      title: "Гар хийц",          desc: "Урчуудын нямбай ажил" },
  { icon: Globe,       title: "21 аймаг",          desc: "Монгол даяар" },
];

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured && p.inStock > 0).slice(0, 4);

  return (
    <>
      <Hero />
      <CategoriesGrid />

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-sand">
          <div className="flex items-end justify-between mb-12">
            <Reveal>
              <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-3">Онцлох</p>
              <h2 className="font-serif text-4xl md:text-5xl text-bark leading-tight">
                Шилмэл <span className="italic text-accent">бүтээгдэхүүн</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <Link
                href="/shop"
                className="hidden md:inline-flex items-center gap-2 text-xs tracking-widest uppercase text-bark/80 hover:text-accent group transition-colors"
              >
                Бүгдийг үзэх
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center md:hidden">
            <Link href="/shop" className="text-xs tracking-widest uppercase text-bark/80 hover:text-accent">
              Бүгдийг үзэх
            </Link>
          </div>
        </section>
      )}

      <section className="bg-noir text-cream relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(800px circle at 20% 30%, #A8753F33, transparent), radial-gradient(600px circle at 80% 70%, #C9A45F22, transparent)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-end mb-14">
            <Reveal>
              <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-4">Бидний амлалт</p>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight">
                Удаан эдэлгээ.
                <br />
                <span className="italic text-gold">Шинэ үе.</span>
              </h2>
            </Reveal>
            <Reveal delay={120} className="md:text-right">
              <p className="text-cream/70 max-w-md md:ml-auto leading-relaxed">
                Та зөв сонголт хийсэн гэдэгт итгэлтэй байх ёстой. Тиймээс бид хийц, материал, хүргэлт бүрд хариуцлага хүлээдэг.
              </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PROMISES.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="surface p-6 h-full bg-cream/5 border-cream/10">
                  <p.icon size={20} className="text-accent mb-4" />
                  <p className="font-serif text-xl mb-1">{p.title}</p>
                  <p className="text-cream/60 text-xs leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <Reveal>
          <div className="surface relative overflow-hidden p-10 md:p-16 text-center">
            <div
              aria-hidden
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
              style={{ background: "radial-gradient(circle, #C9A45F 0%, transparent 70%)" }}
            />
            <p className="text-[10px] tracking-[0.4em] uppercase text-accent mb-4 relative">Зөв сонголт</p>
            <h2 className="font-serif text-4xl md:text-6xl text-bark leading-tight max-w-3xl mx-auto mb-6 relative">
              Гэрээ <span className="italic text-accent">шинэлэг</span> болго
            </h2>
            <p className="text-bark/70 max-w-xl mx-auto mb-10 relative">
              Манай бүтэн цуглуулгыг үзээд өөрийн стилд тохирох тавилгаа сонго.
            </p>
            <Link href="/shop" className="btn-primary inline-flex items-center gap-2 group relative">
              Дэлгүүр үзэх
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
