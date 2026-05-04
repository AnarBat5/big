# 🚀 Baganuur Investment Group — Deployment Guide

## Шаардлагатай үйлчилгээнүүд

| Үйлчилгээ | Зориулалт | Үнэ |
|-----------|-----------|-----|
| [Supabase](https://supabase.com) | Database + Auth | Үнэгүй (500MB) |
| [Vercel](https://vercel.com) | Hosting | Үнэгүй |
| [Resend](https://resend.com) | Имэйл | Үнэгүй (3000/сар) |
| [QPay](https://merchant.qpay.mn) | Монгол төлбөр | Мерчант данс |

---

## 1. Supabase тохируулга

### 1.1 Суурь үүсгэх
1. [supabase.com](https://supabase.com) → **New project** дарна
2. Project name: `baganuur-store`
3. Database password: хадгалаарай
4. Region: **Singapore** (хамгийн ойрхон)

### 1.2 Schema суулгах
1. Supabase → **SQL Editor** → **New query**
2. `lib/supabase/schema.sql` файлын бүтэн агуулгыг paste хийгээд **Run** дарна

### 1.3 Admin хэрэглэгч үүсгэх
1. Supabase → **Authentication** → **Users** → **Invite user**
2. Email: таны имэйл
3. Password: хүсэлтийнхээ дагуу тохируулна

### 1.4 API Keys авах
Supabase → **Settings** → **API**:
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon / public key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role key (**нууц байлгана!**)

---

## 2. QPay тохируулга

1. [merchant.qpay.mn](https://merchant.qpay.mn) дээр мерчант данс нээнэ
2. QPay менежерээс авах зүйлс:
   - `QPAY_USERNAME` — мерчантын нэвтрэх нэр
   - `QPAY_PASSWORD` — нууц үг
   - `QPAY_INVOICE_CODE` — invoice code (ж: `BAGANUUR_INVOICE`)

---

## 3. Resend тохируулга

1. [resend.com](https://resend.com) → Sign up
2. **API Keys** → **Create API Key**
3. `RESEND_API_KEY` = `re_xxxxxxxx...`
4. Domain нэмэх (заавал биш, `onboarding@resend.dev`-ээр тест хийж болно)

---

## 4. Vercel Deploy

### 4.1 Vercel данс
1. [vercel.com](https://vercel.com) → GitHub-ээр нэвтрэнэ
2. **Import Project** → `AnarBat5/big` сонгоно
3. **Framework**: Next.js (автоматаар таних)

### 4.2 Environment Variables
Vercel dashboard → Project → **Settings** → **Environment Variables** дараах хувьсагчдыг нэмнэ:

```
NEXT_PUBLIC_SUPABASE_URL        = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   = eyJxxx...
SUPABASE_SERVICE_ROLE_KEY       = eyJxxx...
QPAY_USERNAME                   = your_username
QPAY_PASSWORD                   = your_password
QPAY_INVOICE_CODE               = YOUR_INVOICE_CODE
RESEND_API_KEY                  = re_xxx...
ADMIN_EMAIL                     = admin@yourdomain.mn
NEXT_PUBLIC_APP_URL             = https://your-project.vercel.app
```

### 4.3 Deploy
**Deploy** товч дарна → 2-3 минутын дараа амьдрах болно.

---

## 5. Бүтээгдэхүүн seed хийх

Vercel дээр гарсны дараа:
1. Браузерт `/admin` очно → имэйл, нууц үгээрээ нэвтрэнэ
2. **Бүтээгдэхүүн** tab → **Seed / Сэргээх** товч дарна
3. Supabase-д бүх бүтээгдэхүүн хадгалагдана ✅

---

## 6. Custom Domain (заавал биш)

Vercel → Project → **Settings** → **Domains** → `baganuurig.mn` нэмнэ  
DNS provider дээр:
- `A` record: `76.76.21.21`
- `CNAME` record: `cname.vercel-dns.com`

---

## ✅ Production Checklist

- [ ] Supabase project үүсгэсэн
- [ ] Schema SQL ажиллуулсан  
- [ ] Admin user Supabase Auth-д нэмсэн
- [ ] QPay мерчант данс нээсэн
- [ ] Resend API key авсан
- [ ] Vercel-д deploy хийсэн
- [ ] Environment variables тохируулсан
- [ ] Бүтээгдэхүүн seed хийсэн
- [ ] /admin нэвтэрч шалгасан
- [ ] Тест захиалга хийж имэйл ирснийг шалгасан
