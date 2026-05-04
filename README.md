# Baganuur Investment Group — Тавилгын вэбсайт

Бүрэн functional Next.js 14 + TypeScript + Tailwind CSS вэбсайт. **localStorage**-ээр өгөгдлөө хадгалдаг.

## Эхлүүлэх

```bash
npm install
npm run dev
```

➜ http://localhost:3000

## ✨ Functional боломжууд

### Үйлчлүүлэгчийн талаас:
- **🔍 Хайлт** — Navbar дээрх search icon (modal) + Shop хуудасны search bar
- **🛒 Cart drawer** — хажуугаас гарах, бодит цагт шинэчлэгдэх
- **💾 Persist cart** — refresh хийсэн ч сагс алга болохгүй
- **📦 Stock хяналт** — үлдэгдлээс илүү захиалж болохгүй, "Дууссан" badge
- **🖼 Олон зураг** — бүтээгдэхүүн бүрт 3-4 зурагтай gallery
- **✅ Toast мэдэгдэл** — нэмэх/устгах/захиалга үед амьд reaction
- **📝 Form validation** — утас, имэйл, шаардлагатай талбарууд
- **📋 Захиалга** — амжилттай үед store-д хадгалагдана → admin дээр харагдана

### Админ талаас (`/admin`, нууц үг: `admin123`):
- **📊 Тойм** — бодит орлого, захиалга, статистик
- **➕ Бүтээгдэхүүн нэмэх/засах/устгах** — өөрчлөлт хадгалагдана
- **🖼 Олон зураг засах** — нэмэх/хасах
- **📦 Захиалгын төлөв** — Хүлээгдэж буй → Хүргэгдэж буй → Дууссан → Цуцлагдсан
- **👁 Захиалга харах** — хэрэглэгчийн мэдээлэл, бүтээгдэхүүн, нийт дүн
- **🔄 Reset** — анхны бүтээгдэхүүн рүү буцах

## 🏗 Архитектур

**State management — Zustand + persist middleware:**

```
lib/store/
├── cart.ts       # Сагс (localStorage: baganuur-cart)
├── products.ts   # Бүтээгдэхүүн (localStorage: baganuur-products)
├── orders.ts     # Захиалга (localStorage: baganuur-orders)
└── toast.ts      # Toast мэдэгдэл (memory)
```

**Бүх өгөгдөл browser-ийн localStorage дээр хадгалагдана.**

## 📂 Файлын бүтэц

```
app/
├── page.tsx              # Нүүр
├── shop/                 # Дэлгүүр (search + filter)
├── product/[id]/         # Бүтээгдэхүүн (gallery)
├── cart/                 # Сагс
├── checkout/             # Захиалга (validation)
├── about/                # Бидний тухай
├── contact/              # Холбогдох
├── admin/                # Админ (CRUD)
└── not-found.tsx         # 404

components/
├── Navbar.tsx            # Cart icon, search, mobile menu
├── Footer.tsx
├── ProductCard.tsx       # Stock badge, quick add
├── CartDrawer.tsx        # Хажуугийн drawer
├── SearchModal.tsx       # Modal search
└── Toaster.tsx           # Toast notification

lib/
├── products.ts           # Initial data
└── store/                # Zustand stores
```

## 🧪 Туршилт

1. Бүтээгдэхүүн сонгож сагсанд нэм → Cart drawer гарна
2. Refresh хий → Сагс хэвээр үлдэнэ ✓
3. Checkout хийж захиалга өг
4. `/admin` (нууц үг: `admin123`) → захиалга харагдана
5. Захиалгын төлөв өөрчил → шинэчлэгдэнэ
6. Бүтээгдэхүүн нэмж/засаж/устга → Shop дээр шууд тусна

## 🎨 Дизайн

- **Өнгө:** дулаан натурал (cream + walnut + accent)
- **Фонт:** Cormorant Garamond + Inter
- **Adaptive:** mobile, tablet, desktop

## 🚀 Production

```bash
npm run build
npm start
```

## 📝 Цаашдын хөгжүүлэлт

- Backend API (Next.js API routes + Prisma + PostgreSQL)
- Хэрэглэгчийн нэвтрэх (NextAuth)
- Жинхэнэ төлбөрийн систем (QPay, Pocket)
- Зургийн upload (Cloudinary)
- Имэйл мэдэгдэл (Resend)
- Аналитик (Vercel Analytics)

---

© Baganuur Investment Group
