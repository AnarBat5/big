import "server-only";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/products";

function toFrontend(p: Record<string, unknown>): Product {
  return {
    id:           p.id as string,
    name:         p.name as string,
    category:     p.category as Product["category"],
    categoryName: p.category_name as string,
    price:        p.price as number,
    images:       (p.images as string[]) ?? [],
    description:  (p.description as string) ?? "",
    material:     (p.material as string) ?? "",
    dimensions:   (p.dimensions as string) ?? "",
    inStock:      (p.in_stock as number) ?? 0,
    featured:     (p.featured as boolean) ?? false,
  };
}

// Cached query — Vercel will reuse this across requests for `revalidate` seconds.
// `revalidateTag('products')` from admin actions invalidates instantly.
export const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(toFrontend);
    } catch (err) {
      console.error("getProducts error:", err instanceof Error ? err.message : err);
      return [];
    }
  },
  ["products"],
  { revalidate: 60, tags: ["products"] }
);

export async function getProductById(id: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.id === id) ?? null;
}
