export type Product = {
  id: string;
  name: string;
  category: "buidan" | "sandal" | "shiree" | "or" | "shuugee";
  categoryName: string;
  price: number;
  image: string;
  description: string;
  material: string;
  dimensions: string;
  inStock: number;
};

export const categories = [
  { id: "buidan", name: "Буйдан" },
  { id: "sandal", name: "Сандал" },
  { id: "shiree", name: "Ширээ" },
  { id: "or", name: "Ор" },
  { id: "shuugee", name: "Шүүгээ" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Хангай буйдан",
    category: "buidan",
    categoryName: "Буйдан",
    price: 2850000,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    description: "Гурван хүний суудалтай, зөөлөн даавуун бүрээстэй буйдан. Зочны өрөөнд тохиромжтой.",
    material: "Натурал даавуу, царс мод",
    dimensions: "210 × 90 × 85 см",
    inStock: 5,
  },
  {
    id: "2",
    name: "Алтай арын буйдан",
    category: "buidan",
    categoryName: "Буйдан",
    price: 3450000,
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800",
    description: "L хэлбэрийн өнцгийн буйдан, том гэр бүлд зориулсан.",
    material: "Жинхэнэ арьс, ган суурь",
    dimensions: "280 × 180 × 80 см",
    inStock: 3,
  },
  {
    id: "3",
    name: "Говийн ганц сандал",
    category: "sandal",
    categoryName: "Сандал",
    price: 680000,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800",
    description: "Эртний хээтэй, гар хийцийн модон сандал.",
    material: "Хус мод, шир бүрээс",
    dimensions: "70 × 75 × 90 см",
    inStock: 12,
  },
  {
    id: "4",
    name: "Хүрээ ажлын сандал",
    category: "sandal",
    categoryName: "Сандал",
    price: 920000,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800",
    description: "Эргономик дизайнтай, өндөр тохируулагатай ажлын сандал.",
    material: "Mesh даавуу, хөнгөн цагаан",
    dimensions: "65 × 65 × 110 см",
    inStock: 8,
  },
  {
    id: "5",
    name: "Тэрэлж хоолны ширээ",
    category: "shiree",
    categoryName: "Ширээ",
    price: 1850000,
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800",
    description: "6 хүний хоолны ширээ, натурал царс модоор хийсэн.",
    material: "Бүтэн царс мод",
    dimensions: "180 × 90 × 75 см",
    inStock: 4,
  },
  {
    id: "6",
    name: "Хөвсгөл кофены ширээ",
    category: "shiree",
    categoryName: "Ширээ",
    price: 750000,
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800",
    description: "Дугуй хэлбэртэй, доод тавиуртай кофены ширээ.",
    material: "Шилмүүст мод, төмөр суурь",
    dimensions: "90 × 90 × 45 см",
    inStock: 7,
  },
  {
    id: "7",
    name: "Орхон хоёр хүний ор",
    category: "or",
    categoryName: "Ор",
    price: 3200000,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
    description: "King size хэмжээтэй, өндөр толгойтой ор.",
    material: "Нэхмэл даавуу, хатуу мод",
    dimensions: "200 × 200 × 110 см",
    inStock: 2,
  },
  {
    id: "8",
    name: "Богд ганц хүний ор",
    category: "or",
    categoryName: "Ор",
    price: 1450000,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
    description: "Хүүхэд, залуучуудад зориулсан ганц хүний ор.",
    material: "Нарс мод",
    dimensions: "100 × 200 × 90 см",
    inStock: 6,
  },
  {
    id: "9",
    name: "Сэлэнгэ хувцасны шүүгээ",
    category: "shuugee",
    categoryName: "Шүүгээ",
    price: 2150000,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
    description: "4 хаалгатай, толин хаалгатай хувцасны том шүүгээ.",
    material: "MDF, толь",
    dimensions: "200 × 60 × 220 см",
    inStock: 3,
  },
  {
    id: "10",
    name: "Хэнтий номын тавиур",
    category: "shuugee",
    categoryName: "Шүүгээ",
    price: 980000,
    image: "https://images.unsplash.com/photo-1588279102080-4cad6c4eb33d?w=800",
    description: "Өндөр, нээлттэй тавиуртай номын шүүгээ.",
    material: "Хатуу мод",
    dimensions: "120 × 35 × 200 см",
    inStock: 9,
  },
  {
    id: "11",
    name: "Хархорум удирдлагын ширээ",
    category: "shiree",
    categoryName: "Ширээ",
    price: 2750000,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800",
    description: "Удирдлагын өрөөнд зориулсан том ажлын ширээ.",
    material: "Бүтэн царс, арьсан тавцан",
    dimensions: "200 × 100 × 78 см",
    inStock: 2,
  },
  {
    id: "12",
    name: "Дархан зөөлөн сандал",
    category: "sandal",
    categoryName: "Сандал",
    price: 1250000,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800",
    description: "Унтаж амрах боломжтой, өргөн хийцтэй зөөлөн сандал.",
    material: "Велюр даавуу",
    dimensions: "85 × 90 × 95 см",
    inStock: 5,
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("mn-MN").format(price) + "₮";

export const getProduct = (id: string) => products.find((p) => p.id === id);
