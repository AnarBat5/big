import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Hammer } from "lucide-react";
import { products, categories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const featured = products.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-xl text-cream">
            <p className="text-xs tracking-[0.4em] uppercase mb-6 text-accent">Шинэ цуглуулга 2026</p>
            <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-6">
              Гэр бүлийн тав тухыг бүтээгч
            </h1>
            <p className="text-cream/80 mb-10 text-lg leading-relaxed">
              Монгол урчуудын гар хийц, орчин үеийн дизайныг хослуулсан чанартай тавилга.
            </p>
            <div className="flex gap-4">
              <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
                Дэлгүүр үзэх <ArrowRight size={16} />
              </Link>
              <Link href="/about" className="text-cream border-b border-cream pb-1 hover:text-accent hover:border-accent transition self-center text-sm tracking-wider uppercase">
                Манай түүх
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ангилал */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">Ангилал</p>
            <h2 className="font-serif text-4xl text-bark">Бүхэн өрөөнд тань</h2>
          </div>
          <Link href="/shop" className="text-sm text-accent hover:underline">
            Бүгдийг үзэх →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((c) => {
            const product = products.find((p) => p.category === c.id);
            return (
              <Link
                key={c.id}
                href={`/shop?cat=${c.id}`}
                className="group relative aspect-[3/4] overflow-hidden bg-sand"
              >
                <img
                  src={product?.image}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-charcoal/30 group-hover:bg-charcoal/50 transition" />
                <h3 className="absolute bottom-4 left-4 font-serif text-2xl text-cream">{c.name}</h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Онцлох */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">Онцлох бүтээгдэхүүн</p>
          <h2 className="font-serif text-4xl text-bark">Хамгийн их сонирхогдсон</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Үйлчилгээ */}
      <section className="bg-bark text-cream py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          {[
            { icon: Truck, title: "Үнэгүй хүргэлт", desc: "Улаанбаатар хотын дотор бүх захиалгыг үнэгүй хүргэнэ." },
            { icon: ShieldCheck, title: "5 жилийн баталгаа", desc: "Бүх тавилгад үйлдвэрийн баталгаатай." },
            { icon: Hammer, title: "Угсралт", desc: "Мэргэжлийн багууд таны гэрт ирж угсарна." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <Icon size={32} className="mx-auto mb-4 text-accent" />
              <h3 className="font-serif text-2xl mb-2">{title}</h3>
              <p className="text-cream/70 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
