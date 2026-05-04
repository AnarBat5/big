import { Award, Users, Globe, Heart } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { icon: Users, num: "15,000+", label: "Сэтгэл ханамжтай үйлчлүүлэгч" },
    { icon: Award, num: "12+", label: "Жилийн туршлага" },
    { icon: Globe, num: "21", label: "Аймагт хүргэлттэй" },
    { icon: Heart, num: "200+", label: "Гар хийцийн загвар" },
  ];

  return (
    <>
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="relative max-w-7xl mx-auto px-6 text-cream">
          <p className="text-xs tracking-[0.4em] uppercase mb-4 text-accent">Бидний тухай</p>
          <h1 className="font-serif text-5xl md:text-6xl max-w-2xl">Уламжлалаас орчин үе хүртэл</h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="font-serif text-4xl text-bark mb-8 text-center">Манай түүх</h2>
        <div className="space-y-6 text-bark/80 leading-relaxed text-lg">
          <p>
            Baganuur Investment Group нь 2014 онд Улаанбаатар хотод үүсгэн байгуулагдсан, Монгол Улсын
            тэргүүлэх тавилгын үйлдвэрлэгч юм. Манай зорилго нь Монгол гэр бүл бүрд чанартай, удаан
            эдэлгээтэй тавилгыг боломжийн үнээр хүргэх явдал.
          </p>
          <p>
            Бид уламжлалт Монгол урлал, орчин үеийн дизайныг хослуулан, дотоодын модны материалаар
            тавилга үйлдвэрлэдэг. Манай 50 гаруй мэргэжлийн урчуудын хамт олон гэрийн тань өрөө
            бүрийг тав тухтай орчин болгох гэсэн нэг эрмэлзэлтэй байдаг.
          </p>
          <p>
            Өнөөдрийн байдлаар бид 21 аймагт хүргэлт хийж, 15,000 гаруй гэр бүлд үйлчилгээгээ
            хүргэсэн нь бидний хувьд хамгийн их бахархал.
          </p>
        </div>
      </section>

      <section className="bg-bark text-cream py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map(({ icon: Icon, num, label }) => (
            <div key={label} className="text-center">
              <Icon size={28} className="mx-auto mb-3 text-accent" />
              <p className="font-serif text-4xl mb-2">{num}</p>
              <p className="text-cream/70 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">Үнэт зүйлс</p>
          <h2 className="font-serif text-4xl text-bark">Бидний итгэл үнэмшил</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Чанар", desc: "Эх материалаас эхлээд эцсийн өнгөлгөө хүртэл нягт нямбай хяналт." },
            { title: "Тогтвортой байдал", desc: "Байгальд ээлтэй, нөхөн сэргээгддэг материал ашигладаг." },
            { title: "Гар хийц", desc: "Машины бус, урчуудын гарын хүчээр бүтсэн өвөрмөц загвар." },
          ].map((v) => (
            <div key={v.title} className="border-t border-sand pt-6">
              <h3 className="font-serif text-2xl text-bark mb-3">{v.title}</h3>
              <p className="text-muted leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
