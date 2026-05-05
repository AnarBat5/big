const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load .env.local
fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const [k, ...rest] = line.split('=');
  if (k && rest.length) process.env[k.trim()] = rest.join('=').trim();
});

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Products inline (from lib/products.ts)
const products = [
  { id:"1", name:"Хангай буйдан", category:"buidan", category_name:"Буйдан", price:2850000, images:["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800","https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=800"], description:"Гурван хүний суудалтай, зөөлөн даавуун бүрээстэй буйдан.", material:"Натурал даавуу, царс мод", dimensions:"210 × 90 × 85 см", in_stock:5, featured:true },
  { id:"2", name:"Алтай арын буйдан", category:"buidan", category_name:"Буйдан", price:3450000, images:["https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800","https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=800"], description:"L хэлбэрийн өнцгийн буйдан, том гэр бүлд зориулсан.", material:"Жинхэнэ арьс, ган суурь", dimensions:"280 × 180 × 80 см", in_stock:3, featured:true },
  { id:"3", name:"Говийн ганц сандал", category:"sandal", category_name:"Сандал", price:680000, images:["https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800","https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800"], description:"Эртний хээтэй, гар хийцийн модон сандал.", material:"Хус мод, шир бүрээс", dimensions:"70 × 75 × 90 см", in_stock:12, featured:true },
  { id:"4", name:"Хүрээ ажлын сандал", category:"sandal", category_name:"Сандал", price:920000, images:["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800","https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800"], description:"Эргономик дизайнтай ажлын сандал.", material:"Mesh даавуу, хөнгөн цагаан", dimensions:"65 × 65 × 110 см", in_stock:8, featured:true },
  { id:"5", name:"Тэрэлж хоолны ширээ", category:"shiree", category_name:"Ширээ", price:1850000, images:["https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800","https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800"], description:"6 хүний хоолны ширээ, натурал царс модоор хийсэн.", material:"Бүтэн царс мод", dimensions:"180 × 90 × 75 см", in_stock:4, featured:false },
  { id:"6", name:"Хөвсгөл кофены ширээ", category:"shiree", category_name:"Ширээ", price:750000, images:["https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800","https://images.unsplash.com/photo-1565374395542-0ce18882c857?w=800"], description:"Дугуй хэлбэртэй кофены ширээ.", material:"Царс мод, шил", dimensions:"90 × 90 × 45 см", in_stock:6, featured:false },
  { id:"7", name:"Орхон давхар ор", category:"or", category_name:"Ор", price:2200000, images:["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800","https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"], description:"2 давхар ор, хөвөн матрасстай.", material:"Хуш мод, хөвөн матрас", dimensions:"200 × 160 × 110 см", in_stock:3, featured:true },
  { id:"8", name:"Чингис ор", category:"or", category_name:"Ор", price:3800000, images:["https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?w=800","https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=800"], description:"King size ор, шир толгойтой.", material:"Жинхэнэ арьс, царс мод", dimensions:"200 × 200 × 130 см", in_stock:2, featured:true },
  { id:"9", name:"Монгол шүүгээ", category:"shuugee", category_name:"Шүүгээ", price:1250000, images:["https://images.unsplash.com/photo-1595428773083-0de8d23c3efc?w=800","https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800"], description:"Уламжлалт хээтэй 4 хаалгатай шүүгээ.", material:"Хуш мод, гар будаг", dimensions:"160 × 45 × 180 см", in_stock:5, featured:false },
  { id:"10", name:"Дархан номын шүүгээ", category:"shuugee", category_name:"Шүүгээ", price:980000, images:["https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?w=800","https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"], description:"5 тавцант нээлттэй номын шүүгээ.", material:"Царс мод", dimensions:"120 × 35 × 200 см", in_stock:7, featured:false },
  { id:"11", name:"Эрдэнэт 3 суудалт буйдан", category:"buidan", category_name:"Буйдан", price:1950000, images:["https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800","https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"], description:"Эдийн засагтай 3 суудалт буйдан.", material:"Microfiber даавуу, хусны мод", dimensions:"195 × 85 × 82 см", in_stock:8, featured:false },
  { id:"12", name:"Завхан ажлын ширээ", category:"shiree", category_name:"Ширээ", price:1100000, images:["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800","https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800"], description:"L хэлбэрийн өргөн ажлын ширээ.", material:"MDF, металл суурь", dimensions:"160 × 80 × 75 см", in_stock:10, featured:false },
];

async function seed() {
  console.log('Seeding', products.length, 'products to Supabase...');
  const { data, error } = await sb.from('products').upsert(products, { onConflict: 'id' });
  if (error) {
    console.error('ERROR:', error.message);
    if (error.message.includes('does not exist')) {
      console.log('\n⚠ Хүснэгт байхгүй байна. Supabase SQL Editor дээр schema.sql ажиллуулна уу!');
      console.log('Файл: lib/supabase/schema.sql');
    }
  } else {
    console.log('✅ Seed амжилттай!');
  }
}

seed().catch(console.error);
