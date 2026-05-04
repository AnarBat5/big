import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <p className="font-serif text-9xl text-bark/20 mb-4">404</p>
      <h1 className="font-serif text-4xl text-bark mb-4">Хуудас олдсонгүй</h1>
      <p className="text-muted mb-8">Таны хайсан хуудас байхгүй эсвэл устгагдсан байна.</p>
      <Link href="/" className="btn-primary inline-block">Нүүр хуудас руу</Link>
    </div>
  );
}
