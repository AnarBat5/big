# Baganuur Investment Group — Тавилгын вэбсайт

Монголын тавилгын брэндэд зориулсан Next.js 14 + TypeScript + Tailwind CSS вэбсайт.

## Эхлүүлэх

```bash
npm install
npm run dev
```

Дараа нь [http://localhost:3000](http://localhost:3000) хаягаар орно уу.

## Бүтэц

```
app/
├── page.tsx              # Нүүр хуудас
├── shop/                 # Дэлгүүр (шүүлтүүртэй)
├── product/[id]/         # Бүтээгдэхүүний дэлгэрэнгүй
├── cart/                 # Сагс
├── checkout/             # Захиалга
├── about/                # Бидний тухай
├── contact/              # Холбогдох
└── admin/                # Админ хяналтын самбар

components/
├── Navbar.tsx
├── Footer.tsx
├── ProductCard.tsx
└── CartContext.tsx       # Сагсны state management

lib/
└── products.ts           # Бүтээгдэхүүний өгөгдөл
```

## Гол боломжууд

- **12 бүтээгдэхүүн** — буйдан, сандал, ширээ, ор, шүүгээ
- **Сагсны систем** — нэмэх/хасах/тоо өөрчлөх
- **Шүүлтүүр** — ангилал, үнээр эрэмбэлэх
- **Захиалгын форм** — хүргэлтийн мэдээлэл, төлбөрийн хэлбэр
- **Админ самбар** — статистик, бүтээгдэхүүн засварлах, захиалга харах
- **Адаптив дизайн** — гар утас, таблет, компьютер
- **Монгол хэл** — UI бүхэлдээ

## Админ нэвтрэх

- URL: `/admin`
- Нууц үг: `admin123`

## Технологи

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** — дулаан натурал өнгөний палитр
- **lucide-react** — icon
- **Cormorant Garamond + Inter** — фонт

## Үйлдвэрлэлд гаргах

```bash
npm run build
npm start
```

## Тохируулга

- Бүтээгдэхүүн нэмэх: `lib/products.ts` файлыг засна
- Өнгө өөрчлөх: `tailwind.config.ts`
- Жинхэнэ ажиллагаатай болгохын тулд: backend API, өгөгдлийн сан, төлбөрийн систем (QPay, Pocket гэх мэт) холбоно.

---

© Baganuur Investment Group
