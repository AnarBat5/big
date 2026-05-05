export type Product = {
  id: string;
  name: string;
  category: "buidan" | "sandal" | "shiree" | "or" | "shuugee";
  categoryName: string;
  price: number;
  images: string[];
  description: string;
  material: string;
  dimensions: string;
  inStock: number;
  featured?: boolean;
};

export const categories = [
  { id: "buidan", name: "Буйдан" },
  { id: "sandal", name: "Сандал" },
  { id: "shiree", name: "Ширээ" },
  { id: "or", name: "Ор" },
  { id: "shuugee", name: "Шүүгээ" },
];

export const initialProducts: Product[] = [];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("mn-MN").format(price) + "₮";

export const products = initialProducts;

export function getProduct(id: string): Product | undefined {
  return initialProducts.find((p) => p.id === id);
}
