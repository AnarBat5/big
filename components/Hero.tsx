import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, Truck, ShieldCheck } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1800&q=85";

export default function Hero() {
  return (
    <section className="min-h-[88vh] pt-16 pb-20 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 items-center">
          {/* Text column */}
          <div className="md:col-span-2 space-y-8 animate-fade-in-left">
            <span className="inline-block px-4 py-2 rounded-full bg-sand/60 text-bark border border-bark/10 text-sm font-medium">
              Шинэ цуглуулга 2026
            </span>

            <h1 className="text-6xl md:text-7xl font-bold text-bark leading-[1.05] tracking-tight">
              Тавилгын
              <br />
              <span className="bg-gradient-to-r from-bark to-charcoal bg-clip-text text-transparent">
                Ирээдүй
              </span>
            </h1>

            <p className="text-lg text-bark/70 max-w-lg leading-relaxed">
              Байгалийн дулаан өнгө, өндөр технологийн гоо төрхийг хослуулсан минималист загвар.
              Орчин үеийн гэрт зориулсан бүтээл бүр.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/shop" className="btn-primary group">
                Цуглуулга үзэх
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/about" className="btn-outline">
                Бидний түүх
              </Link>
            </div>

            <div className="flex gap-10 pt-8">
              {[
                { num: "500+",  label: "Бүтээгдэхүүн" },
                { num: "15K+",  label: "Үйлчлүүлэгч" },
                { num: "12+",   label: "Жилийн туршлага" },
              ].map((s) => (
                <div key={s.label} className="space-y-1">
                  <p className="text-3xl font-bold text-accent">{s.num}</p>
                  <p className="text-sm text-bark/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image column */}
          <div className="md:col-span-3 relative animate-scale-in">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-sand to-cream shadow-big">
              <Image
                src={HERO_IMG}
                alt="Тавилгын цуглуулга"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-bark/30 via-transparent to-transparent" />
            </div>

            {/* Floating glass cards */}
            <FloatCard
              icon={<Package size={20} />}
              title="Нөөцөд байгаа"
              value="250+"
              position="top-4 right-4"
              delayClass="delay-200"
            />
            <FloatCard
              icon={<Truck size={20} />}
              title="Үнэгүй хүргэлт"
              value="500K₮+"
              position="bottom-4 left-4"
              delayClass="delay-300"
            />
            <FloatCard
              icon={<ShieldCheck size={20} />}
              title="Баталгаа"
              value="5 жил"
              position="top-1/2 -right-4 -translate-y-1/2 hidden lg:flex"
              delayClass="delay-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatCard({ icon, title, value, position, delayClass }: {
  icon: React.ReactNode; title: string; value: string; position: string; delayClass: string;
}) {
  return (
    <div
      className={`absolute ${position} glass shadow-glass rounded-2xl p-4 animate-fade-in-up ${delayClass} animate-float`}
      style={{ animationDuration: "5s, 0.7s, 5s" }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent rounded-lg text-bark">{icon}</div>
        <div>
          <p className="text-xs text-bark/60">{title}</p>
          <p className="font-bold text-bark">{value}</p>
        </div>
      </div>
    </div>
  );
}
