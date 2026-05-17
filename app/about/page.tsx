import type { Metadata } from "next";
import Image from "next/image";
import { Award, Users, Globe, Heart } from "lucide-react";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Бидний тухай",
  description: "Baganuur Investment Group — 2014 оноос хойш Монгол гэр бүлд чанартай тавилга нийлүүлж ирсэн тэргүүлэх брэнд.",
  openGraph: {
    title: "Бидний тухай | Baganuur Investment Group",
    description: "12+ жилийн туршлага, 15,000+ үйлчлүүлэгч, 21 аймагт хүргэлттэй.",
  },
};

export default function AboutPage() {
  const stats = [
    { icon: Users, num: "15,000+", label: "Сэтгэл ханамжтай үйлчлүүлэгч" },
    { icon: Award, num: "12+",     label: "Жилийн туршлага" },
    { icon: Globe, num: "21",      label: "Аймагт хүргэлттэй" },
    { icon: Heart, num: "200+",    label: "Гар хийцийн загвар" },
  ];

  return (
    <>
      <section className="relative h-[70vh] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1800&q=85"
          alt=""
          fill
          sizes="100vw"
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/40 to-noir/10" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-25 mix-blend-overlay"
          style={{ background: "radial-gradient(800px circle at 30% 80%, #C9A45F, transparent 60%)" }}
        />

        <div className="relative max-w-7xl mx-auto px-6 pb-20 text-cream w-full">
          <p className="text-[10px] tracking-[0.4em] uppercase mb-5 text-accent animate-fade-in">
            Бидний тухай
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl max-w-4xl leading-[0.95] animate-fade-in-up">
            Уламжлалаас
            <br />
            <span className="italic text-gold">орчин үе</span> хүртэл.
          </h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-24">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-3">Манай түүх</p>
          <h2 className="font-serif text-4xl md:text-5xl text-bark mb-12">
            Жилийн туршлага, нэг л зорилго
          </h2>
        </Reveal>
        <div className="space-y-6 text-bark/80 leading-relaxed text-lg">
          <Reveal>
            <p>
              Baganuur Investment Group нь 2014 онд Улаанбаатар хотод үүсгэн байгуулагдсан, Монгол
              Улсын тэргүүлэх тавилгын үйлдвэрлэгч юм. Манай зорилго нь Монгол гэр бүл бүрд чанартай,
              удаан эдэлгээтэй тавилгыг боломжийн үнээр хүргэх явдал.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <p>
              Бид уламжлалт Монгол урлал, орчин үеийн дизайныг хослуулан, дотоодын модны материалаар
              тавилга үйлдвэрлэдэг. Манай 50 гаруй мэргэжлийн урчуудын хамт олон гэрийн тань өрөө
              бүрийг тав тухтай орчин болгох гэсэн нэг эрмэлзэлтэй байдаг.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <p>
              Өнөөдрийн байдлаар бид 21 аймагт хүргэлт хийж, 15,000 гаруй гэр бүлд үйлчилгээгээ
              хүргэсэн нь бидний хувьд хамгийн их бахархал.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-noir text-cream py-20 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-25 blur-3xl"
          style={{ background: "radial-gradient(600px circle at 20% 50%, #A8753F33, transparent), radial-gradient(500px circle at 80% 50%, #C9A45F22, transparent)" }}
        />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 relative">
          {stats.map(({ icon: Icon, num, label }, i) => (
            <Reveal key={label} delay={i * 80} className="text-center">
              <Icon size={26} className="mx-auto mb-4 text-accent" />
              <p className="font-serif text-4xl md:text-5xl mb-2">{num}</p>
              <p className="text-cream/60 text-xs tracking-widest uppercase">{label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-3">Үнэт зүйлс</p>
          <h2 className="font-serif text-4xl md:text-5xl text-bark mb-12">
            Бидний <span className="italic text-accent">итгэл үнэмшил</span>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-2">
          {[
            { num: "01", title: "Чанар",            desc: "Эх материалаас эхлээд эцсийн өнгөлгөө хүртэл нягт нямбай хяналт." },
            { num: "02", title: "Тогтвортой байдал", desc: "Байгальд ээлтэй, нөхөн сэргээгддэг материал ашигладаг." },
            { num: "03", title: "Гар хийц",          desc: "Машины бус, урчуудын гарын хүчээр бүтсэн өвөрмөц загвар." },
          ].map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
              <div className="group relative p-8 h-full border-t border-sand hover:bg-cream transition">
                <p className="text-xs tracking-widest text-accent mb-4">{v.num}</p>
                <h3 className="font-serif text-3xl text-bark mb-4">{v.title}</h3>
                <p className="text-muted leading-relaxed">{v.desc}</p>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
