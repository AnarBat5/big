import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

const CATS = [
  { id: "buidan",  name: "Буйдан",  hint: "Living room",   img: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=900" },
  { id: "or",      name: "Ор",      hint: "Bedroom",       img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900" },
  { id: "shiree",  name: "Ширээ",   hint: "Dining",        img: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=900" },
  { id: "shuugee", name: "Шүүгээ",  hint: "Storage",       img: "https://images.unsplash.com/photo-1595428773083-0de8d23c3efc?w=900" },
];

export default function CategoriesGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex items-end justify-between mb-12">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-3">Ангилал</p>
          <h2 className="font-serif text-4xl md:text-5xl text-bark leading-tight">
            Өрөө бүрд <span className="italic text-accent">төгс</span> сонголт
          </h2>
        </Reveal>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATS.map((c, i) => (
          <Reveal key={c.id} delay={i * 80}>
            <Link
              href={`/shop?cat=${c.id}`}
              className="group relative block aspect-[3/4] overflow-hidden bg-sand"
            >
              <span
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${c.img}')` }}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-noir/85 via-noir/20 to-transparent transition-opacity duration-500 group-hover:from-noir/95" />

              <div className="relative h-full flex flex-col justify-between p-6 text-cream">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] tracking-widest uppercase opacity-70">{c.hint}</p>
                  <ArrowUpRight
                    size={20}
                    className="opacity-0 -translate-y-1 translate-x-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
                  />
                </div>

                <div>
                  <h3 className="font-serif text-3xl">{c.name}</h3>
                  <span className="block h-px w-8 bg-accent mt-3 transition-all duration-500 group-hover:w-16" />
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
